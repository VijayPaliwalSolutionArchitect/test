/**
 * Error Tracking Service - Sentry integration
 */

import * as Sentry from '@sentry/react-native';

const SENTRY_DSN = process.env.SENTRY_DSN || '';
const APP_ENV = process.env.APP_ENV || 'development';

export class ErrorTrackingService {
  // Initialize Sentry
  static initialize(): void {
    if (!SENTRY_DSN) {
      console.warn('Sentry DSN not configured');
      return;
    }

    Sentry.init({
      dsn: SENTRY_DSN,
      environment: APP_ENV,
      enabled: APP_ENV !== 'development',
      debug: APP_ENV === 'development',
      
      // Performance Monitoring
      tracesSampleRate: 1.0,
      
      // Capture errors
      beforeSend(event, hint) {
        // Filter out certain errors if needed
        return event;
      },
      
      // Integrations
      integrations: [
        new Sentry.ReactNativeTracing({
          tracingOrigins: ['localhost', /^\//],
          routingInstrumentation: new Sentry.ReactNavigationInstrumentation(),
        }),
      ],
    });

    console.log('Sentry initialized');
  }

  // Capture error
  static captureError(error: Error, context?: Record<string, any>): void {
    console.error('Capturing error:', error);
    
    if (context) {
      Sentry.setContext('additional_context', context);
    }

    Sentry.captureException(error);
  }

  // Capture message
  static captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
    Sentry.captureMessage(message, level);
  }

  // Set user context
  static setUser(user: { id: string; email?: string; username?: string; role?: string }): void {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  }

  // Clear user context
  static clearUser(): void {
    Sentry.setUser(null);
  }

  // Add breadcrumb
  static addBreadcrumb(
    message: string,
    category: string,
    level: Sentry.SeverityLevel = 'info',
    data?: Record<string, any>
  ): void {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data,
    });
  }

  // Set tag
  static setTag(key: string, value: string): void {
    Sentry.setTag(key, value);
  }

  // Set context
  static setContext(name: string, context: Record<string, any>): void {
    Sentry.setContext(name, context);
  }

  // Track API call performance
  static trackApiCall(endpoint: string, method: string, statusCode: number, duration: number): void {
    const transaction = Sentry.startTransaction({
      op: 'http.request',
      name: `${method} ${endpoint}`,
    });

    transaction.setHttpStatus(statusCode);
    transaction.setData('method', method);
    transaction.setData('endpoint', endpoint);
    transaction.setData('duration', duration);

    transaction.finish();
  }

  // Flush events (useful before app closes)
  static async flush(timeout = 2000): Promise<boolean> {
    try {
      return await Sentry.flush(timeout);
    } catch (error) {
      console.error('Error flushing Sentry:', error);
      return false;
    }
  }

  // Close Sentry client
  static async close(): Promise<void> {
    await Sentry.close();
  }
}

export default ErrorTrackingService;
