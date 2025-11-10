import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

import pageRoutes from "./routes/page.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import planRoutes from "./routes/plan.routes.js";

import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ----------------------
// 🔹 ROTAS PRINCIPAIS
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payments", paymentRoutes);

// ----------------------
// 🔹 ROTAS DE CONTEÚDO E PÁGINA
// ----------------------
app.use("/api", pageRoutes);     // /api/page-settings/hero
app.use("/api", reviewRoutes);   // /api/approved-reviews
app.use("/api", planRoutes);     // /api/plans
app.use("/api", productRoutes);  // /api/current-box

// ----------------------
// 🔹 TESTE E MIDDLEWARE
// ----------------------
app.get("/api", (req, res) =>
  res.json({
    ok: true,
    env: process.env.PAYMENT_GATEWAY || "mercadopago",
  })
);

app.use(errorHandler);

export default app;
