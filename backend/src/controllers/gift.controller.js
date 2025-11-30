import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { prisma } from '../lib/prisma.js';
import { sendGiftNotificationEmail } from '../services/email.service.js';

// Get Mercado Pago access token
const mpAccessToken =
    process.env.MERCADOPAGO_ACCESS_TOKEN_TRANSPARENT ||
    process.env.MERCADOPAGO_ACCESS_TOKEN;

// Validate Mercado Pago configuration
if (!mpAccessToken) {
    console.error('[Gift] WARNING: MERCADOPAGO_ACCESS_TOKEN not configured.');
}

// Configure Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: mpAccessToken,
});
const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

/**
 * Create a gift subscription
 */
export const createGift = async (req, res, next) => {
    try {
        const {
            plan,
            duration,
            giver,
            recipient,
            message,
            scheduledDate,
            sendImmediate = true,
            extras = [],
            paymentMethod,
            installments = 1,
        } = req.body;

        // Validation
        if (!plan || !duration || !giver || !recipient) {
            return res.status(400).json({
                error: 'missing_required_fields',
                message: 'Plan, duration, giver, and recipient information are required.'
            });
        }

        // Calculate pricing
        const subscriptionTotal = parseFloat(plan.price) * parseInt(duration);
        let extrasTotal = 0;

        if (extras && extras.length > 0) {
            extrasTotal = extras.reduce((sum, extra) => {
                return sum + (parseFloat(extra.product?.price || 0) * parseInt(extra.quantity || 1));
            }, 0);
        }

        const subtotal = subscriptionTotal + extrasTotal;

        // Apply discount based on duration
        let discountPercentage = 0;
        if (duration >= 12) discountPercentage = 0.15;
        else if (duration >= 6) discountPercentage = 0.10;
        else if (duration >= 3) discountPercentage = 0.05;

        const discount = subscriptionTotal * discountPercentage;
        const total = subtotal - discount;

        // Create gift in database
        const gift = await prisma.gift.create({
            data: {
                planId: plan.id,
                duration: parseInt(duration),
                giverName: giver.name,
                giverEmail: giver.email,
                giverPhone: giver.phone || null,
                giverCPF: giver.cpf || null,
                recipientName: recipient.name,
                recipientEmail: recipient.email,
                recipientPhone: recipient.phone,
                recipientAddress: recipient.address,
                message: message || null,
                scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
                sendImmediate,
                extras: extras.length > 0 ? extras : null,
                subtotal,
                discount,
                total,
                paymentMethod,
                installments: parseInt(installments),
                status: 'pending',
                paymentStatus: 'pending',
            },
        });

        console.log('[Gift] Created gift:', gift.id);

        // Create payment preference with Mercado Pago
        if (!mpAccessToken) {
            return res.status(503).json({
                error: 'payment_not_configured',
                message: 'Sistema de pagamento não está configurado.'
            });
        }

        const preferenceItems = [
            {
                id: `gift-${gift.id}`,
                title: `Presente: Assinatura ${plan.name} - ${duration} ${duration === 1 ? 'mês' : 'meses'}`,
                description: `Presente para ${recipient.name}`,
                quantity: 1,
                unit_price: parseFloat(total),
                currency_id: 'BRL',
            }
        ];

        // Add extras to preference items
        if (extras && extras.length > 0) {
            extras.forEach(extra => {
                preferenceItems.push({
                    id: extra.product.id,
                    title: extra.product.name,
                    quantity: extra.quantity,
                    unit_price: parseFloat(extra.product.price),
                    currency_id: 'BRL',
                });
            });
        }

        const preference = {
            items: preferenceItems,
            payer: {
                name: giver.name,
                email: giver.email,
                phone: giver.phone ? {
                    area_code: giver.phone.substring(0, 2),
                    number: giver.phone.substring(2)
                } : undefined,
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/pagamento-sucesso?giftId=${gift.id}`,
                failure: `${process.env.FRONTEND_URL}/payment/failure?giftId=${gift.id}`,
                pending: `${process.env.FRONTEND_URL}/pagamento-pendente?giftId=${gift.id}`,
            },
            auto_return: 'approved',
            external_reference: `gift-${gift.id}`,
            statement_descriptor: 'MARC AROMAS GIFT',
            notification_url: `${process.env.API_URL || process.env.BACKEND_URL || 'http://localhost:5001'}/api/webhooks/mercadopago`,
            installments: parseInt(installments),
        };

        console.log('[Gift] Creating payment preference for gift:', gift.id);

        // Create preference in Mercado Pago
        const mpResponse = await preferenceClient.create({ body: preference });

        // Update gift with preference ID
        await prisma.gift.update({
            where: { id: gift.id },
            data: {
                mpPreferenceId: mpResponse.id,
            },
        });

        console.log('[Gift] Payment preference created:', mpResponse.id);

        // Return gift with payment info
        res.status(201).json({
            ok: true,
            gift: {
                id: gift.id,
                status: gift.status,
                total: gift.total,
            },
            payment: {
                preferenceId: mpResponse.id,
                init_point: mpResponse.init_point,
                sandbox_init_point: mpResponse.sandbox_init_point,
            },
        });

    } catch (error) {
        console.error('[Gift] Error creating gift:', error);

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
 * Get gift by ID
 */
export const getGiftById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const gift = await prisma.gift.findUnique({
            where: { id: parseInt(id) },
        });

        if (!gift) {
            return res.status(404).json({
                error: 'gift_not_found',
                message: 'Presente não encontrado.'
            });
        }

        res.json({
            ok: true,
            gift,
        });

    } catch (error) {
        console.error('[Gift] Error fetching gift:', error);
        next(error);
    }
};

/**
 * Send gift notification to recipient
 */
export const sendGiftNotification = async (req, res, next) => {
    try {
        const { id } = req.params;

        const gift = await prisma.gift.findUnique({
            where: { id: parseInt(id) },
        });

        if (!gift) {
            return res.status(404).json({
                error: 'gift_not_found',
                message: 'Presente não encontrado.'
            });
        }

        // Check if already notified
        if (gift.notifiedAt) {
            return res.status(400).json({
                error: 'already_notified',
                message: 'O presenteado já foi notificado.'
            });
        }

        // Check if payment is completed
        if (gift.paymentStatus !== 'paid') {
            return res.status(400).json({
                error: 'payment_not_completed',
                message: 'O pagamento ainda não foi confirmado.'
            });
        }

        // Get plan data
        const plan = await prisma.plan.findUnique({
            where: { id: gift.planId },
        });

        if (!plan) {
            return res.status(404).json({
                error: 'plan_not_found',
                message: 'Plano não encontrado.'
            });
        }

        // Send email notification to recipient
        console.log('[Gift] Sending notification email to:', gift.recipientEmail);

        const emailResult = await sendGiftNotificationEmail(
            {
                recipientName: gift.recipientName,
                recipientEmail: gift.recipientEmail,
                giverName: gift.giverName,
                message: gift.message,
                duration: gift.duration,
            },
            plan
        );

        if (!emailResult.success) {
            console.error('[Gift] Email send failed:', emailResult.error);
            // Still update status but log the error
        }

        // Update gift as notified
        const updatedGift = await prisma.gift.update({
            where: { id: gift.id },
            data: {
                status: 'notified',
                notifiedAt: new Date(),
            },
        });

        res.json({
            ok: true,
            message: emailResult.success
                ? 'Notificação enviada com sucesso!'
                : 'Status atualizado, mas falha no envio do email.',
            gift: updatedGift,
            emailSent: emailResult.success,
        });

    } catch (error) {
        console.error('[Gift] Error sending notification:', error);
        next(error);
    }
};

/**
 * Get all gifts (for admin)
 */
export const getAllGifts = async (req, res, next) => {
    try {
        const { status, paymentStatus, page = 1, limit = 10 } = req.query;

        const where = {};
        if (status) where.status = status;
        if (paymentStatus) where.paymentStatus = paymentStatus;

        const gifts = await prisma.gift.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit),
        });

        const total = await prisma.gift.count({ where });

        res.json({
            ok: true,
            gifts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });

    } catch (error) {
        console.error('[Gift] Error fetching gifts:', error);
        next(error);
    }
};

/**
 * Update gift payment status (called by webhook)
 */
export const updateGiftPaymentStatus = async (giftId, paymentData) => {
    try {
        const statusMap = {
            approved: 'paid',
            pending: 'pending',
            in_process: 'pending',
            rejected: 'failed',
            cancelled: 'failed',
        };

        const paymentStatus = statusMap[paymentData.status] || 'pending';
        const giftStatus = paymentStatus === 'paid' ? 'paid' : 'pending';

        const gift = await prisma.gift.update({
            where: { id: parseInt(giftId) },
            data: {
                paymentStatus,
                status: giftStatus,
                mpPaymentId: paymentData.id?.toString(),
                paymentDetails: paymentData,
            },
        });

        console.log('[Gift] Payment status updated:', gift.id, paymentStatus);

        // If payment is successful and sendImmediate is true, send notification
        if (paymentStatus === 'paid' && gift.sendImmediate) {
            // Get plan data
            const plan = await prisma.plan.findUnique({
                where: { id: gift.planId },
            });

            console.log('[Gift] Sending immediate notification to recipient');

            if (plan) {
                const emailResult = await sendGiftNotificationEmail(
                    {
                        recipientName: gift.recipientName,
                        recipientEmail: gift.recipientEmail,
                        giverName: gift.giverName,
                        message: gift.message,
                        duration: gift.duration,
                    },
                    plan
                );

                if (emailResult.success) {
                    // Update as notified
                    await prisma.gift.update({
                        where: { id: gift.id },
                        data: {
                            notifiedAt: new Date(),
                            status: 'notified',
                        },
                    });
                    console.log('[Gift] Immediate notification sent successfully');
                }
            }
        }

        return gift;

    } catch (error) {
        console.error('[Gift] Error updating payment status:', error);
        throw error;
    }
};

export default {
    createGift,
    getGiftById,
    sendGiftNotification,
    getAllGifts,
    updateGiftPaymentStatus,
};
