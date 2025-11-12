import express from "express";
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  echoCart,
} from "../controllers/cart.controller.js";
import { optionalAuth } from "../middlewares/authOptional.js";

const router = express.Router();

// For server-side cart we require authentication to persist a user cart.
// GET returns empty array for unauthenticated users (frontend will use localStorage fallback).
router.get("/", optionalAuth, getCart);
router.post("/items", optionalAuth, addItem);
router.patch("/items/:itemId", optionalAuth, updateItem);
router.delete("/items/:itemId", optionalAuth, removeItem);
router.delete("/", optionalAuth, clearCart);

// Keep echo for backwards compatibility
router.post("/echo", echoCart);

export default router;
