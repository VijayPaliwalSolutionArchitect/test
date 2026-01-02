const mongoose = require('mongoose');

/**
 * Category Schema
 * Manages product categories for organization
 */
const CategorySchema = new mongoose.Schema({
  // Category name
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  
  // URL-friendly slug
  slug: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  // Category description
  description: { 
    type: String,
    maxlength: 500
  },
  
  // Category image/icon URL
  image: { 
    type: String 
  },
  
  // Parent category for nested categories (subcategories)
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    default: null
  },
  
  // Whether category is active
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  // Display order/priority
  order: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

/**
 * Index for efficient querying
 */
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent: 1, order: 1 });

module.exports = mongoose.model('Category', CategorySchema);
