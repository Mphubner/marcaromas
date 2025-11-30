import express from "express";
import { register, login, googleCallback, googleTokenExchange, me } from "../controllers/auth.controller.js";
import passport from "passport";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Traditional auth
router.post("/register", register);
router.post("/login", login);

// Google OAuth
router.post("/google", googleTokenExchange);

// get current user
router.get('/me', authMiddleware, me);

// OAuth2 callback (if using server-side OAuth flow)
router.get("/google/callback", passport.authenticate("google", { session: false }), googleCallback);

// OAuth2 redirect to Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

export default router;
