/**
 * Push Notification Service - Firebase Cloud Messaging
 */

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { StorageService } from './StorageService';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class PushNotificationService {
  private static fcmToken: string | null = null;

  // Initialize push notifications
  static async initialize(): Promise<void> {
    try {
      // Request permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('Push notification permission denied');
        return;
      }

      // Get FCM token
      await this.getFCMToken();

      // Setup notification channels (Android)
      if (Platform.OS === 'android') {
        await this.createNotificationChannels();
      }

      // Setup listeners
      this.setupListeners();

      console.log('Push notifications initialized');
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  // Get FCM token
  static async getFCMToken(): Promise<string | null> {
    try {
      if (this.fcmToken) return this.fcmToken;

      const token = await messaging().getToken();
      this.fcmToken = token;
      
      // Save token to storage
      StorageService.set('fcm_token', token);
      
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Setup notification listeners
  private static setupListeners(): void {
    // Foreground messages
    messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message received:', remoteMessage);
      await this.displayNotification(remoteMessage);
    });

    // Background/Quit messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message received:', remoteMessage);
      await this.displayNotification(remoteMessage);
    });

    // Token refresh
    messaging().onTokenRefresh((token) => {
      console.log('FCM token refreshed:', token);
      this.fcmToken = token;
      StorageService.set('fcm_token', token);
      // TODO: Send updated token to backend
    });

    // Notification opened (from quit/background state)
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened app:', remoteMessage);
      this.handleNotificationOpen(remoteMessage);
    });

    // Check if app was opened from a notification
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('App opened from notification:', remoteMessage);
          this.handleNotificationOpen(remoteMessage);
        }
      });
  }

  // Display notification
  private static async displayNotification(remoteMessage: any): Promise<void> {
    try {
      const { notification, data } = remoteMessage;

      await notifee.displayNotification({
        title: notification?.title || 'SIS Mobile',
        body: notification?.body || '',
        data: data || {},
        android: {
          channelId: this.getChannelId(data?.type || 'general'),
          importance: AndroidImportance.HIGH,
          sound: 'default',
          smallIcon: 'ic_notification',
          color: '#7C3AED',
          pressAction: {
            id: 'default',
          },
          style: notification?.body
            ? {
                type: AndroidStyle.BIGTEXT,
                text: notification.body,
              }
            : undefined,
        },
        ios: {
          sound: 'default',
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            sound: true,
          },
        },
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  }

  // Create notification channels (Android)
  private static async createNotificationChannels(): Promise<void> {
    const channels = [
      {
        id: 'general',
        name: 'General Notifications',
        importance: AndroidImportance.DEFAULT,
      },
      {
        id: 'announcement',
        name: 'Announcements',
        importance: AndroidImportance.HIGH,
      },
      {
        id: 'assignment',
        name: 'Assignments',
        importance: AndroidImportance.HIGH,
      },
      {
        id: 'exam',
        name: 'Exams',
        importance: AndroidImportance.HIGH,
      },
      {
        id: 'attendance',
        name: 'Attendance',
        importance: AndroidImportance.DEFAULT,
      },
      {
        id: 'fee',
        name: 'Fee Payments',
        importance: AndroidImportance.HIGH,
      },
      {
        id: 'message',
        name: 'Messages',
        importance: AndroidImportance.HIGH,
      },
    ];

    for (const channel of channels) {
      await notifee.createChannel(channel);
    }
  }

  // Get channel ID based on notification type
  private static getChannelId(type: string): string {
    const channelMap: Record<string, string> = {
      announcement: 'announcement',
      assignment: 'assignment',
      exam: 'exam',
      attendance: 'attendance',
      fee: 'fee',
      message: 'message',
    };

    return channelMap[type] || 'general';
  }

  // Handle notification open
  private static handleNotificationOpen(remoteMessage: any): void {
    const { data } = remoteMessage;
    
    // TODO: Navigate to appropriate screen based on notification type
    console.log('Handle notification navigation:', data);
    
    // Example:
    // if (data?.type === 'assignment') {
    //   navigation.navigate('AssignmentDetail', { id: data.assignmentId });
    // }
  }

  // Schedule local notification
  static async scheduleLocalNotification(
    title: string,
    body: string,
    data: any,
    trigger: Date
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger,
    });

    return notificationId;
  }

  // Cancel scheduled notification
  static async cancelScheduledNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Cancel all scheduled notifications
  static async cancelAllScheduledNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Get badge count
  static async getBadgeCount(): Promise<number> {
    return await notifee.getBadgeCount();
  }

  // Set badge count
  static async setBadgeCount(count: number): Promise<void> {
    await notifee.setBadgeCount(count);
  }

  // Increment badge count
  static async incrementBadgeCount(): Promise<void> {
    const current = await this.getBadgeCount();
    await this.setBadgeCount(current + 1);
  }

  // Decrement badge count
  static async decrementBadgeCount(): Promise<void> {
    const current = await this.getBadgeCount();
    await this.setBadgeCount(Math.max(0, current - 1));
  }

  // Clear badge
  static async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }

  // Register device token with backend
  static async registerDeviceToken(userId: string): Promise<void> {
    try {
      const token = await this.getFCMToken();
      if (!token) return;

      // TODO: Send token to backend API
      console.log('Registering device token for user:', userId);
      
      // Example:
      // await fetch('https://api.shivamitcs.in/notifications/register-device', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     userId, 
      //     token, 
      //     platform: Platform.OS 
      //   }),
      // });
    } catch (error) {
      console.error('Error registering device token:', error);
    }
  }

  // Unregister device token
  static async unregisterDeviceToken(): Promise<void> {
    try {
      const token = await this.getFCMToken();
      if (!token) return;

      // TODO: Remove token from backend
      console.log('Unregistering device token');
      
      await messaging().deleteToken();
      this.fcmToken = null;
      StorageService.delete('fcm_token');
    } catch (error) {
      console.error('Error unregistering device token:', error);
    }
  }
}

export default PushNotificationService;
