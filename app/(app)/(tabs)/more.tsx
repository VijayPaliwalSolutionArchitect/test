/**
 * More Screen - Settings and additional options
 */

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, useAuth } from '@/hooks';
import { useTranslation } from 'react-i18next';
import themeConfig from '../../../../theme.config';

export default function MoreScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const menuItems = [
    { icon: '👤', title: 'Profile', screen: 'profile' },
    { icon: '⚙️', title: 'Settings', screen: 'settings' },
    { icon: '📊', title: 'Attendance', screen: 'attendance' },
    { icon: '💰', title: 'Fees', screen: 'fees' },
    { icon: '📚', title: 'Library', screen: 'library' },
    { icon: '🚌', title: 'Transport', screen: 'transport' },
    { icon: '❓', title: 'Help & Support', screen: 'support' },
    { icon: 'ℹ️', title: 'About', screen: 'about' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}
      contentContainerStyle={styles.content}
    >
      {/* User Info */}
      <View style={[styles.userCard, { backgroundColor: theme.colors.white }]}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary[100] }]}>
          <Text style={[styles.avatarText, { color: theme.colors.primary[700] }]}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[styles.userEmail, { color: theme.colors.text.secondary }]}>
            {user?.email}
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: theme.colors.primary[100] }]}>
            <Text style={[styles.roleText, { color: theme.colors.primary[700] }]}>
              {user?.role?.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={[styles.menuCard, { backgroundColor: theme.colors.white }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index !== menuItems.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border.subtle,
              },
            ]}
            onPress={() => {
              // TODO: Navigate to respective screen
              Alert.alert('Coming Soon', `${item.title} feature is under development`);
            }}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[styles.menuTitle, { color: theme.colors.text.primary }]}>
                {item.title}
              </Text>
            </View>
            <Text style={[styles.menuArrow, { color: theme.colors.text.tertiary }]}>
              ›
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.colors.error[50] }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutText, { color: theme.colors.error[600] }]}>
          🚪 Logout
        </Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={[styles.version, { color: theme.colors.text.tertiary }]}>
        Version 1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: themeConfig.spacing[4],
    paddingTop: themeConfig.spacing[8],
  },
  userCard: {
    flexDirection: 'row',
    padding: themeConfig.spacing[4],
    borderRadius: themeConfig.borderRadius.lg,
    marginBottom: themeConfig.spacing[4],
    ...themeConfig.shadows.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: themeConfig.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: themeConfig.spacing[4],
  },
  avatarText: {
    fontSize: themeConfig.typography.fontSize['2xl'],
    fontWeight: themeConfig.typography.fontWeight.bold,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: themeConfig.typography.fontSize.lg,
    fontWeight: themeConfig.typography.fontWeight.semibold,
    marginBottom: themeConfig.spacing[1],
  },
  userEmail: {
    fontSize: themeConfig.typography.fontSize.sm,
    marginBottom: themeConfig.spacing[2],
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: themeConfig.spacing[2],
    paddingVertical: themeConfig.spacing[1],
    borderRadius: themeConfig.borderRadius.sm,
  },
  roleText: {
    fontSize: themeConfig.typography.fontSize.xs,
    fontWeight: themeConfig.typography.fontWeight.semibold,
  },
  menuCard: {
    borderRadius: themeConfig.borderRadius.lg,
    marginBottom: themeConfig.spacing[4],
    ...themeConfig.shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: themeConfig.spacing[4],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: themeConfig.typography.fontSize.xl,
    marginRight: themeConfig.spacing[3],
  },
  menuTitle: {
    fontSize: themeConfig.typography.fontSize.base,
  },
  menuArrow: {
    fontSize: themeConfig.typography.fontSize['3xl'],
  },
  logoutButton: {
    padding: themeConfig.spacing[4],
    borderRadius: themeConfig.borderRadius.lg,
    alignItems: 'center',
    marginBottom: themeConfig.spacing[4],
  },
  logoutText: {
    fontSize: themeConfig.typography.fontSize.base,
    fontWeight: themeConfig.typography.fontWeight.semibold,
  },
  version: {
    textAlign: 'center',
    fontSize: themeConfig.typography.fontSize.xs,
    marginBottom: themeConfig.spacing[8],
  },
});
