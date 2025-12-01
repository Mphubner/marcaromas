import express from 'express';
import {
    getMyWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleNotification,
    checkProductInWishlist,
    getShareableLink,
    getSharedWishlist,
} from '../controllers/wishlist.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// User wishlist routes (require auth)
router.get('/my-wishlist', authMiddleware, getMyWishlist);
router.post('/add', authMiddleware, addToWishlist);
router.delete('/:id', authMiddleware, removeFromWishlist);
router.patch('/:id/notifications', authMiddleware, toggleNotification);
router.get('/check/:productId', authMiddleware, checkProductInWishlist);

// Share routes
router.get('/share', authMiddleware, getShareableLink);
router.get('/shared/:shareCode', getSharedWishlist); // Public route

export default router;
