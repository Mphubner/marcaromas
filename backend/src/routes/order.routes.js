import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  updateOrderShipping,
  generateShippingLabel,
  cancelOrder,
  refundOrder,
  addOrderNote
} from '../controllers/order.controller.js';

const router = express.Router();

// ============ USER ROUTES ============
router.post('/', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getMyOrders);

// ============ ADMIN ROUTES ============
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.get('/:orderId', authMiddleware, adminMiddleware, getOrderById);
router.patch('/:orderId', authMiddleware, adminMiddleware, updateOrder);

// Specific admin actions
router.patch('/:orderId/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.patch('/:orderId/shipping', authMiddleware, adminMiddleware, updateOrderShipping);
router.post('/:orderId/label', authMiddleware, adminMiddleware, generateShippingLabel);
router.post('/:orderId/cancel', authMiddleware, adminMiddleware, cancelOrder);
router.post('/:orderId/refund', authMiddleware, adminMiddleware, refundOrder);
router.post('/:orderId/notes', authMiddleware, adminMiddleware, addOrderNote);

export default router;
