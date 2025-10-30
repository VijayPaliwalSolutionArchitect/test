/**
 * Tab Navigation - Role-based bottom tabs
 */

import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks';
import { useAppSelector } from '@/store';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const theme = useTheme();
  const user = useAppSelector(state => state.auth.user);

  // Define tabs based on user role
  const getTabScreens = () => {
    switch (user?.role) {
      case 'student':
        return (
          <>
            <Tabs.Screen
              name="dashboard"
              options={{
                title: 'Dashboard',
                tabBarIcon: () => '🏠',
              }}
            />
            <Tabs.Screen
              name="timetable"
              options={{
                title: 'Timetable',
                tabBarIcon: () => '📅',
              }}
            />
            <Tabs.Screen
              name="assignments"
              options={{
                title: 'Assignments',
                tabBarIcon: () => '📝',
              }}
            />
            <Tabs.Screen
              name="notifications"
              options={{
                title: 'Notifications',
                tabBarIcon: () => '🔔',
              }}
            />
            <Tabs.Screen
              name="more"
              options={{
                title: 'More',
                tabBarIcon: () => '⋯',
              }}
            />
          </>
        );
      
      case 'teacher':
        return (
          <>
            <Tabs.Screen
              name="dashboard"
              options={{
                title: 'Dashboard',
                tabBarIcon: () => '🏠',
              }}
            />
            <Tabs.Screen
              name="classes"
              options={{
                title: 'Classes',
                tabBarIcon: () => '👥',
              }}
            />
            <Tabs.Screen
              name="assignments"
              options={{
                title: 'Assignments',
                tabBarIcon: () => '📝',
              }}
            />
            <Tabs.Screen
              name="notifications"
              options={{
                title: 'Notifications',
                tabBarIcon: () => '🔔',
              }}
            />
            <Tabs.Screen
              name="more"
              options={{
                title: 'More',
                tabBarIcon: () => '⋯',
              }}
            />
          </>
        );
      
      case 'admin':
        return (
          <>
            <Tabs.Screen
              name="dashboard"
              options={{
                title: 'Dashboard',
                tabBarIcon: () => '🏠',
              }}
            />
            <Tabs.Screen
              name="users"
              options={{
                title: 'Users',
                tabBarIcon: () => '👥',
              }}
            />
            <Tabs.Screen
              name="reports"
              options={{
                title: 'Reports',
                tabBarIcon: () => '📊',
              }}
            />
            <Tabs.Screen
              name="notifications"
              options={{
                title: 'Notifications',
                tabBarIcon: () => '🔔',
              }}
            />
            <Tabs.Screen
              name="more"
              options={{
                title: 'More',
                tabBarIcon: () => '⋯',
              }}
            />
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary[600],
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.default,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      {getTabScreens()}
    </Tabs>
  );
}
