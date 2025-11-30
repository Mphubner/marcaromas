import express from 'express';
import {
    getMyDashboard,
    getMyConversions,
    generateShareLink,
    requestPayout,
    getMyPayouts
} from '../controllers/referrals.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/referrals/my-dashboard
 * @desc    Get user's referral dashboard data
 * @access  Private
 */
router.get('/my-dashboard', getMyDashboard);

/**
 * @route   GET /api/referrals/my-conversions
 * @desc    Get user's conversions list
 * @access  Private
 * @query   status, dateFrom, dateTo, limit
 */
router.get('/my-conversions', getMyConversions);

/**
 * @route   POST /api/referrals/share
 * @desc    Generate shareable link for platform
 * @access  Private
 * @body    platform, message
 */
router.post('/share', generateShareLink);

/**
 * @route   POST /api/referrals/request-payout
 * @desc    Request payout of earnings
 * @access  Private
 * @body    amount, method, pixKey
 */
router.post('/request-payout', requestPayout);

/**
 * @route   GET /api/referrals/my-payouts
 * @desc    Get payout history
 * @access  Private
 */
router.get('/my-payouts', getMyPayouts);

export default router;
