import express from 'express';
import { getAllSettings, updateSettings, getPublicConfig } from '../controllers/config.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Public route - no auth needed
router.get('/public', getPublicConfig);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllSettings);
router.put('/', authMiddleware, adminMiddleware, updateSettings);

export default router;
