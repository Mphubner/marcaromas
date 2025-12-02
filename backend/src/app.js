import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";
import passport from "./config/googleAuth.js";
import { globalLimiter, authLimiter } from "./middleware/rateLimiter.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import achievementRoutes from "./routes/achievement.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import userRoutes from "./routes/user.routes.js";
import addressRoutes from "./routes/address.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import melhorEnvioRoutes from "./routes/melhorenvio.routes.js";
import healthRoutes from "./routes/health.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import pageRoutes from "./routes/page.routes.js";
import planRoutes from "./routes/plan.routes.js";
import preferencesRoutes from "./routes/preferences.routes.js";
import giftRoutes from "./routes/gift.routes.js";
import pageSettingsRoutes from "./routes/page-settings.routes.js";
import boxRoutes from "./routes/box.routes.js";
import referralsRoutes from "./routes/referrals.routes.js";
import adminReferralsRoutes from "./routes/adminReferrals.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import logsRoutes from "./routes/logs.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import contentRoutes from "./routes/content.routes.js";
import configRoutes from "./routes/config.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import contentVersionRoutes from "./routes/contentVersion.routes.js";
import { getCurrentBox } from "./controllers/box.controller.js";

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

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression
app.use(compression());

// Apply global rate limiter
app.use(globalLimiter);

// Initialize Passport
app.use(passport.initialize());

// ----------------------
// 🛣️ ROTAS PRINCIPAIS
// ----------------------
app.use("/auth", authLimiter, authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/payment", paymentRoutes);

// ----------------------
// 📄 ROTAS DE CONTEÚDO E PÁGINA
// ----------------------
app.use("/page-settings", pageRoutes);
app.use("/plans", planRoutes);
app.use("/preferences", preferencesRoutes);
app.use("/gifts", giftRoutes);
app.use("/page-settings", pageSettingsRoutes);
app.use("/boxes", boxRoutes);
app.get("/current-box", getCurrentBox);
app.use("/reviews", reviewRoutes);

// Store - unified products + boxes for public
app.use('/', storeRoutes);

// ----------------------
// 🧪 TESTE E MIDDLEWARE
// ----------------------
app.get("/", (req, res) =>
  res.json({
    ok: true,
    env: process.env.PAYMENT_GATEWAY || "mercadopago",
    frontend: process.env.FRONTEND_URL,
    mode: process.env.NODE_ENV || "development"
  })
);

app.use("/contact", contactRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/users", userRoutes);
app.use("/address", addressRoutes);
app.use("/coupons", couponRoutes);
app.use("/melhor-envio", melhorEnvioRoutes);
app.use("/health", healthRoutes);
app.use("/referrals", referralsRoutes);
app.use("/admin/referrals", adminReferralsRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/uploads", uploadRoutes);
app.use("/logs", logsRoutes);
app.use("/settings", settingsRoutes);
app.use("/content", contentRoutes);
app.use("/config", configRoutes);
app.use("/notifications", notificationRoutes);
app.use("/customers", customerRoutes);
app.use("/content-versions", contentVersionRoutes);
app.use("/achievement", achievementRoutes);

app.use(errorHandler);

export default app;
