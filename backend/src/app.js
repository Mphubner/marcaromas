import express from "express";
import cors from "cors";
import dashboardRoutes from "./routes/dashboard.routes.js";
import achievementRoutes from "./routes/achievement.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import userRoutes from "./routes/user.routes.js";
import addressRoutes from "./routes/address.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
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
app.use("/api/auth", authLimiter, authRoutes);
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
