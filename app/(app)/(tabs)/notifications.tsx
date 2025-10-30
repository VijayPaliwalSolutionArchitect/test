/**
 * Notifications Screen - View all notifications
 */

import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks';
import { useTranslation } from 'react-i18next';
import themeConfig from '../../../../theme.config';

export default function NotificationsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {t('notifications.title')}
      </Text>

      <View style={[styles.card, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
          No new notifications
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: themeConfig.spacing[4],
  },
  title: {
    fontSize: themeConfig.typography.fontSize['2xl'],
    fontWeight: themeConfig.typography.fontWeight.bold,
    marginTop: themeConfig.spacing[8],
    marginBottom: themeConfig.spacing[4],
  },
  card: {
    borderRadius: themeConfig.borderRadius.lg,
    padding: themeConfig.spacing[8],
    alignItems: 'center',
    ...themeConfig.shadows.sm,
  },
  emptyText: {
    fontSize: themeConfig.typography.fontSize.base,
  },
});
