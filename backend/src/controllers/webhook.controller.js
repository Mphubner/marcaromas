/**
 * Webhook Controller for Mercado Pago
 * Handles IPN notifications for payments and subscriptions
 */

import { MercadoPagoConfig, Payment, PreApproval } from 'mercadopago';
import { prisma } from '../lib/prisma.js';

// Get access tokens with fallback logic
const mpPaymentToken =
    process.env.MERCADOPAGO_ACCESS_TOKEN_TRANSPARENT ||
    process.env.MERCADOPAGO_ACCESS_TOKEN;

const mpSubscriptionToken =
    process.env.MERCADOPAGO_ACCESS_TOKEN_SUBS ||
    process.env.MERCADOPAGO_ACCESS_TOKEN;

const paymentClient = new MercadoPagoConfig({
    accessToken: mpPaymentToken,
});

const subscriptionClient = new MercadoPagoConfig({
    accessToken: mpSubscriptionToken,
});

const paymentAPI = new Payment(paymentClient);
const preapprovalAPI = new PreApproval(subscriptionClient);

// Store processed notification IDs to prevent duplicate processing
const processedNotifications = new Set();

/**
 * Main webhook endpoint
 * Receives notifications from Mercado Pago
 */
export const handleMercadoPagoWebhook = async (req, res, next) => {
    try {
        // Always respond 200 OK immediately to Mercado Pago
        res.status(200).send('OK');

        const { type, action, data } = req.body;
        const dataId = data?.id;

        // Log received webhook
        console.log('[MP Webhook] Received:', { type, action, dataId });

        if (!dataId) {
            console.warn('[MP Webhook] No data.id in webhook');
            return;
        }

        // Check if already processed (idempotency)
        const notificationKey = `${type}-${dataId}`;
        if (processedNotifications.has(notificationKey)) {
            console.log('[MP Webhook] Already processed:', notificationKey);
            return;
        }

        // Process based on type
        if (type === 'payment') {
            await handlePaymentNotification(dataId);
        } else if (type === 'subscription_preapproval' || type === 'subscription_authorized_payment') {
            await handleSubscriptionNotification(dataId);
        } else {
            console.log('[MP Webhook] Unhandled type:', type);
        }

        // Mark as processed
        processedNotifications.add(notificationKey);

        // Clear old processed notifications (keep last 1000)
        if (processedNotifications.size > 1000) {
            const iterator = processedNotifications.values();
            for (let i = 0; i < 500; i++) {
                processedNotifications.delete(iterator.next().value);
            }
        }

    } catch (error) {
        console.error('[MP Webhook] Error:', error);
        // Don't throw - already responded to MP
    }
};

/**
 * Handle payment notifications
 */
async function handlePaymentNotification(paymentId) {
    try {
        // Fetch payment details from Mercado Pago
        const payment = await paymentAPI.get({ id: paymentId });

        console.log('[MP Payment] Status:', payment.status, 'ID:', paymentId);

        // Find order or gift by preference ID or external reference
        const externalReference = payment.external_reference;
        if (!externalReference) {
            console.warn('[MP Payment] No external_reference');
            return;
        }

        // Check if this is a gift payment
        if (externalReference.startsWith('gift-')) {
            await handleGiftPayment(payment, externalReference);
            return;
        }

        // Handle regular order payment
        const order = await prisma.order.findFirst({
            where: {
                OR: [
                    { id: parseInt(externalReference) },
                    { mpPreferenceId: payment.id?.toString() }
                ]
            }
        });

        if (!order) {
            console.warn('[MP Payment] Order not found:', externalReference);
            return;
        }

        // Update order status based on payment status
        const statusMap = {
            approved: 'paid',
            pending: 'pending',
            in_process: 'processing',
            rejected: 'cancelled',
            cancelled: 'cancelled',
            refunded: 'refunded',
            charged_back: 'refunded',
        };

        const newStatus = statusMap[payment.status] || 'pending';

        await prisma.order.update({
            where: { id: order.id },
            data: {
                status: newStatus,
                mpPaymentId: payment.id?.toString(),
                paymentDetails: {
                    status: payment.status,
                    status_detail: payment.status_detail,
                    payment_method: payment.payment_method_id,
                    payment_type: payment.payment_type_id,
                    transaction_amount: payment.transaction_amount,
                    date_approved: payment.date_approved,
                }
            },
        });

        console.log(`[MP Payment] Order ${order.id} updated to ${newStatus}`);

        // TODO: Send email notification to user
        // TODO: If approved, trigger shipping label creation

    } catch (error) {
        console.error('[MP Payment] Error handling notification:', error);
    }
}

