import express from "express";
import { listProducts as getProducts } from "../controllers/product.controller.js";

const router = express.Router();

// Mounting this router at `/api/products` in app.js ->
// GET /api/products  -> returns list of products
router.get("/", getProducts);

export default router;
