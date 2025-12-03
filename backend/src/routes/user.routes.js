import express from 'express';
import {
    getMyProfile,
    updateMyProfile,
    updatePassword,
    uploadAvatar,
    getAllUsersAdmin,
    getUserById,
    updateUser,
    deleteUser,
    getUserOrders,
    getUserSubscriptions,
} from '../controllers/user.controller.js';
import { getScentProfile, updateScentProfile } from '../controllers/scentProfile.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// User profile routes (autenticado)
router.use(authMiddleware);

router.get('/profile', getMyProfile);
router.patch('/profile', updateMyProfile);
router.post('/password', updatePassword);
router.post('/avatar', uploadAvatar);

router.get('/scent-profile', getScentProfile);
router.post('/scent-profile', updateScentProfile);

// Admin routes
router.get('/admin', adminMiddleware, getAllUsersAdmin);
router.get('/admin/:userId', adminMiddleware, getUserById);
router.patch('/admin/:userId', adminMiddleware, updateUser);
router.delete('/admin/:userId', adminMiddleware, deleteUser);
router.get('/admin/:userId/orders', adminMiddleware, getUserOrders);
router.get('/admin/:userId/subscriptions', adminMiddleware, getUserSubscriptions);

export default router;
