import express from 'express';
import logsController from '../controllers/logs.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Apply auth and admin check to all log routes
router.use(authMiddleware, adminMiddleware);

router.get('/system', logsController.getSystemLogs);
router.get('/webhooks', logsController.getWebhookLogs);

export default router;
