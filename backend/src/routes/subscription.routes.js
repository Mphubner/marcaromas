import express from "express";
import { listPlans, createSubscription } from "../controllers/subscription.controller.js";
const router = express.Router();

router.get("/plans", listPlans);
router.post("/", createSubscription);

export default router;
