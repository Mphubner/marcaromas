import express from "express";
import { 
  listPlans, 
  createSubscription,
  subscriptionWebhook,
  getSubscription,
  listSubscriptions,
  cancelSubscription 
} from "../controllers/subscription.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/plans", listPlans);
router.post("/webhook", subscriptionWebhook);

// Protected routes (require authentication)
router.post("/", authMiddleware, createSubscription);
router.get("/", authMiddleware, listSubscriptions);
router.get("/:subscriptionId", authMiddleware, getSubscription);
router.delete("/:subscriptionId", authMiddleware, cancelSubscription);

export default router;
