const mongoose = require('mongoose');

/**
 * Blog Schema
 * Manages blog posts and content articles
 */
const BlogSchema = new mongoose.Schema({
  // Blog post title
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  
  // URL-friendly slug for the blog post
  slug: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  // Blog post content (supports HTML)
  content: { 
    type: String, 
    required: true 
  },
  
  // Short excerpt or summary
  excerpt: { 
    type: String,
    maxlength: 500
  },
  
  // Featured image URL
  featuredImage: { 
    type: String 
  },
  
  // Reference to the author (admin user)
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Blog category (e.g., 'News', 'Tutorial', 'Product Review')
  category: { 
    type: String,
    enum: ['News', 'Tutorial', 'Product Review', 'Tips', 'Company', 'Other'],
    default: 'Other'
  },
  
  // Tags for better organization and search
  tags: [{ 
    type: String,
    trim: true
  }],
  
  // Publication status
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'],
    default: 'draft' 
  },
  
  // Published date (can be scheduled for future)
  publishedAt: { 
    type: Date 
  },
  
  // View count for analytics
  viewCount: { 
    type: Number, 
    default: 0 
  },
  
  // SEO meta description
  metaDescription: {
    type: String,
    maxlength: 160
  }
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

/**
 * Index for efficient searching and sorting
 */
BlogSchema.index({ title: 'text', content: 'text', tags: 'text' });
BlogSchema.index({ status: 1, publishedAt: -1 });

/**
 * Pre-save hook to set publishedAt date when status changes to published
 */
BlogSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);
