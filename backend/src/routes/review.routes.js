import { Router } from "express";
import { getApprovedReviews } from "../controllers/review.controller.js";

const router = Router();
router.get("/approved-reviews", getApprovedReviews);
export default router;
