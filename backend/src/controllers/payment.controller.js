import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { prisma } from '../lib/prisma.js';

// Get Mercado Pago access token with fallback logic
const mpAccessToken =
  process.env.MERCADOPAGO_ACCESS_TOKEN_TRANSPARENT ||
  process.env.MERCADOPAGO_ACCESS_TOKEN;

// Validate Mercado Pago configuration
if (!mpAccessToken) {
  console.error('[Payment] WARNING: MERCADOPAGO_ACCESS_TOKEN_TRANSPARENT or MERCADOPAGO_ACCESS_TOKEN not configured. Payments will fail.');
}

// Configure Mercado Pago with the Payment Access Token
const client = new MercadoPagoConfig({
  accessToken: mpAccessToken,
});
const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

/**
 * Create payment preference for checkout
 */
export const createPaymentPreference = async (req, res, next) => {
  try {
    // Validate access token
    if (!mpAccessToken) {
      return res.status(503).json({
        error: 'payment_not_configured',
        message: 'Sistema de pagamento não está configurado. Entre em contato com o suporte.'
      });
    }

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        error: 'missing_order_id',
        message: 'ID do pedido é obrigatório.'
      });
    }

    // Find order with items and user
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        items: { include: { product: true } },
        user: true
      },
    });

    if (!order) {
      return res.status(404).json({
        error: 'order_not_found',
        message: 'Pedido não encontrado.'
      });
    }

    // Validate order has items
    if (!order.items || order.items.length === 0) {
      return res.status(400).json({
        error: 'empty_order',
        message: 'Pedido não possui itens.'
      });
    }

    // Build preference data
    const preference = {
      items: order.items.map(item => {
        if (!item.product) {
          throw new Error(`Product not found for order item ${item.id}`);
        }
        return {
          id: item.productId.toString(),
          title: item.product.name || 'Produto',
          quantity: item.quantity || 1,
          unit_price: parseFloat(item.price) || 0,
          currency_id: 'BRL',
          description: item.product.description?.substring(0, 100) || '',
        };
      }),
      payer: {
        name: order.user?.name || '',
        email: order.user?.email || '',
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/payment/success?order_id=${order.id}`,
        failure: `${process.env.FRONTEND_URL}/payment/failure?order_id=${order.id}`,
        pending: `${process.env.FRONTEND_URL}/payment/pending?order_id=${order.id}`,
      },
      auto_return: 'approved',
      external_reference: order.id.toString(),
      statement_descriptor: 'MARC AROMAS',
      notification_url: `${process.env.API_URL || process.env.BACKEND_URL || 'http://localhost:5001'}/api/webhooks/mercadopago`,
    };

    console.log('[Payment] Creating preference for order:', order.id);

    // Create preference in Mercado Pago
    const response = await preferenceClient.create({ body: preference });

    // Save preference ID to order
    await prisma.order.update({
      where: { id: order.id },
      data: {
        mpPreferenceId: response.id,
        status: 'pending_payment',
      },
    });

    console.log('[Payment] Preference created:', response.id);

    // Return preference data
    res.json({
      ok: true,
      preferenceId: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point, // For testing
    });

  } catch (error) {
    console.error('[Payment] Error creating preference:', error);

    // Handle Mercado Pago specific errors
    if (error.cause) {
      return res.status(500).json({
        error: 'mercadopago_error',
        message: 'Erro ao processar pagamento com Mercado Pago.',
        details: error.message,
      });
    }

    next(error);
  }
};

/**
 * Create PIX payment
 */
export const createPixPayment = async (req, res, next) => {
  try {
    if (!mpAccessToken) {
      return res.status(503).json({
        error: 'payment_not_configured',
        message: 'Sistema de pagamento não está configurado.'
      });
    }

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        error: 'missing_order_id',
        message: 'ID do pedido é obrigatório.'
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { user: true, items: true }
    });

    if (!order) {
      return res.status(404).json({
        error: 'order_not_found',
        message: 'Pedido não encontrado.'
      });
    }

    console.log('[Payment] Creating PIX payment for order:', order.id);

    // Create PIX payment
    const payment = await paymentClient.create({
      body: {
        transaction_amount: parseFloat(order.total),
        payment_method_id: 'pix',
        description: `Pedido #${order.orderNumber}`,
        payer: {
          email: order.user?.email || 'cliente@marcaromas.com',
          first_name: order.user?.name?.split(' ')[0] || 'Cliente',
          last_name: order.user?.name?.split(' ').slice(1).join(' ') || '',
        },
        external_reference: order.id.toString(),
        notification_url: `${process.env.API_URL || process.env.BACKEND_URL || 'http://localhost:5001'}/api/webhooks/mercadopago`,
      },
    });

    // Update order with payment info
    await prisma.order.update({
      where: { id: order.id },
      data: {
        mpPaymentId: payment.id.toString(),
        paymentMethod: 'pix',
        status: 'pending_payment',
      }
    });

    console.log('[Payment] PIX payment created:', payment.id);

    res.json({
      ok: true,
      paymentId: payment.id,
      status: payment.status,
      qrCode: payment.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
      ticketUrl: payment.point_of_interaction?.transaction_data?.ticket_url,
    });

  } catch (error) {
    console.error('[Payment] Error creating PIX payment:', error);

    if (error.cause) {
      return res.status(500).json({
        error: 'mercadopago_error',
        message: 'Erro ao processar pagamento PIX.',
        details: error.message,
      });
    }

    next(error);
  }
};

