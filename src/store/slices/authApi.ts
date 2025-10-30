/**
 * Authentication API - RTK Query
 */

import { baseApi } from '@/api/baseApi';
import type { LoginRequest, LoginResponse, User } from '@/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation<void, { refreshToken: string }>({
      query: (body) => ({
        url: '/auth/logout',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    refresh: builder.mutation<
      { accessToken: string; refreshToken: string; expiresIn: number },
      { refreshToken: string }
    >({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),

    requestOtp: builder.mutation<{ success: boolean }, { phone: string }>({
      query: (body) => ({
        url: '/auth/request-otp',
        method: 'POST',
        body,
      }),
    }),

    verifyOtp: builder.mutation<
      LoginResponse,
      { phone: string; otp: string }
    >({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    requestPasswordReset: builder.mutation<{ success: boolean }, { email: string }>({
      query: (body) => ({
        url: '/auth/request-password-reset',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<
      { success: boolean },
      { token: string; newPassword: string }
    >({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    changePassword: builder.mutation<
      { success: boolean },
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
