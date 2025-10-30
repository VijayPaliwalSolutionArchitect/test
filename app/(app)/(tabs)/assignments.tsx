/**
 * Assignments Screen - View and manage assignments
 */

import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, useAuth } from '@/hooks';
import { useTranslation } from 'react-i18next';
import themeConfig from '../../../../theme.config';

export default function AssignmentsScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {t('assignments.title')}
      </Text>

      <View style={[styles.card, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
          {user?.role === 'student' 
            ? 'No pending assignments' 
            : 'No assignments created yet'}
        </Text>
      </View>

      {user?.role === 'teacher' && (
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.colors.primary[600] }]}
        >
          <Text style={[styles.createButtonText, { color: theme.colors.white }]}>
            + Create Assignment
          </Text>
        </TouchableOpacity>
      )}
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
  createButton: {
    marginTop: themeConfig.spacing[4],
    padding: themeConfig.spacing[4],
    borderRadius: themeConfig.borderRadius.md,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: themeConfig.typography.fontSize.base,
    fontWeight: themeConfig.typography.fontWeight.semibold,
  },
});
