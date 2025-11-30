// ADMIN: Listar todas as assinaturas
export const getAllSubscriptionsAdmin = async (req, res, next) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: true,
        plan: true,
        history: {
          orderBy: { createdAt: 'desc' },
          take: 5 // Últimos 5 eventos para lista
        }
      },
      orderBy: { startedAt: 'desc' },
    });
    res.json(subscriptions);
  } catch (error) {
    next(error);
  }
};

// ADMIN: Buscar assinatura por ID
export const getSubscriptionByIdAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await prisma.subscription.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        plan: true,
        history: {
          orderBy: { createdAt: 'desc' }
        }
      },
    });
    if (!subscription) return res.status(404).json({ message: 'Assinatura não encontrada.' });
    res.json(subscription);
  } catch (error) {
    next(error);
  }
};

// ADMIN: Editar assinatura
export const updateSubscriptionAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, planId, shippingAddress, preferences } = req.body;
    const updated = await prisma.subscription.update({
      where: { id: parseInt(id) },
      data: { status, planId, shippingAddress, preferences },
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// ADMIN: Deletar assinatura
export const deleteSubscriptionAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.subscription.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { prisma } from '../lib/prisma.js';

// Get Mercado Pago subscription access token with fallback logic
const mpSubscriptionToken =
  process.env.MERCADOPAGO_ACCESS_TOKEN_SUBS ||
  process.env.MERCADOPAGO_ACCESS_TOKEN;

// Configura o Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: mpSubscriptionToken,
});
const preapproval = new PreApproval(client);

// Criar uma nova assinatura
export const createSubscription = async (req, res, next) => {
  try {
    const { planId, shippingAddress, preferences } = req.body;
    const userId = req.user.id;

    // Buscar o plano
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      return res.status(404).json({ message: 'Plano não encontrado ou inativo.' });
    }

    // Criar PreApproval no Mercado Pago
    const preApprovalData = {
      reason: `Assinatura - ${plan.name}`,
      auto_recurring: {
        frequency: plan.billingFrequency || 1, // 1 = monthly
        frequency_type: 'months',
        transaction_amount: parseFloat(plan.price),
        currency_id: 'BRL',
      },
      back_url: `${process.env.FRONTEND_URL}/subscription/success`,
      payer_email: req.user.email,
    };

    const mpResponse = await preapproval.create({ body: preApprovalData });

    // Criar assinatura no banco de dados
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId: planId,
        status: 'pending', // Will be updated via webhook when user approves
        mpSubscriptionId: mpResponse.id,
        shippingAddress: shippingAddress || null,
        preferences: preferences || null,
        startedAt: null, // Will be set when approved
      },
      include: { plan: true },
    });

    // Retornar URL de aprovação
    res.json({
      subscription,
      approvalUrl: mpResponse.init_point, // URL para o usuário aprovar
      subscriptionId: mpResponse.id,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    next(error);
  }
};

// Buscar todas as assinaturas do usuário logado
export const getMySubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user.id },
      include: { plan: true },
      orderBy: { startedAt: 'desc' },
    });
    res.json(subscriptions);
  } catch (error) {
    next(error);
  }
};

// Atualizar uma assinatura (status, plano, etc.)
export const updateSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const { status, planId, shippingAddress, preferences } = req.body;

    const subscription = await prisma.subscription.findFirst({
      where: { id: parseInt(subscriptionId), userId: req.user.id },
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Assinatura não encontrada.' });
    }

    // Lógica para interagir com o Mercado Pago (pausar, reativar, etc.)
    if (status && subscription.mpSubscriptionId) {
      await preapproval.update({
        id: subscription.mpSubscriptionId,
        body: { status: status === 'paused' ? 'paused' : 'authorized' },
      });
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: parseInt(subscriptionId) },
      data: { status, planId, shippingAddress, preferences },
    });

    res.json(updatedSubscription);
  } catch (error) {
    next(error);
  }
};

// Cancelar uma assinatura
export const cancelSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await prisma.subscription.findFirst({
      where: { id: parseInt(subscriptionId), userId: req.user.id },
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Assinatura não encontrada.' });
    }

    if (subscription.mpSubscriptionId) {
      await preapproval.update({
        id: subscription.mpSubscriptionId,
        body: { status: 'cancelled' },
      });
    }

    await prisma.subscription.update({
      where: { id: parseInt(subscriptionId) },
      data: { status: 'cancelled' },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};



