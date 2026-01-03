const mongoose = require('mongoose');

/**
 * Database Connection Configuration
 * Establishes connection to MongoDB database
 * Uses environment variable for connection string
 */

/**
 * Connect to MongoDB
 * Attempts to establish database connection with error handling
 * Exits process if connection fails
 * 
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from environment
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✓ MongoDB connected successfully');
    
    // Log database name for confirmation
    console.log(`✓ Connected to database: ${mongoose.connection.db.databaseName}`);
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    
    // Exit process with failure code if connection fails
    // This prevents app from running without database access
    process.exit(1);
  }
};

/**
 * Handle MongoDB connection events
 */
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

module.exports = connectDB;