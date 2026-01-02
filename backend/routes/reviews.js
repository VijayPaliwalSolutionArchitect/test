const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful
} = require('../controllers/reviewController');

/**
 * Review Routes
 * All routes for product review management
 */

// Public routes
router.get('/:productId', getProductReviews);

// Protected routes (require authentication)
router.post('/', auth, createReview);
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);
router.post('/:id/helpful', auth, markReviewHelpful);

module.exports = router;
