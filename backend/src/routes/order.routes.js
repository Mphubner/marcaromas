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

// IMPORTANT: Specific routes BEFORE dynamic routes
// This line must come before /:orderId to prevent 'recent' being treated as an ID
import { prisma } from '../lib/prisma.js';
router.get('/recent', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: req.user.isAdmin ? {} : { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } }
      }
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Dynamic route - MUST come after specific routes like /recent
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
