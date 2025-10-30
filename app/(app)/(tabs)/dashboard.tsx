/**
 * Dashboard Screen - Role-based dashboard
 */

import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, useAuth } from '@/hooks';
import { useTranslation } from 'react-i18next';
import themeConfig from '../../../../theme.config';

export default function DashboardScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();

  const renderStudentDashboard = () => (
    <View>
      <Text style={[styles.greeting, { color: theme.colors.text.primary }]}>
        Hello, {user?.firstName}! 👋
      </Text>

      {/* Upcoming Classes */}
      <View style={[styles.card, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
          Today's Schedule
        </Text>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            No classes scheduled for today
          </Text>
        </View>
      </View>

      {/* Pending Assignments */}
      <View style={[styles.card, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
          Pending Assignments
        </Text>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            All assignments completed! 🎉
          </Text>
        </View>
      </View>

      {/* Attendance Summary */}
      <View style={[styles.card, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
          Attendance
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success[600] }]}>
              85%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              Present
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
              120
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              Total Days
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.error[600] }]}>
              18
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              Absent
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTeacherDashboard = () => (
    <View>
      <Text style={[styles.greeting, { color: theme.colors.text.primary }]}>
        Welcome, Prof. {user?.lastName}! 👋
      </Text>

      {/* Today's Classes */}
      <View style={[styles.card, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
          Today's Classes
        </Text>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            No classes scheduled
          </Text>
        </View>
      </View>

      {/* Pending Grading */}
      <View style={[styles.card, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
          Pending Grading
        </Text>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            All assignments graded! 🎉
          </Text>
        </View>
      </View>
    </View>
  );

  const renderAdminDashboard = () => (
    <View>
      <Text style={[styles.greeting, { color: theme.colors.text.primary }]}>
        Admin Dashboard 👨‍💼
      </Text>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.primary[50] }]}>
          <Text style={[styles.statCardValue, { color: theme.colors.primary[700] }]}>
            450
          </Text>
          <Text style={[styles.statCardLabel, { color: theme.colors.primary[600] }]}>
            Students
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.success[50] }]}>
          <Text style={[styles.statCardValue, { color: theme.colors.success[700] }]}>
            35
          </Text>
          <Text style={[styles.statCardLabel, { color: theme.colors.success[600] }]}>
            Teachers
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.info[50] }]}>
          <Text style={[styles.statCardValue, { color: theme.colors.info[700] }]}>
            12
          </Text>
          <Text style={[styles.statCardLabel, { color: theme.colors.info[600] }]}>
            Classes
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.warning[50] }]}>
          <Text style={[styles.statCardValue, { color: theme.colors.warning[700] }]}>
            ₹2.4L
          </Text>
          <Text style={[styles.statCardLabel, { color: theme.colors.warning[600] }]}>
            Fee Pending
          </Text>
        </View>
      </View>

      {/* Today's Attendance */}
      <View style={[styles.card, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
          Today's Attendance
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success[600] }]}>
              420
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              Present
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.error[600] }]}>
              30
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              Absent
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
              93%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              Rate
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'student':
        return renderStudentDashboard();
      case 'teacher':
        return renderTeacherDashboard();
      case 'admin':
        return renderAdminDashboard();
      case 'parent':
        return renderStudentDashboard(); // Similar to student
      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}
      contentContainerStyle={styles.content}
    >
      {renderDashboardContent()}
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
  greeting: {
    fontSize: themeConfig.typography.fontSize['2xl'],
    fontWeight: themeConfig.typography.fontWeight.bold,
    marginBottom: themeConfig.spacing[4],
    marginTop: themeConfig.spacing[8],
  },
  card: {
    borderRadius: themeConfig.borderRadius.lg,
    padding: themeConfig.spacing[4],
    marginBottom: themeConfig.spacing[4],
    ...themeConfig.shadows.sm,
  },
  cardTitle: {
    fontSize: themeConfig.typography.fontSize.lg,
    fontWeight: themeConfig.typography.fontWeight.semibold,
    marginBottom: themeConfig.spacing[3],
  },
  emptyState: {
    paddingVertical: themeConfig.spacing[6],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: themeConfig.typography.fontSize.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: themeConfig.typography.fontSize['2xl'],
    fontWeight: themeConfig.typography.fontWeight.bold,
    marginBottom: themeConfig.spacing[1],
  },
  statLabel: {
    fontSize: themeConfig.typography.fontSize.xs,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: themeConfig.spacing[4],
  },
  statCard: {
    width: '48%',
    padding: themeConfig.spacing[4],
    borderRadius: themeConfig.borderRadius.lg,
    marginBottom: themeConfig.spacing[3],
    alignItems: 'center',
  },
  statCardValue: {
    fontSize: themeConfig.typography.fontSize['2xl'],
    fontWeight: themeConfig.typography.fontWeight.bold,
    marginBottom: themeConfig.spacing[1],
  },
  statCardLabel: {
    fontSize: themeConfig.typography.fontSize.sm,
    fontWeight: themeConfig.typography.fontWeight.medium,
  },
});
