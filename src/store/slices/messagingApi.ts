/**
 * Messaging API - RTK Query
 */

import { baseApi } from '@/api/baseApi';
import type { Message, Conversation, PaginatedResponse } from '@/types';

export const messagingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get conversations
    getConversations: builder.query<
      PaginatedResponse<Conversation>,
      { page?: number }
    >({
      query: (params) => ({
        url: '/messages/conversations',
        params,
      }),
      providesTags: ['Conversation'],
    }),

    // Get conversation by ID
    getConversation: builder.query<Conversation, string>({
      query: (id) => `/messages/conversations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Conversation', id }],
    }),

    // Get messages in conversation
    getMessages: builder.query<
      PaginatedResponse<Message>,
      { conversationId: string; page?: number }
    >({
      query: ({ conversationId, ...params }) => ({
        url: `/messages/conversations/${conversationId}/messages`,
        params,
      }),
      providesTags: (result, error, { conversationId }) => [{ type: 'Message', id: conversationId }],
    }),

    // Send message
    sendMessage: builder.mutation<
      Message,
      { conversationId?: string; recipientIds?: string[]; text: string; attachments?: FormData }
    >({
      query: (data) => ({
        url: '/messages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Message', 'Conversation'],
    }),

    // Mark messages as read
    markMessagesAsRead: builder.mutation<{ success: boolean }, string>({
      query: (conversationId) => ({
        url: `/messages/conversations/${conversationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, conversationId) => [
        { type: 'Conversation', id: conversationId },
        { type: 'Message', id: conversationId },
      ],
    }),

    // Delete message
    deleteMessage: builder.mutation<{ success: boolean }, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Message'],
    }),

    // Search conversations/users
    searchConversations: builder.query<
      Conversation[],
      { query: string }
    >({
      query: (params) => ({
        url: '/messages/search',
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
  useDeleteMessageMutation,
  useSearchConversationsQuery,
} = messagingApi;
