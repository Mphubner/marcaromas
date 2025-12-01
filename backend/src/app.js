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
import contactRoutes from "./routes/contact.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import achievementRoutes from "./routes/achievement.routes.js";
import userRoutes from "./routes/user.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import referralsRoutes from "./routes/referrals.routes.js";
import adminReferralsRoutes from "./routes/adminReferrals.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import configRoutes from "./routes/config.routes.js";
import contentRoutes from "./routes/content.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import pageRoutes from "./routes/page.routes.js";
import planRoutes from "./routes/plan.routes.js";
import preferencesRoutes from "./routes/preferences.routes.js";
import giftRoutes from "./routes/gift.routes.js";
import pageSettingsRoutes from "./routes/page-settings.routes.js";
import boxRoutes from "./routes/box.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import melhorEnvioRoutes from "./routes/melhorenvio.routes.js";
import healthRoutes from "./routes/health.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import storeRoutes from "./routes/store.js";

import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

// CORS - Configure allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

// Add production URLs if available
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Add custom domain if configured
if (process.env.CUSTOM_DOMAIN) {
  allowedOrigins.push(`https://${process.env.CUSTOM_DOMAIN}`);
  allowedOrigins.push(`https://www.${process.env.CUSTOM_DOMAIN}`);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// ----------------------
// 🛣️ ROTAS PRINCIPAIS
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payment", paymentRoutes);

// ----------------------
// 📄 ROTAS DE CONTEÚDO E PÁGINA
// ----------------------
app.use("/api/page-settings", pageRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/preferences", preferencesRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/page-settings", pageSettingsRoutes);
import { getCurrentBox } from "./controllers/box.controller.js";

app.use("/api/boxes", boxRoutes);
app.get("/api/current-box", getCurrentBox);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/referrals", referralsRoutes);
app.use("/api/admin/referrals", adminReferralsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/config", configRoutes);
app.use("/api/content", contentRoutes);
import contentVersionRoutes from './routes/contentVersion.routes.js';
app.use("/api/content", contentVersionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/achievements", achievementRoutes);

// Serve uploaded files (local storage)
import path from "path";
app.use('/uploads', express.static(path.resolve('./uploads')));

// Uploads
app.use('/api/uploads', uploadRoutes);
app.use('/api/melhor-envio', melhorEnvioRoutes);

// Health checks
app.use('/api/health', healthRoutes);

// Webhooks (no auth required)
app.use('/api/webhooks', webhookRoutes);

// Store - unified products + boxes for public
app.use('/api', storeRoutes);

// ----------------------
// 🧪 TESTE E MIDDLEWARE
// ----------------------
app.get("/api", (req, res) =>
  res.json({
    ok: true,
    env: process.env.PAYMENT_GATEWAY || "mercadopago",
    frontend: process.env.FRONTEND_URL,
    mode: process.env.NODE_ENV || "development"
  })
);

app.use(errorHandler);

export default app;
