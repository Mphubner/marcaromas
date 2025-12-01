import express from 'express';
import settingsController from '../controllers/settings.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Public route
router.get('/public/all', settingsController.getPublic);

// Admin routes
router.get('/:section', authMiddleware, adminMiddleware, settingsController.getSection);
router.put('/:section', authMiddleware, adminMiddleware, settingsController.updateSection);

export default router;
