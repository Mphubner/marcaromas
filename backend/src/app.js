import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "./config/googleAuth.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

import pageRoutes from "./routes/page.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import planRoutes from "./routes/plan.routes.js";
import preferencesRoutes from "./routes/preferences.routes.js";
import giftRoutes from "./routes/gift.routes.js";
import pageSettingsRoutes from "./routes/page-settings.routes.js";
import boxRoutes from "./routes/box.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";

import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// ----------------------
// ��� ROTAS PRINCIPAIS
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payment", paymentRoutes);

// ----------------------
// ��� ROTAS DE CONTEÚDO E PÁGINA
// ----------------------
app.use("/api", pageRoutes);           // /api/page-settings/hero
app.use("/api", planRoutes);           // /api/plans
app.use("/api", preferencesRoutes);    // /api/user/preferences
app.use("/api", giftRoutes);           // /api/gifts
app.use("/api", pageSettingsRoutes);   // /api/page-settings/*
app.use("/api", boxRoutes);            // /api/current-box
app.use("/api", reviewsRoutes);        // /api/approved-reviews

// ----------------------
// ��� TESTE E MIDDLEWARE
// ----------------------
app.get("/api", (req, res) =>
  res.json({
    ok: true,
    env: process.env.PAYMENT_GATEWAY || "mercadopago",
  })
);

app.use(errorHandler);

export default app;
