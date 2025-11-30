import express from 'express';
import { getAnalyticsData, getBusinessIntelligence } from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Analytics routes (admin only)
router.get('/', authMiddleware, adminMiddleware, getAnalyticsData);
router.get('/insights', authMiddleware, adminMiddleware, getBusinessIntelligence);

export default router;
