import express from 'express';
import {
    getMyNotifications,
    markAsRead,
    deleteNotification,
    getPreferences,
    updatePreferences,
    sendAdminNotification
} from '../controllers/notification.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// User Routes
router.get('/', getMyNotifications);
router.patch('/:notificationId/read', markAsRead);
router.delete('/:notificationId', deleteNotification);

// Preferences
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);

// Admin Routes
router.post('/send', adminMiddleware, sendAdminNotification);

export default router;
