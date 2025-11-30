import express from 'express';
import { getApprovedReviews } from '../controllers/review.controller.js';

const router = express.Router();

router.get('/approved-reviews', getApprovedReviews);

export default router;