import express from 'express';
import {
	getAllPlans,
	getAllPlansAdmin,
	getPlanById,
	createPlan,
	updatePlan,
	deletePlan,
	togglePlanStatus,
} from '../controllers/plan.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/', getAllPlans);

// Admin routes
router.get('/admin', authMiddleware, adminMiddleware, getAllPlansAdmin);
router.get('/:id', authMiddleware, adminMiddleware, getPlanById);
router.post('/', authMiddleware, adminMiddleware, createPlan);
router.patch('/:id', authMiddleware, adminMiddleware, updatePlan);
router.patch('/:id/toggle-status', authMiddleware, adminMiddleware, togglePlanStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deletePlan);

export default router;
