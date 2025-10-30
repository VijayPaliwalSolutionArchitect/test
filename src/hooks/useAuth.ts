/**
 * useAuth Hook - Authentication utilities
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCredentials, logout as logoutAction } from '@/store/slices/authSlice';
import { useLoginMutation, useLogoutMutation } from '@/store/slices/authApi';
import { StorageService } from '@/services/StorageService';
import { PushNotificationService } from '@/services/PushNotificationService';
import type { LoginRequest } from '@/types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, tokens, isAuthenticated, isLoading, error } = useAppSelector(state => state.auth);
  
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const result = await loginMutation(credentials).unwrap();
      
      // Save tokens securely
      await StorageService.setTokens(result.tokens);
      await StorageService.setUserData(result.user);
      
      // Update Redux state
      dispatch(setCredentials(result));
      
      // Register device for push notifications
      await PushNotificationService.registerDeviceToken(result.user.id);
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [loginMutation, dispatch]);

  const logout = useCallback(async () => {
    try {
      if (tokens?.refreshToken) {
        await logoutMutation({ refreshToken: tokens.refreshToken });
      }
      
      // Clear tokens
      await StorageService.clearTokens();
      await StorageService.clearUserData();
      
      // Unregister device
      await PushNotificationService.unregisterDeviceToken();
      
      // Update Redux state
      dispatch(logoutAction());
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      await StorageService.clearTokens();
      await StorageService.clearUserData();
      dispatch(logoutAction());
    }
  }, [tokens, logoutMutation, dispatch]);

  return {
    user,
    tokens,
    isAuthenticated,
    isLoading: isLoading || isLoggingIn,
    error,
    login,
    logout,
  };
};

export default useAuth;
