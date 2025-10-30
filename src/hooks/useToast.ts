/**
 * useToast Hook - Show toast notifications
 */

import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
// Note: You can replace this with a proper toast library like react-native-toast-message

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const useToast = () => {
  const show = useCallback((message: string, type: ToastType = 'info') => {
    // For now using Alert, replace with proper toast component
    if (Platform.OS === 'web') {
      alert(message);
    } else {
      Alert.alert(
        type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Info',
        message
      );
    }
  }, []);

  const success = useCallback((message: string) => {
    show(message, 'success');
  }, [show]);

  const error = useCallback((message: string) => {
    show(message, 'error');
  }, [show]);

  const info = useCallback((message: string) => {
    show(message, 'info');
  }, [show]);

  const warning = useCallback((message: string) => {
    show(message, 'warning');
  }, [show]);

  return {
    show,
    success,
    error,
    info,
    warning,
  };
};

export default useToast;
