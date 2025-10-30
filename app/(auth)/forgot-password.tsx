/**
 * Forgot Password Screen
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, useToast } from '@/hooks';
import { Validation } from '@/utils/validation';
import themeConfig from '../../../theme.config';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    if (!Validation.isValidEmail(email)) {
      toast.error('Invalid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Call API to send reset link
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Password reset link sent to your email');
      router.back();
    } catch (error) {
      toast.error('Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
    >
      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.colors.primary[600] }]}>
            ← Back
          </Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Forgot Password?
        </Text>
        
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
            Email Address
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                borderColor: theme.colors.border.default,
              },
            ]}
            placeholder="student@example.com"
            placeholderTextColor={theme.colors.text.tertiary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary[600] },
            isLoading && { opacity: 0.6 },
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={[styles.submitButtonText, { color: theme.colors.white }]}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: themeConfig.spacing[6],
    justifyContent: 'center',
  },
  backButton: {
    marginBottom: themeConfig.spacing[6],
  },
  backText: {
    fontSize: themeConfig.typography.fontSize.base,
  },
  title: {
    fontSize: themeConfig.typography.fontSize['3xl'],
    fontWeight: themeConfig.typography.fontWeight.bold,
    marginBottom: themeConfig.spacing[3],
  },
  subtitle: {
    fontSize: themeConfig.typography.fontSize.base,
    marginBottom: themeConfig.spacing[8],
  },
  inputContainer: {
    marginBottom: themeConfig.spacing[6],
  },
  label: {
    fontSize: themeConfig.typography.fontSize.sm,
    fontWeight: themeConfig.typography.fontWeight.medium,
    marginBottom: themeConfig.spacing[2],
  },
  input: {
    height: 50,
    borderRadius: themeConfig.borderRadius.md,
    paddingHorizontal: themeConfig.spacing[4],
    fontSize: themeConfig.typography.fontSize.base,
    borderWidth: 1,
  },
  submitButton: {
    height: 50,
    borderRadius: themeConfig.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: themeConfig.typography.fontSize.base,
    fontWeight: themeConfig.typography.fontWeight.semibold,
  },
});
