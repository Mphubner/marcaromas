import express from 'express';
import { 
  createSubscription,
  getMySubscriptions,
  getAllSubscriptionsAdmin,
  getSubscriptionByIdAdmin,
  updateSubscriptionAdmin,
  deleteSubscriptionAdmin,
  updateSubscription,
  cancelSubscription
} from '../controllers/subscription.controller.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();


// Rotas do usuário
router.use(authMiddleware);
router.post('/', createSubscription);
router.get('/my-subscriptions', getMySubscriptions);
router.patch('/:subscriptionId', updateSubscription);
router.delete('/:subscriptionId', cancelSubscription);

// Rotas de admin
router.get('/admin', authMiddleware, adminMiddleware, getAllSubscriptionsAdmin);
router.get('/admin/:id', authMiddleware, adminMiddleware, getSubscriptionByIdAdmin);
router.patch('/admin/:id', authMiddleware, adminMiddleware, updateSubscriptionAdmin);
router.delete('/admin/:id', authMiddleware, adminMiddleware, deleteSubscriptionAdmin);

export default router;