/**
 * Handle gift payment notifications
 */
async function handleGiftPayment(payment, externalReference) {
    try {
        // Extract gift ID from external reference (gift-123)
        const giftId = parseInt(externalReference.replace('gift-', ''));

        const gift = await prisma.gift.findUnique({
            where: { id: giftId }
        });

        if (!gift) {
            console.warn('[MP Gift Payment] Gift not found:', giftId);
            return;
        }

        // Map payment status
        const statusMap = {
            approved: 'paid',
            pending: 'pending',
            in_process: 'pending',
            rejected: 'failed',
            cancelled: 'failed',
        };

        const paymentStatus = statusMap[payment.status] || 'pending';
        const giftStatus = paymentStatus === 'paid' ? 'paid' : 'pending';

        // Update gift
        await prisma.gift.update({
            where: { id: giftId },
            data: {
                paymentStatus,
                status: giftStatus,
                mpPaymentId: payment.id?.toString(),
                paymentDetails: {
                    status: payment.status,
                    status_detail: payment.status_detail,
                    payment_method: payment.payment_method_id,
                    payment_type: payment.payment_type_id,
                    transaction_amount: payment.transaction_amount,
                    date_approved: payment.date_approved,
                },
            },
        });

        console.log(`[MP Gift Payment] Gift ${giftId} updated to ${giftStatus}`);

        // If payment is approved and sendImmediate is true, trigger notification
        if (paymentStatus === 'paid' && gift.sendImmediate) {
            console.log('[MP Gift Payment] TODO: Send immediate notification to recipient');
            // TODO: Call notification service or add to job queue
        }

    } catch (error) {
        console.error('[MP Gift Payment] Error handling gift payment:', error);
    }
}


/**
 * Handle subscription notifications
 */
async function handleSubscriptionNotification(subscriptionId) {
    try {
        // Fetch subscription details from Mercado Pago
        const mpSubscription = await preapprovalAPI.get({ id: subscriptionId });

        console.log('[MP Subscription] Status:', mpSubscription.status, 'ID:', subscriptionId);

        // Find subscription in database
        const subscription = await prisma.subscription.findFirst({
            where: { mpSubscriptionId: subscriptionId }
        });

        if (!subscription) {
            console.warn('[MP Subscription] Not found in database:', subscriptionId);
            return;
        }

        // Map MP statuses to our statuses
        const statusMap = {
            authorized: 'active',
            pending: 'pending',
            paused: 'paused',
            cancelled: 'cancelled',
        };

        const newStatus = statusMap[mpSubscription.status] || 'pending';
        const updateData = {
            status: newStatus,
        };

        // Set startedAt when first authorized
        if (mpSubscription.status === 'authorized' && !subscription.startedAt) {
            updateData.startedAt = new Date();
        }

        await prisma.subscription.update({
            where: { id: subscription.id },
            data: updateData,
        });

        console.log(`[MP Subscription] Subscription ${subscription.id} updated to ${newStatus}`);

        // TODO: Send email notification to user
        // TODO: If first payment, create first box shipment

    } catch (error) {
        console.error('[MP Subscription] Error handling notification:', error);
    }
}

export default {
    handleMercadoPagoWebhook,
};
