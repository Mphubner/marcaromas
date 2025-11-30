import express from 'express';
import {
  createGift,
  getGiftById,
  sendGiftNotification,
  getAllGifts
} from '../controllers/gift.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// POST /api/gifts - Create a gift subscription
router.post('/', authenticate, createGift);

// GET /api/gifts/:id - Get gift by ID
router.get('/:id', getGiftById);

// POST /api/gifts/:id/notify - Send notification to recipient
router.post('/:id/notify', sendGiftNotification);

// GET /api/gifts - Get all gifts (admin only - add admin middleware if needed)
router.get('/', getAllGifts);

export default router;
