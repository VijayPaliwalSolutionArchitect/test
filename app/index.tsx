/**
 * App Entry Point - Checks auth status and routes accordingly
 */

import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks';
import { StorageService } from '@/services/StorageService';
import { useTheme } from '@/hooks/useTheme';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is already logged in
        const accessToken = await StorageService.getAccessToken();
        const userData = await StorageService.getUserData();

        // Small delay to show splash screen
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (accessToken && userData && !await StorageService.isTokenExpired()) {
          // Navigate to appropriate dashboard based on role
          router.replace('/(app)/(tabs)');
        } else {
          // Navigate to login
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.replace('/(auth)/login');
      }
    };

    checkAuth();
  }, []);

  return (
    <View 
      style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.colors.background.primary,
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary[500]} />
    </View>
  );
}
