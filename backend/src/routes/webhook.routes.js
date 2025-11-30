import express from 'express';
import webhookController from '../controllers/webhook.controller.js';

const router = express.Router();

/**
 * POST /api/webhooks/mercadopago
 * Receive IPN notifications from Mercado Pago
 * 
 * This endpoint should be registered in Mercado Pago dashboard:
 * https://www.mercadopago.com.br/developers/panel/webhooks
 */
router.post('/mercadopago', webhookController.handleMercadoPagoWebhook);

export default router;
