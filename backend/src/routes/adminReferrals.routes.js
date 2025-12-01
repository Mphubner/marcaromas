import express from 'express';
import {
    getOverview,
    getPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
    getConversions,
    approveConversion,
    rejectConversion,
    batchPayout,
    getPayouts,
    processPayout,
    getTopReferrers,
    getRevenueTimeline,
    getSocialMentions,
    approveSocialMention,
    rejectSocialMention,
    // Legacy
    getAllReferrals,
    getReferralStats,
    markReferralAsPaid
} from '../controllers/adminReferrals.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// All routes require authentication AND admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Overview & Stats
router.get('/overview', getOverview);
router.get('/stats', getReferralStats); // Legacy

// Programs Management
router.get('/programs', getPrograms);
router.post('/programs', createProgram);
router.put('/programs/:id', updateProgram);
router.delete('/programs/:id', deleteProgram);

// Conversions
router.get('/conversions', getConversions);
router.post('/conversions/:id/approve', approveConversion);
router.post('/conversions/:id/reject', rejectConversion);

// Analytics
router.get('/analytics/top-referrers', getTopReferrers);
router.get('/analytics/revenue-timeline', getRevenueTimeline);

// Payouts
router.get('/payouts', getPayouts);
router.post('/payouts/:id/process', processPayout);
router.post('/batch-payout', batchPayout);

// Social Media
router.get('/social-mentions', getSocialMentions);
router.post('/social-mentions/:id/approve', approveSocialMention);
router.post('/social-mentions/:id/reject', rejectSocialMention);

// Legacy routes (for backward compatibility)
router.get('/', getAllReferrals);
router.post('/:id/mark-paid', markReferralAsPaid);

export default router;
