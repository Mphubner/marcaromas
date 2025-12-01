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
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

router.get('/', cacheMiddleware(300), getAllProducts);
router.get('/admin', authMiddleware, adminMiddleware, getAllProductsAdmin);
router.get('/admin/:productId', authMiddleware, adminMiddleware, getProductByIdAdmin);
router.get('/featured', cacheMiddleware(300), getFeaturedProducts);
router.get('/search', cacheMiddleware(300), searchProducts);
router.get('/categories', cacheMiddleware(3600), getAllCategories);
router.get('/category/:category', cacheMiddleware(300), getProductsByCategory);
router.get('/:slug', cacheMiddleware(300), getProductBySlug);

// Rotas de Admin
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.patch('/:productId', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:productId', authMiddleware, adminMiddleware, deleteProduct);

// Bulk operations
router.post('/bulk/delete', authMiddleware, adminMiddleware, bulkDeleteProducts);
router.post('/bulk/availability', authMiddleware, adminMiddleware, bulkUpdateAvailability);
router.post('/bulk/featured', authMiddleware, adminMiddleware, bulkUpdateFeatured);

export default router;


