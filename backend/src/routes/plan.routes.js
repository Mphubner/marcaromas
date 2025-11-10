// routes/plan.routes.js
import express from "express";
import { getPlans } from "../controllers/plan.controller.js";

const router = express.Router();

router.get("/plans", getPlans);

export default router;
