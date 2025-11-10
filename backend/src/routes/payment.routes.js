import express from "express";
import { startPayment, mpWebhook } from "../controllers/payment.controller.js";
const router = express.Router();

router.post("/start", startPayment);
router.post("/webhook", express.raw({ type: "*/*" }), mpWebhook); // raw to get body for verification

export default router;
