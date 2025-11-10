import { createPaymentSession, handleMercadoPagoWebhook } from "../utils/paymentService.js";
import prisma from "../config/db.js";

export async function startPayment(req, res, next) {
  try {
    const { items } = req.body;
    if (!items || !items.length) return res.status(400).json({ error: "Nenhum item informado" });
    const payment = await createPaymentSession(items);
    res.json(payment);
  } catch (err) {
    next(err);
  }
}

export async function mpWebhook(req, res) {
  try {
    // express.raw was used in route
    const payload = await handleMercadoPagoWebhook(req.body);
    // here you should validate and call Mercado Pago API for event type details (recommended)
    console.log("MP webhook payload:", payload);

    // Example: if payload contains preference id, find order and update status
    if (payload?.id) {
      // For real MP webhooks you need to call MP API to get payment/subscription details
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error", err);
    res.sendStatus(500);
  }
}
