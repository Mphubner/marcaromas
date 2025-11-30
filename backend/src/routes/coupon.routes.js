import express from 'express';
import {
  getAllCoupons,
  getCouponById,
  getCouponStats,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  bulkToggleStatus,
  bulkImportCoupons,
  validateCoupon,
} from '../controllers/coupon.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllCoupons);
router.get('/stats', authMiddleware, adminMiddleware, getCouponStats);
router.get('/:couponId', authMiddleware, adminMiddleware, getCouponById);
router.post('/', authMiddleware, adminMiddleware, createCoupon);
router.post('/bulk-import', authMiddleware, adminMiddleware, bulkImportCoupons);
router.post('/bulk-toggle', authMiddleware, adminMiddleware, bulkToggleStatus);
router.patch('/:couponId', authMiddleware, adminMiddleware, updateCoupon);
router.delete('/:couponId', authMiddleware, adminMiddleware, deleteCoupon);

// Public route (for cart validation)
router.get('/validate/:code', validateCoupon);

export default router;
