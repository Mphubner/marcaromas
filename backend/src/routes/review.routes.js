import express from 'express';
import {
  getAllReviews,
  getReviewStats,
  getApprovedReviews,
  approveReview,
  respondToReview,
  reportReview,
  bulkApprove,
  bulkReject,
  deleteReview,
} from '../controllers/review.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Public routes
router.get('/approved', getApprovedReviews);
router.get('/approved/:productId', getApprovedReviews);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllReviews);
router.get('/stats', authMiddleware, adminMiddleware, getReviewStats);
router.patch('/:reviewId/approve', authMiddleware, adminMiddleware, approveReview);
router.patch('/:reviewId/respond', authMiddleware, adminMiddleware, respondToReview);
router.patch('/:reviewId/report', authMiddleware, adminMiddleware, reportReview);
router.post('/bulk-approve', authMiddleware, adminMiddleware, bulkApprove);
router.post('/bulk-reject', authMiddleware, adminMiddleware, bulkReject);
router.delete('/:reviewId', authMiddleware, adminMiddleware, deleteReview);

export default router;
