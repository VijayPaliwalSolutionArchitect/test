const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Review Controller
 * Handles product review operations
 */

/**
 * Get reviews for a product
 * @route GET /api/reviews/:productId
 * @access Public
 */
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get reviews with user details
    const reviews = await Review.find({ productId })
      .populate('userId', 'name')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments({ productId });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a review for a product
 * @route POST /api/reviews
 * @access Private
 */
exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      productId, 
      userId: req.userId 
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this product'
      });
    }

    // Optional: Check if user purchased this product
    const hasPurchased = await Order.findOne({
      userId: req.userId,
      'products.productId': productId,
      status: 'delivered'
    });

    // Create review
    const review = await Review.create({
      productId,
      userId: req.userId,
      rating,
      title,
      comment,
      isVerified: !!hasPurchased // Mark as verified if user purchased
    });

    // Update product rating and review count
    await updateProductRating(productId);

    // Populate user details before sending response
    await review.populate('userId', 'name');

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review posted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a review
 * @route PUT /api/reviews/:id
 * @access Private
 */
exports.updateReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Update review fields
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;

    await review.save();

    // Update product rating
    await updateProductRating(review.productId);

    await review.populate('userId', 'name');

    res.json({
      success: true,
      data: review,
      message: 'Review updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a review
 * @route DELETE /api/reviews/:id
 * @access Private
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.userId.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const productId = review.productId;
    await review.deleteOne();

    // Update product rating
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark review as helpful
 * @route POST /api/reviews/:id/helpful
 * @access Private
 */
exports.markReviewHelpful = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    ).populate('userId', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review,
      message: 'Thank you for your feedback'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to update product rating
 * Calculates average rating and review count from all reviews
 */
async function updateProductRating(productId) {
  const reviews = await Review.find({ productId });
  
  const reviewCount = reviews.length;
  const rating = reviewCount > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
    : 0;

  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(rating * 10) / 10, // Round to 1 decimal
    reviewCount
  });
}
