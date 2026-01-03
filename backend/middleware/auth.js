const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request object
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        error: 'Access denied. No token provided.' 
      });
    }

    // Check if token starts with 'Bearer '
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Access denied. Invalid token format.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and attach to request
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found.' 
      });
    }

    // Attach user to request object
    req.user = user;
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;
    
    next();
  } catch (error) {
    // Handle token expiration
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired. Please login again.' 
      });
    }
    
    // Handle invalid token
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token.' 
      });
    }

    // Handle other errors
    res.status(500).json({ 
      success: false,
      error: 'Authentication failed.' 
    });
  }
};

/**
 * Admin Authorization Middleware
 * Checks if authenticated user has admin privileges
 * Must be used after auth middleware
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const adminAuth = (req, res, next) => {
  // Check if user is authenticated (should be done by auth middleware first)
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      error: 'Authentication required.' 
    });
  }

  // Check if user is admin
  if (!req.isAdmin) {
    return res.status(403).json({ 
      success: false,
      error: 'Access denied. Admin privileges required.' 
    });
  }

  next();
};

module.exports = { auth, adminAuth };
