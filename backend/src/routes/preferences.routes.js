import express from 'express';
import { getUserPreferences, updateUserPreferences } from '../controllers/preferences.controller.js';
import { authOptional } from '../middlewares/authOptional.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/user/preferences', authOptional, getUserPreferences);
router.put('/user/preferences', authMiddleware, updateUserPreferences);

export default router;