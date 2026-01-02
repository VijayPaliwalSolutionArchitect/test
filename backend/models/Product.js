const mongoose = require('mongoose');

/**
 * Product Schema
 * Manages product catalog with detailed information
 */
const ProductSchema = new mongoose.Schema({
  // Product name/title
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  
  // URL-friendly slug
  slug: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  // Detailed product description
  description: { 
    type: String,
    required: true,
    maxlength: 5000
  },
  
  // Product price
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  
  // Discounted price (optional)
  discountPrice: { 
    type: Number,
    min: 0
  },
  
  // Product images (multiple images support)
  images: [{ 
    type: String 
  }],
  
  // Main product image (backward compatibility)
  image: { 
    type: String 
  },
  
  // Reference to Category
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true
  },
  
  // Reference to Brand
  brand: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Brand'
  },
  
  // Stock quantity
  stock: { 
    type: Number, 
    required: true,
    min: 0,
    default: 0
  },
  
  // SKU (Stock Keeping Unit)
  sku: { 
    type: String,
    unique: true,
    sparse: true
  },
  
  // Product specifications (key-value pairs)
  specifications: {
    type: Map,
    of: String
  },
  
  // Average rating (calculated from reviews)
  rating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  
  // Number of reviews
  reviewCount: { 
    type: Number, 
    default: 0 
  },
  
  // Whether product is active/published
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  // Featured product (for homepage)
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  
  // Tags for better search
  tags: [{ 
    type: String,
    trim: true
  }],
  
  // View count for analytics
  viewCount: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

/**
 * Indexes for efficient querying and searching
 */
ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ brand: 1, isActive: 1 });
ProductSchema.index({ isFeatured: -1, rating: -1 });
ProductSchema.index({ price: 1 });

module.exports = mongoose.model('Product', ProductSchema);