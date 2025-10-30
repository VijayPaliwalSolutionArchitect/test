/**
 * Reset Password Screen (placeholder for password reset flow)
 */

import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks';
import themeConfig from '../../../theme.config';

export default function ResetPasswordScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <Text style={[styles.text, { color: theme.colors.text.primary }]}>
        Reset Password Screen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: themeConfig.spacing[4],
  },
  text: {
    fontSize: themeConfig.typography.fontSize.lg,
  },
});
