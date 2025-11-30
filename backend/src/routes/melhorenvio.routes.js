import express from 'express';
import melhorEnvioController from '../controllers/melhorenvio.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public endpoint - calculate shipping rates
router.post('/calculate', melhorEnvioController.calculateShipping);

// Protected endpoints
router.post('/create-order', authMiddleware, melhorEnvioController.createShippingOrder);
router.get('/tracking/:code', melhorEnvioController.getTracking);
router.post('/cancel', authMiddleware, melhorEnvioController.cancelShipping);

export default router;
