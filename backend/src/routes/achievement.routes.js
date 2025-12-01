import express from 'express';
import {
    getMyAchievements,
    getMyUnlockedAchievements,
    getAchievementProgress,
    getLeaderboard,
    getAvailableRewards,
    claimReward,
    getMyStats,
} from '../controllers/achievement.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// User achievement routes (require auth)
router.get('/my-achievements', authMiddleware, getMyAchievements);
router.get('/unlocked', authMiddleware, getMyUnlockedAchievements);
router.get('/progress/:id', authMiddleware, getAchievementProgress);
router.get('/my-stats', authMiddleware, getMyStats);

// Leaderboard (public)
router.get('/leaderboard', getLeaderboard);

// Rewards (require auth)
router.get('/rewards', authMiddleware, getAvailableRewards);
router.post('/rewards/:id/claim', authMiddleware, claimReward);

export default router;
