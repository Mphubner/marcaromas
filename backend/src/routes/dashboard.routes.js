import express from 'express';
import { getDashboardData } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getDashboardData);
router.get('/stats', authMiddleware, getDashboardData); // Alias for main dashboard

export default router;
