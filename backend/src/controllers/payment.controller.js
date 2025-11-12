



import { MercadoPagoConfig, Preference } from 'mercadopago';
import { prisma } from '../lib/prisma.js';
import dotenv from 'dotenv';
import { sendPaymentConfirmationEmail, sendPaymentFailureEmail } from '../utils/emailService.js';

dotenv.config();

// Support separate credentials for subscriptions vs transparent checkout (store products)
function createMpClient(accessToken) {
  return new MercadoPagoConfig({ accessToken });
}

// For preferences (Checkout Pro), use subscription or default token
const subToken = process.env.MERCADOPAGO_ACCESS_TOKEN_SUBS || process.env.MERCADOPAGO_ACCESS_TOKEN;
const client = createMpClient(subToken);

export async function createPreference(req, res, next) {
  try {
    const { items, payer, shipping_address } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "A lista de itens não pode estar vazia." });
    }
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        total: totalAmount,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.unit_price,
          })),
        },
      },
    });

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: 'BRL',
        })),
        payer: {
          name: payer.name,
          email: payer.email,
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/payment/success`,
          failure: `${process.env.FRONTEND_URL}/payment/failure`,
          pending: `${process.env.FRONTEND_URL}/payment/pending`,
        },
        auto_return: 'approved',
        external_reference: order.id.toString(),
  notification_url: `${process.env.API_URL}/api/payment/webhook`,
      },
    });

    res.json({ id: result.id, init_point: result.init_point });

  } catch (error) {
    console.error("Erro ao criar preferência de pagamento:", error);
    next(error);
  }
}

export async function mpWebhook(req, res) {
  try {
    const { query } = req;
    
    console.log('🔔 Webhook Mercado Pago recebido:', { 
      type: query.type, 
      data: query.data
    });

    const webhookType = query.type;
    const paymentId = query['data.id'];

    if (webhookType !== 'payment') {
      console.log('⏭️  Tipo de webhook ignorado:', webhookType);
      return res.status(200).json({ received: true });
    }

    if (!paymentId) {
      console.warn('⚠️  ID de pagamento não encontrado');
      return res.status(400).json({ error: 'Payment ID required' });
    }

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN_TRANSPARENT || process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    });

    if (!mpRes.ok) {
      console.error(`❌ Erro ao buscar pagamento ${paymentId}`);
      return res.status(500).json({ error: 'Failed to fetch payment info' });
    }

    const mpPayment = await mpRes.json();
    const { status, external_reference, status_detail } = mpPayment;
    const orderId = parseInt(external_reference);

    console.log(`💳 Pagamento ${paymentId}:`, { status, orderId });

    if (!orderId || isNaN(orderId)) {
      console.warn('⚠️  Order ID inválido');
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    let orderStatus = 'PENDING';
    switch (status) {
      case 'approved':
      case 'authorized':
        orderStatus = 'CONFIRMED';
        break;
      case 'in_process':
        orderStatus = 'PROCESSING';
        break;
      case 'rejected':
      case 'failed':
        orderStatus = 'FAILED';
        break;
      case 'cancelled':
        orderStatus = 'CANCELLED';
        break;
      case 'refunded':
        orderStatus = 'REFUNDED';
        break;
      case 'charged_back':
        orderStatus = 'CHARGEBACK';
        break;
      default:
        orderStatus = 'PENDING';
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: orderStatus },
      include: { user: true, items: true }
    });

    console.log(`✅ Pedido #${orderId} atualizado para: ${orderStatus}`);

    if (orderStatus === 'CONFIRMED' || orderStatus === 'PROCESSING') {
      await sendPaymentConfirmationEmail(updatedOrder, updatedOrder.user);
    }

    if (orderStatus === 'FAILED') {
      await sendPaymentFailureEmail(updatedOrder, updatedOrder.user, status_detail || 'Pagamento recusado');
    }

    res.status(200).json({ received: true, orderId, status: orderStatus });

  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    res.status(200).json({ error: error.message });
  }
}

export async function payWithCard(req, res, next) {
  try {
    const { token, items, installments = 1, payer } = req.body;
    const user = req.user;

    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!token) return res.status(400).json({ error: 'Card token is required' });
    if (!items || !items.length) return res.status(400).json({ error: 'Items required' });

    // Validate products exist to avoid FK violations
    const productIds = items.map(it => it.id);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const missing = productIds.filter(id => !products.find(p => p.id === id));
    if (missing.length > 0) {
      return res.status(400).json({ error: `Produtos não encontrados: ${missing.join(',')}` });
    }

    // Calculate total using item prices (prefer unit_price if provided)
    const totalAmount = items.reduce((s, it) => s + (it.unit_price || it.price || 0) * (it.quantity || 1), 0);

    // Create order and related items (safe because products validated)
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: user.id } },
        total: totalAmount,
        status: 'PENDING',
        items: { create: items.map(it => ({ productId: it.id, quantity: it.quantity, price: it.unit_price || it.price })) },
      },
      include: { user: true }
    });

    // Use transparent credentials (specific for store products payment API calls)
    const transparentToken = process.env.MERCADOPAGO_ACCESS_TOKEN_TRANSPARENT || process.env.MERCADOPAGO_ACCESS_TOKEN;

    const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${transparentToken}`,
      },
      body: JSON.stringify({
        transaction_amount: Number(totalAmount.toFixed(2)),
        token,
        description: `Pedido #${order.id}`,
        installments: Number(installments || 1),
        payment_method_id: 'visa',
        payer: {
          email: payer?.email || user.email,
          identification: payer?.identification || undefined,
        },
        external_reference: order.id.toString(),
      }),
    });

    const mpData = await mpRes.json();

    console.log('💳 Resposta Mercado Pago:', mpData);

    let orderStatus = 'PENDING';
    if (mpData.status === 'approved') {
      orderStatus = 'CONFIRMED';
      await sendPaymentConfirmationEmail(order, user);
    } else if (mpData.status === 'rejected' || mpData.status === 'failed') {
      orderStatus = 'FAILED';
      await sendPaymentFailureEmail(order, user, mpData.status_detail || 'Pagamento recusado');
    }

    await prisma.order.update({ 
      where: { id: order.id }, 
      data: { status: orderStatus } 
    });

    res.json({ order, payment: mpData });
  } catch (err) {
    console.error('Error processing card payment', err);
    next(err);
  }
}
