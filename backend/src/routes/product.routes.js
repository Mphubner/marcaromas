import { Router } from "express";
import express from "express";
import { listProducts as getProducts, getCurrentBox } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/current-box", getCurrentBox);

export default router;
