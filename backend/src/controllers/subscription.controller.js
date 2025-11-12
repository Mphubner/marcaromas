import prisma from "../config/db.js";
import dotenv from "dotenv";
import { sendPaymentConfirmationEmail, sendPaymentFailureEmail } from '../utils/emailService.js';

dotenv.config();

/**
 * Return available plans (static for now)
 */
export async function listPlans(req, res, next) {
  res.json([
    { id: "monthly-1", title: "Clube Mensal - 1 vela", price: 59.9 },
    { id: "quarter-1", title: "Clube Trimestral - 3 meses", price: 169.9 },
  ]);
}

/**
 * Create a subscription using Mercado Pago Subscriptions API (recurring billing)
 * 
 * Flow:
 * 1. Receive card token from frontend
 * 2. Create Subscription record in DB (status: pending)
 * 3. Call Mercado Pago Subscriptions API to create recurring agreement
 * 4. Store subscription ID from MP in DB
 * 5. Automatic first charge happens on MP side
 * 
 * NOTE: This is different from Checkout Pro - subscriptions are recurring,
 * not one-time redirects.
 */
export async function createSubscription(req, res, next) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { planId, cardToken } = req.body;
    if (!planId) return res.status(400).json({ error: 'planId is required' });
    if (!cardToken) return res.status(400).json({ error: 'cardToken is required' });

    // Map planId to plan details
    const plans = {
      'monthly-1': { title: 'Clube Mensal - 1 vela', price: 59.9, frequency: 'months', frequency_type: 1 },
      'quarter-1': { title: 'Clube Trimestral - 3 meses', price: 169.9, frequency: 'months', frequency_type: 3 },
    };
    const plan = plans[planId];
    if (!plan) return res.status(400).json({ error: 'Plano inválido' });

    // Create subscription record in DB (status: pending)
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId,
        status: 'pending',
      },
    });

    // Call Mercado Pago Subscriptions API to create recurring agreement
    const subToken = process.env.MERCADOPAGO_ACCESS_TOKEN_SUBS || process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    const mpRes = await fetch('https://api.mercadopago.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${subToken}`,
      },
      body: JSON.stringify({
        reason: plan.title,
        external_reference: `SUB-${subscription.id}`,
        payer_email: user.email,
        card_token_id: cardToken,
        auto_recurring: {
          frequency: plan.frequency_type,
          frequency_type: plan.frequency, // 'days', 'weeks', 'months', 'years'
          start_date: new Date().toISOString(),
          end_date: null, // null = indefinite
          transaction_amount: Number(plan.price.toFixed(2)),
          currency_id: 'BRL',
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/subscription/success`,
          failure: `${process.env.FRONTEND_URL}/subscription/failure`,
          pending: `${process.env.FRONTEND_URL}/subscription/pending`,
        },
        notification_url: `${process.env.API_URL}/api/subscriptions/webhook`,
      }),
    });

    const mpData = await mpRes.json();

    if (!mpRes.ok) {
      console.error('❌ Erro ao criar assinatura no Mercado Pago:', mpData);
      
      // Update subscription status to failed
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'failed' },
      });

      return res.status(400).json({ 
        error: 'Erro ao criar assinatura', 
        details: mpData 
      });
    }

    // Subscription created successfully in MP
    // Update DB subscription with MP subscription ID and status
    const mpSubscriptionId = mpData.id;
    const mpStatus = mpData.status;

    // Map MP status to our status
    let localStatus = 'pending';
    if (mpStatus === 'authorized' || mpStatus === 'active') {
      localStatus = 'active';
    } else if (mpStatus === 'pending') {
      localStatus = 'pending';
    } else if (mpStatus === 'cancelled' || mpStatus === 'rejected') {
      localStatus = 'failed';
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        mpSubscriptionId,
        status: localStatus,
      },
    });

    console.log(`✅ Assinatura criada: ID=${mpSubscriptionId}, Status=${mpStatus}`);

    // Send confirmation email if subscription is active
    if (localStatus === 'active') {
      const user_data = await prisma.user.findUnique({ where: { id: user.id } });
      // You may want to send a subscription confirmation email here
      // await sendSubscriptionConfirmationEmail(updatedSubscription, user_data, plan);
    }

    res.json({ 
      subscription: updatedSubscription, 
      mpSubscription: mpData 
    });
  } catch (err) {
    console.error('❌ Erro ao criar assinatura:', err);
    next(err);
  }
}

/**
 * Webhook handler for Mercado Pago subscription charge notifications
 */
export async function subscriptionWebhook(req, res) {
  try {
    const { type, data } = req.body;

    console.log('🔔 Webhook Subscriptions recebido:', { type, data });

    if (!type || !data) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    // Handle different event types
    if (type === 'charge.succeeded') {
      // Charge was successful
      const chargeId = data.id;
      const subscriptionId = data.subscription_id;
      const status = data.status;

      console.log(`✅ Cobrança bem-sucedida: ${chargeId} (Assinatura: ${subscriptionId})`);

      // Update subscription status if needed
      if (subscriptionId) {
        await prisma.subscription.updateMany({
          where: { mpSubscriptionId: subscriptionId.toString() },
          data: { status: 'active' },
        });
      }

      return res.status(200).json({ received: true });
    }

    if (type === 'charge.failed') {
      // Charge failed
      const chargeId = data.id;
      const subscriptionId = data.subscription_id;

      console.log(`❌ Cobrança falhou: ${chargeId} (Assinatura: ${subscriptionId})`);

      if (subscriptionId) {
        await prisma.subscription.updateMany({
          where: { mpSubscriptionId: subscriptionId.toString() },
          data: { status: 'failed' },
        });
      }

      return res.status(200).json({ received: true });
    }

    if (type === 'subscription.cancelled') {
      const subscriptionId = data.id;

      console.log(`🚫 Assinatura cancelada: ${subscriptionId}`);

      await prisma.subscription.updateMany({
        where: { mpSubscriptionId: subscriptionId.toString() },
        data: { status: 'cancelled' },
      });

      return res.status(200).json({ received: true });
    }

    // Other event types can be logged but not acted upon
    console.log(`⚠️ Tipo de evento não tratado: ${type}`);
    return res.status(200).json({ received: true });

  } catch (err) {
    console.error('❌ Erro ao processar webhook de assinatura:', err);
    return res.status(200).json({ error: err.message });
  }
}

/**
 * Get subscription details
 */
export async function getSubscription(req, res, next) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { subscriptionId } = req.params;
    if (!subscriptionId) return res.status(400).json({ error: 'subscriptionId is required' });

    const subscription = await prisma.subscription.findFirst({
      where: {
        id: parseInt(subscriptionId),
        userId: user.id,
      },
    });

    if (!subscription) return res.status(404).json({ error: 'Subscription not found' });

    res.json(subscription);
  } catch (err) {
    next(err);
  }
}

/**
 * List user subscriptions
 */
export async function listSubscriptions(req, res, next) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(subscriptions);
  } catch (err) {
    next(err);
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(req, res, next) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { subscriptionId } = req.params;
    if (!subscriptionId) return res.status(400).json({ error: 'subscriptionId is required' });

    const subscription = await prisma.subscription.findFirst({
      where: {
        id: parseInt(subscriptionId),
        userId: user.id,
      },
    });

    if (!subscription) return res.status(404).json({ error: 'Subscription not found' });
    if (!subscription.mpSubscriptionId) return res.status(400).json({ error: 'MP subscription ID not found' });

    // Call Mercado Pago to cancel subscription
    const subToken = process.env.MERCADOPAGO_ACCESS_TOKEN_SUBS || process.env.MERCADOPAGO_ACCESS_TOKEN;

    const cancelRes = await fetch(
      `https://api.mercadopago.com/v1/subscriptions/${subscription.mpSubscriptionId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${subToken}`,
        },
      }
    );

    if (!cancelRes.ok) {
      const errData = await cancelRes.json();
      return res.status(400).json({ error: 'Erro ao cancelar assinatura', details: errData });
    }

    // Update local subscription status
    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'cancelled' },
    });

    console.log(`✅ Assinatura cancelada: ${subscription.mpSubscriptionId}`);

    res.json({ message: 'Subscription cancelled', subscription: updated });
  } catch (err) {
    next(err);
  }
}

