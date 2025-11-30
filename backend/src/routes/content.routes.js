import express from 'express';
import {
  getAllContent,
  getContentBySlug,
  getContentByCategory,
  getAllContentAdmin,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  publishContent,
  unpublishContent,
  checkAccess,
  incrementViews,
  searchContent
} from '../controllers/content.controller.js';
import {
  addBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks
} from '../controllers/contentBlock.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// ============================================
// ADMIN ROUTES
// ============================================

// Apply middleware to all admin routes
router.use('/admin', authMiddleware, adminMiddleware);

/**
 * @route   GET /api/content/admin
 * @desc    List all content (drafts + published)
 * @access  Private/Admin
 * @query   status, type, limit, offset
 */
router.get('/admin', getAllContentAdmin);

/**
 * @route   GET /api/content/admin/:id
 * @desc    Get content by ID (for editing)
 * @access  Private/Admin
 */
router.get('/admin/:id', getContentById);

/**
 * @route   POST /api/content/admin
 * @desc    Create new content
 * @access  Private/Admin
 */
router.post('/admin', createContent);

/**
 * @route   PUT /api/content/admin/:id
 * @desc    Update content
 * @access  Private/Admin
 */
router.put('/admin/:id', updateContent);

/**
 * @route   DELETE /api/content/admin/:id
 * @desc    Delete content
 * @access  Private/Admin
 */
router.delete('/admin/:id', deleteContent);

/**
 * @route   POST /api/content/admin/:id/publish
 * @desc    Publish draft
 * @access  Private/Admin
 */
router.post('/admin/:id/publish', publishContent);

/**
 * @route   POST /api/content/admin/:id/unpublish
 * @desc    Unpublish content
 * @access  Private/Admin
 */
router.post('/admin/:id/unpublish', unpublishContent);

// ============================================
// BLOCK MANAGEMENT ROUTES (Admin only)
// ============================================

/**
 * @route   POST /api/content/admin/:id/blocks
 * @desc    Add block to content
 * @access  Private/Admin
 */
router.post('/admin/:id/blocks', addBlock);

/**
 * @route   PUT /api/content/admin/blocks/:blockId
 * @desc    Update block
 * @access  Private/Admin
 */
router.put('/admin/blocks/:blockId', updateBlock);

/**
 * @route   DELETE /api/content/admin/blocks/:blockId
 * @desc    Delete block
 * @access  Private/Admin
 */
router.delete('/admin/blocks/:blockId', deleteBlock);

/**
 * @route   PUT /api/content/admin/:id/blocks/reorder
 * @desc    Reorder blocks
 * @access  Private/Admin
 */
router.put('/admin/:id/blocks/reorder', reorderBlocks);

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route   GET /api/content/search
 * @desc    Search content
 * @access  Public
 * @query   q (required), type, limit, offset
 */
router.get('/search', searchContent);

/**
 * @route   GET /api/content
 * @desc    List published content
 * @access  Public
 * @query   type, category, limit, offset
 */
router.get('/', getAllContent);

/**
 * @route   GET /api/content/category/:category
 * @desc    Filter content by category
 * @access  Public
 * @query   limit, offset
 */
router.get('/category/:category', getContentByCategory);

/**
 * @route   GET /api/content/:id/access
 * @desc    Check if user has access to content
 * @access  Public (but checks auth)
 */
router.get('/:id/access', checkAccess);

/**
 * @route   POST /api/content/:id/view
 * @desc    Increment view count
 * @access  Public
 */
router.post('/:id/view', incrementViews);

/**
 * @route   GET /api/content/:slug
 * @desc    Get content by slug (with blocks)
 * @access  Public
 */
router.get('/:slug', getContentBySlug);

export default router;
