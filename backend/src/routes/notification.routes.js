import express from 'express';
import { getMyNotifications, markAsRead } from '../controllers/notification.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMyNotifications);
router.patch('/:notificationId/read', markAsRead);

export default router;
