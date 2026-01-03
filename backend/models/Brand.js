const mongoose = require('mongoose');

/**
 * Brand Schema
 * Manages product brands/manufacturers
 */
const BrandSchema = new mongoose.Schema({
  // Brand name
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
  
  // Brand description
  description: { 
    type: String,
    maxlength: 1000
  },
  
  // Brand logo URL
  logo: { 
    type: String 
  },
  
  // Brand website URL
  website: { 
    type: String 
  },
  
  // Whether brand is active
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  // Featured brand (for homepage display)
  isFeatured: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

/**
 * Index for efficient querying
 */
BrandSchema.index({ slug: 1 });
BrandSchema.index({ isFeatured: -1, name: 1 });

module.exports = mongoose.model('Brand', BrandSchema);
