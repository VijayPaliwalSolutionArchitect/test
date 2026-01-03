require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

/**
 * Server Entry Point
 * Initializes database connection and starts the Express server
 */

// Get port from environment or use default
const PORT = process.env.PORT || 5000;

/**
 * Start Server
 * Connects to MongoDB and starts listening on specified port
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('✓ MongoDB connected successfully');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✓ Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`✓ Server listening on port ${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}/api`);
      console.log(`✓ Health check at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();
