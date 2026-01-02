const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

/**
 * Request Logger Middleware
 * Logs HTTP requests for monitoring and debugging
 * Uses Morgan for formatted logging
 */

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create write stream for access logs (append mode)
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

/**
 * Development logger - detailed colored output to console
 */
const devLogger = morgan('dev');

/**
 * Production logger - combined format with file output
 * Logs to both console and file
 */
const prodLogger = morgan('combined', { stream: accessLogStream });

/**
 * Custom Morgan token to log request body (be careful with sensitive data)
 */
morgan.token('body', (req) => {
  // Don't log password fields
  if (req.body && req.body.password) {
    const sanitized = { ...req.body };
    sanitized.password = '***REDACTED***';
    return JSON.stringify(sanitized);
  }
  return JSON.stringify(req.body);
});

/**
 * Custom format for detailed logging
 */
const customFormat = ':method :url :status :response-time ms - :res[content-length] - :body';
const customLogger = morgan(customFormat, { stream: accessLogStream });

/**
 * Logger middleware selector based on environment
 */
const logger = process.env.NODE_ENV === 'production' 
  ? prodLogger 
  : devLogger;

/**
 * API Logger - logs API calls with additional details
 */
const apiLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ` +
      `${res.statusCode} (${duration}ms)`
    );
  });
  
  next();
};

module.exports = { logger, apiLogger };
