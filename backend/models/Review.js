const mongoose = require('mongoose');

/**
 * Review Schema
 * Manages product reviews and ratings from users
 */
const ReviewSchema = new mongoose.Schema({
  // Reference to the product being reviewed
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  
  // Reference to the user who wrote the review
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Rating from 1 to 5 stars
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  
  // Review title
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  
  // Detailed review comment
  comment: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 1000
  },
  
  // Whether the review is verified (user purchased the product)
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  
  // Helpfulness votes (how many found this review helpful)
  helpfulCount: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

/**
 * Create compound index to ensure one review per user per product
 * This prevents duplicate reviews from the same user
 */
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
