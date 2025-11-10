// routes/page.routes.js
import express from "express";
import { getHeroSection } from "../controllers/page.controller.js";

const router = express.Router();

router.get("/page-settings/hero", getHeroSection);

export default router;
