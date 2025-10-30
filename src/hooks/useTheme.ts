/**
 * useTheme Hook - Access theme configuration
 */

import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useAppSelector } from '@/store';
import { getTheme, themeConfig } from '../../theme.config';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const themeMode = useAppSelector(state => state.app.settings.theme);

  const currentTheme = useMemo(() => {
    let mode: 'light' | 'dark' = 'light';

    if (themeMode === 'auto') {
      mode = colorScheme === 'dark' ? 'dark' : 'light';
    } else {
      mode = themeMode as 'light' | 'dark';
    }

    return getTheme(mode);
  }, [themeMode, colorScheme]);

  return currentTheme;
};

export default useTheme;
