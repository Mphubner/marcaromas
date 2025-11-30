import express from 'express';
import { getMyAchievements } from '../controllers/achievement.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my-achievements', authMiddleware, getMyAchievements);

export default router;
