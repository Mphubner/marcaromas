import express from 'express';
import { createPaymentPreference, createPixPayment, createTransparentPayment, checkPaymentStatus, getPaymentStatus } from '../controllers/payment.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Checkout Pro (redirect to MP)
router.post('/create-preference', authMiddleware, createPaymentPreference);

// Transparent Checkout (card tokenized in frontend)
router.post('/create-transparent', authMiddleware, createTransparentPayment);

// PIX payment  
router.post('/create-pix', authMiddleware, createPixPayment);

// Check payment status (for PIX polling)
router.get('/check/:paymentId', authMiddleware, checkPaymentStatus);

// Get order payment status
router.get('/status/:orderId', authMiddleware, getPaymentStatus);

export default router;

