/**
 * Analytics Service - Track user events and behavior
 */

import analytics from '@react-native-firebase/analytics';

export class AnalyticsService {
  // Track screen view
  static async trackScreenView(screenName: string, screenClass?: string): Promise<void> {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
    } catch (error) {
      console.error('Error tracking screen view:', error);
    }
  }

  // Track user login
  static async trackLogin(method: string, userId: string, userRole: string): Promise<void> {
    try {
      await analytics().logLogin({
        method,
      });

      await analytics().setUserId(userId);
      await analytics().setUserProperty('role', userRole);
    } catch (error) {
      console.error('Error tracking login:', error);
    }
  }

  // Track assignment submission
  static async trackAssignmentSubmit(
    assignmentId: string,
    assignmentTitle: string,
    classId: string
  ): Promise<void> {
    try {
      await analytics().logEvent('assignment_submit', {
        assignment_id: assignmentId,
        assignment_title: assignmentTitle,
        class_id: classId,
      });
    } catch (error) {
      console.error('Error tracking assignment submit:', error);
    }
  }

  // Track attendance marking
  static async trackAttendanceMark(classId: string, date: string, count: number): Promise<void> {
    try {
      await analytics().logEvent('attendance_mark', {
        class_id: classId,
        date,
        student_count: count,
      });
    } catch (error) {
      console.error('Error tracking attendance:', error);
    }
  }

  // Track fee payment
  static async trackPayment(
    amount: number,
    method: string,
    invoiceId: string,
    success: boolean
  ): Promise<void> {
    try {
      const eventName = success ? 'payment_success' : 'payment_failure';

      await analytics().logEvent(eventName, {
        value: amount,
        currency: 'INR',
        payment_method: method,
        invoice_id: invoiceId,
      });
    } catch (error) {
      console.error('Error tracking payment:', error);
    }
  }

  // Track notification open
  static async trackNotificationOpen(
    notificationType: string,
    notificationId: string
  ): Promise<void> {
    try {
      await analytics().logEvent('notification_open', {
        notification_type: notificationType,
        notification_id: notificationId,
      });
    } catch (error) {
      console.error('Error tracking notification open:', error);
    }
  }

  // Track search
  static async trackSearch(searchTerm: string, searchType: string): Promise<void> {
    try {
      await analytics().logSearch({
        search_term: searchTerm,
      });

      await analytics().logEvent('search', {
        search_term: searchTerm,
        search_type: searchType,
      });
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  }

  // Track custom event
  static async trackEvent(
    eventName: string,
    params?: Record<string, any>
  ): Promise<void> {
    try {
      await analytics().logEvent(eventName, params);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Set user properties
  static async setUserProperties(properties: Record<string, string>): Promise<void> {
    try {
      for (const [key, value] of Object.entries(properties)) {
        await analytics().setUserProperty(key, value);
      }
    } catch (error) {
      console.error('Error setting user properties:', error);
    }
  }

  // Track timing (for performance metrics)
  static async trackTiming(
    category: string,
    variable: string,
    value: number,
    label?: string
  ): Promise<void> {
    try {
      await analytics().logEvent('timing', {
        category,
        variable,
        value,
        label,
      });
    } catch (error) {
      console.error('Error tracking timing:', error);
    }
  }
}

export default AnalyticsService;
