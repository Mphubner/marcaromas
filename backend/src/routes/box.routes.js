import express from 'express';
import {
	getCurrentBox,
	getAllBoxesAdmin,
	getBoxById,
	createBox,
	updateBox,
	deleteBox,
} from '../controllers/box.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Rotas públicas
router.get('/current', getCurrentBox);
router.get('/current-box', getCurrentBox); // Alias para compatibilidade

// Admin
router.get('/admin', authMiddleware, adminMiddleware, getAllBoxesAdmin);
router.get('/:id', authMiddleware, adminMiddleware, getBoxById);
router.post('/', authMiddleware, adminMiddleware, createBox);
router.patch('/:id', authMiddleware, adminMiddleware, updateBox);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBox);

export default router;