import express from "express";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import { authOptional } from "../middlewares/authOptional.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota para buscar o carrinho (usuário pode estar logado ou não)
router.get("/", authOptional, getCart);

// Rotas que exigem autenticação
router.post("/items", authMiddleware, addItemToCart);
router.patch("/items/:itemId", authMiddleware, updateCartItem);
router.delete("/items/:itemId", authMiddleware, removeCartItem);
router.delete("/", authMiddleware, clearCart);

export default router;

