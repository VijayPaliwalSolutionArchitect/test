const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogCategories
} = require('../controllers/blogController');

/**
 * Blog Routes
 * All routes for blog/content management
 */

// Public routes
router.get('/categories', getBlogCategories);
router.get('/', getBlogs);
router.get('/:id', getBlog);

// Admin only routes
router.post('/', auth, adminAuth, createBlog);
router.put('/:id', auth, adminAuth, updateBlog);
router.delete('/:id', auth, adminAuth, deleteBlog);
router.get('/admin/all', auth, adminAuth, getAllBlogs);

module.exports = router;
