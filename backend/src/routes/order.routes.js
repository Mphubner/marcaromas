import express from "express";
import { createOrderAndPayment } from "../controllers/order.controller.js";
const router = express.Router();

router.post("/", createOrderAndPayment);

export default router;
