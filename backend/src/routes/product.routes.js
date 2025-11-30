import express from 'express';
import {
  getAllProducts,
  getAllProductsAdmin,
  getProductByIdAdmin,
  getProductBySlug,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  getAllCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  bulkUpdateAvailability,
  bulkUpdateFeatured,
} from '../controllers/product.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/admin', authMiddleware, adminMiddleware, getAllProductsAdmin);
router.get('/admin/:productId', authMiddleware, adminMiddleware, getProductByIdAdmin);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/categories', getAllCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:slug', getProductBySlug);

// Rotas de Admin
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.patch('/:productId', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:productId', authMiddleware, adminMiddleware, deleteProduct);

// Bulk operations
router.post('/bulk/delete', authMiddleware, adminMiddleware, bulkDeleteProducts);
router.post('/bulk/availability', authMiddleware, adminMiddleware, bulkUpdateAvailability);
router.post('/bulk/featured', authMiddleware, adminMiddleware, bulkUpdateFeatured);

export default router;


