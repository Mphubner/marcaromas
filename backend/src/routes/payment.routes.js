import express from "express";
import { createPreference, mpWebhook } from "../controllers/payment.controller.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rota para criar a preferência de pagamento (protegida)
router.post("/create-preference", authMiddleware, createPreference);

// Rota para pagamento com cartão (checkout transparente)
import { payWithCard } from "../controllers/payment.controller.js";
router.post("/pay", authMiddleware, payWithCard);

// Rota para receber webhooks do Mercado Pago
router.post("/webhook", express.raw({ type: "application/json" }), mpWebhook);

export default router;
