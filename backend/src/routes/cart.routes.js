import express from "express";
import { echoCart } from "../controllers/cart.controller.js";
const router = express.Router();
router.post("/echo", echoCart);
export default router;
