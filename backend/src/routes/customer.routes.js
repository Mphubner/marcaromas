import express from 'express';
import {
  getAllCustomersAdmin,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customer.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/admin', authMiddleware, adminMiddleware, getAllCustomersAdmin);
router.get('/:id', authMiddleware, adminMiddleware, getCustomerById);
router.post('/', authMiddleware, adminMiddleware, createCustomer);
router.patch('/:id', authMiddleware, adminMiddleware, updateCustomer);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCustomer);

export default router;
