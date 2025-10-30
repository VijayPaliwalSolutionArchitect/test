/**
 * Notification API - RTK Query
 */

import { baseApi } from '@/api/baseApi';
import type { Notification, PaginatedResponse } from '@/types';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get notifications for current user
    getNotifications: builder.query<
      PaginatedResponse<Notification>,
      { type?: string; isRead?: boolean; page?: number }
    >({
      query: (params) => ({
        url: '/notifications/me',
        params,
      }),
      providesTags: ['Notification'],
    }),

    // Get unread count
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => '/notifications/me/unread-count',
      providesTags: ['Notification'],
    }),

    // Mark notification as read
    markAsRead: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Mark all as read
    markAllAsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/notifications/me/read-all',
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Delete notification
    deleteNotification: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Send notification (admin/teacher)
    sendNotification: builder.mutation<
      { success: boolean; sent: number },
      {
        title: string;
        body: string;
        type: string;
        target: 'all' | 'class' | 'user';
        targetIds?: string[];
        data?: Record<string, any>;
      }
    >({
      query: (data) => ({
        url: '/notifications/send',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notification'],
    }),

    // Register device token for push notifications
    registerDevice: builder.mutation<
      { success: boolean },
      { token: string; platform: 'ios' | 'android' }
    >({
      query: (data) => ({
        url: '/notifications/register-device',
        method: 'POST',
        body: data,
      }),
    }),

    // Unregister device
    unregisterDevice: builder.mutation<{ success: boolean }, string>({
      query: (token) => ({
        url: '/notifications/unregister-device',
        method: 'POST',
        body: { token },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useSendNotificationMutation,
  useRegisterDeviceMutation,
  useUnregisterDeviceMutation,
} = notificationApi;
