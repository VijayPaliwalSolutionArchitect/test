/**
 * Login Screen
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
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth, useTheme, useToast } from '@/hooks';
import { Validation } from '@/utils/validation';
import themeConfig from '../../../theme.config';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();
  const theme = useTheme();
  const toast = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ identifier: '', password: '' });

  const validate = () => {
    const newErrors = { identifier: '', password: '' };
    let isValid = true;

    if (!identifier) {
      newErrors.identifier = 'Email or phone is required';
      isValid = false;
    } else if (
      !Validation.isValidEmail(identifier) &&
      !Validation.isValidPhone(identifier)
    ) {
      newErrors.identifier = 'Invalid email or phone number';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await login({ identifier, password });
      toast.success(t('auth.loginSuccess'));
      router.replace('/(app)/(tabs)');
    } catch (error: any) {
      toast.error(error?.data?.message || t('auth.invalidCredentials'));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.primary[500] }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.logoText, { color: theme.colors.primary[700] }]}>
              📚
            </Text>
          </View>
          <Text style={[styles.title, { color: theme.colors.white }]}>
            {t('common.appName')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.primary[100] }]}>
            School Information System
          </Text>
        </View>

        {/* Login Form Card */}
        <View style={[styles.formCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.formTitle, { color: theme.colors.text.primary }]}>
            {t('auth.signIn')}
          </Text>

          {/* Email/Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
              {t('auth.emailOrPhone')}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                  borderColor: errors.identifier
                    ? theme.colors.error[500]
                    : theme.colors.border.default,
                },
              ]}
              placeholder="student@example.com or 9876543210"
              placeholderTextColor={theme.colors.text.tertiary}
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {errors.identifier ? (
              <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>
                {errors.identifier}
              </Text>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
              {t('auth.password')}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                  borderColor: errors.password
                    ? theme.colors.error[500]
                    : theme.colors.border.default,
                },
              ]}
              placeholder="••••••••"
              placeholderTextColor={theme.colors.text.tertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {errors.password ? (
              <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>
                {errors.password}
              </Text>
            ) : null}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotPassword}
          >
            <Text style={[styles.forgotPasswordText, { color: theme.colors.primary[600] }]}>
              {t('auth.forgotPassword')}
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: theme.colors.primary[600] }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={[styles.loginButtonText, { color: theme.colors.white }]}>
              {isLoading ? 'Signing in...' : t('auth.signIn')}
            </Text>
          </TouchableOpacity>

          {/* Biometric Login (Optional) */}
          {/* <TouchableOpacity style={styles.biometricButton}>
            <Text style={[styles.biometricText, { color: theme.colors.text.secondary }]}>
              {t('auth.biometricLogin')}
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: themeConfig.spacing[8],
  },
  header: {
    alignItems: 'center',
    marginBottom: themeConfig.spacing[8],
    paddingHorizontal: themeConfig.spacing[6],
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: themeConfig.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: themeConfig.spacing[4],
    ...themeConfig.shadows.md,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: themeConfig.typography.fontSize['3xl'],
    fontWeight: themeConfig.typography.fontWeight.bold,
    marginBottom: themeConfig.spacing[2],
  },
  subtitle: {
    fontSize: themeConfig.typography.fontSize.base,
  },
  formCard: {
    marginHorizontal: themeConfig.spacing[6],
    padding: themeConfig.spacing[6],
    borderRadius: themeConfig.borderRadius.xl,
    ...themeConfig.shadows.lg,
  },
  formTitle: {
    fontSize: themeConfig.typography.fontSize['2xl'],
    fontWeight: themeConfig.typography.fontWeight.bold,
    marginBottom: themeConfig.spacing[6],
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: themeConfig.spacing[4],
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
  errorText: {
    fontSize: themeConfig.typography.fontSize.xs,
    marginTop: themeConfig.spacing[1],
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: themeConfig.spacing[6],
  },
  forgotPasswordText: {
    fontSize: themeConfig.typography.fontSize.sm,
  },
  loginButton: {
    height: 50,
    borderRadius: themeConfig.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: themeConfig.spacing[4],
  },
  loginButtonText: {
    fontSize: themeConfig.typography.fontSize.base,
    fontWeight: themeConfig.typography.fontWeight.semibold,
  },
  biometricButton: {
    paddingVertical: themeConfig.spacing[3],
    alignItems: 'center',
  },
  biometricText: {
    fontSize: themeConfig.typography.fontSize.sm,
  },
});
