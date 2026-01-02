const mongoose = require('mongoose');

/**
 * User Schema
 * Manages user accounts and authentication
 * Stores basic user information and admin status
 */
const UserSchema = new mongoose.Schema({
  // User's full name
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  
  // User's email address (unique identifier)
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  
  // Hashed password (never store plain text)
  password: { 
    type: String, 
    required: true 
  },
  
  // Admin privilege flag
  isAdmin: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

/**
 * Index for efficient email lookups during authentication
 */
UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);