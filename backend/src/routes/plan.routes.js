// routes/plan.routes.js
import express from "express";
import { getPlans, getPlanById } from "../controllers/plan.controller.js";

const router = express.Router();

router.get("/plans", getPlans);
router.get("/plans/:id", getPlanById);

export default router;