/**
 * Check payment status (for polling)
 */
export const checkPaymentStatus = async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    console.log('[Payment] Checking payment status:', paymentId);

    const payment = await paymentClient.get({ id: paymentId });

    // Update order if payment approved
    if (payment.status === 'approved') {
      const order = await prisma.order.findFirst({
        where: { mpPaymentId: paymentId }
      });

      if (order && order.status !== 'paid') {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'paid',
            paymentStatus: 'approved',
            paymentDetails: {
              status: payment.status,
              status_detail: payment.status_detail,
              payment_type_id: payment.payment_type_id,
            }
          }
        });
        console.log('[Payment] Order updated to paid:', order.id);
      }
    }

    res.json({
      paymentId: payment.id,
      status: payment.status,
      statusDetail: payment.status_detail,
    });

  } catch (error) {
    console.error('[Payment] Error checking payment:', error);
    next(error);
  }
};

/**
 * Create transparent payment (card tokenized in frontend)
 */
export const createTransparentPayment = async (req, res, next) => {
  try {
    if (!mpAccessToken) {
      return res.status(503).json({
        error: 'payment_not_configured',
        message: 'Sistema de pagamento não está configurado.'
      });
    }

    const {
      orderId,
      token, // Card token from MercadoPago.js (frontend)
      installments,
      paymentMethodId,
      issuerId,
      payer
    } = req.body;

    if (!orderId || !token) {
      return res.status(400).json({
        error: 'missing_required_fields',
        message: 'orderId e token são obrigatórios.'
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { user: true }
    });

    if (!order) {
      return res.status(404).json({
        error: 'order_not_found',
        message: 'Pedido não encontrado.'
      });
    }

    console.log('[Payment] Creating transparent payment for order:', order.id);

    // Create payment with card token
    const payment = await paymentClient.create({
      body: {
        token, // Card token (secure, from MP.js)
        transaction_amount: parseFloat(order.total),
        installments: parseInt(installments) || 1,
        payment_method_id: paymentMethodId,
        issuer_id: issuerId,
        payer: {
          email: payer?.email || order.user?.email || 'cliente@marcaromas.com',
          identification: {
            type: payer?.identificationType || 'CPF',
            number: payer?.identificationNumber || '00000000000'
          }
        },
        external_reference: order.id.toString(),
        description: `Pedido #${order.orderNumber}`,
        statement_descriptor: 'MARC AROMAS',
        notification_url: `${process.env.API_URL || process.env.BACKEND_URL || 'http://localhost:5001'}/api/webhooks/mercadopago`,
      }
    });

    // Map payment status to order status
    const statusMap = {
      approved: 'paid',
      pending: 'pending_payment',
      in_process: 'processing',
      rejected: 'cancelled',
    };

    const orderStatus = statusMap[payment.status] || 'pending_payment';

    // Update order with payment info
    await prisma.order.update({
      where: { id: order.id },
      data: {
        mpPaymentId: payment.id.toString(),
        paymentMethod: paymentMethodId,
        status: orderStatus,
        paymentStatus: payment.status,
        paymentDetails: {
          status: payment.status,
          status_detail: payment.status_detail,
          payment_method: paymentMethodId,
          payment_type: payment.payment_type_id,
          installments: parseInt(installments) || 1,
        }
      }
    });

    console.log('[Payment] Transparent payment created:', payment.id, 'Status:', payment.status);

    res.json({
      ok: true,
      paymentId: payment.id,
      status: payment.status,
      statusDetail: payment.status_detail,
      approved: payment.status === 'approved',
    });

  } catch (error) {
    console.error('[Payment] Error creating transparent payment:', error);

    if (error.cause) {
      return res.status(500).json({
        error: 'mercadopago_error',
        message: 'Erro ao processar pagamento.',
        details: error.message,
      });
    }

    next(error);
  }
};

/**
 * Get payment status by order ID
 */
export const getPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      select: {
        id: true,
        status: true,
        mpPreferenceId: true,
        mpPaymentId: true,
        paymentDetails: true,
        total: true,
        createdAt: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    res.json({
      orderId: order.id,
      status: order.status,
      paymentStatus: order.paymentDetails?.status || 'pending',
      total: order.total,
      createdAt: order.createdAt,
    });

  } catch (error) {
    next(error);
  }
};

export default {
  createPaymentPreference,
  createPixPayment,
  createTransparentPayment,
  checkPaymentStatus,
  getPaymentStatus,
};

