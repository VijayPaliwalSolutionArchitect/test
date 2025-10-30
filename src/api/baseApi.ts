/**
 * Base API Configuration for RTK Query
 */

import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { StorageService } from '@/services/StorageService';

const BASE_URL = process.env.API_BASE_URL || 'https://api.shivamitcs.in';

// Base query with auth token injection
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers, { getState }) => {
    // Get token from Redux state or secure storage
    const state = getState() as RootState;
    const token = state.auth.tokens?.accessToken || await StorageService.getAccessToken();
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    
    return headers;
  },
});

// Base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    const refreshToken = await StorageService.getRefreshToken();
    
    if (refreshToken) {
      // Try to get a new access token
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { accessToken, refreshToken: newRefreshToken, expiresIn } = refreshResult.data as any;
        
        // Store the new tokens
        await StorageService.setTokens({
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn,
        });
        
        // Update Redux state
        const state = api.getState() as RootState;
        if (state.auth.user) {
          api.dispatch(
            setCredentials({
              user: state.auth.user,
              tokens: { accessToken, refreshToken: newRefreshToken, expiresIn },
            })
          );
        }

        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - logout user
        api.dispatch(logout());
        await StorageService.clearTokens();
      }
    } else {
      // No refresh token - logout user
      api.dispatch(logout());
      await StorageService.clearTokens();
    }
  }

  return result;
};

// Create base API instance
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Student',
    'Teacher',
    'Admin',
    'Parent',
    'Class',
    'Subject',
    'Timetable',
    'Attendance',
    'Assignment',
    'Submission',
    'Exam',
    'Result',
    'Fee',
    'Payment',
    'Notification',
    'Message',
    'Conversation',
    'Book',
    'BusRoute',
  ],
  endpoints: () => ({}),
});

export default baseApi;
