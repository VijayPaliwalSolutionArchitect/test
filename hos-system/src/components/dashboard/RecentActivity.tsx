/**
 * HOS - Hospital Management System
 * Recent Activity Component
 * ===========================================
 * Timeline of recent activities/events
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import {
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  CreditCard,
  UserPlus,
  Activity,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  icon?: LucideIcon;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  title?: string;
  maxItems?: number;
}

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  appointment: Calendar,
  report: FileText,
  prescription: Pill,
  lab: FlaskConical,
  payment: CreditCard,
  registration: UserPlus,
  vital: Activity,
};

const ACTIVITY_COLORS: Record<string, string> = {
  appointment: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  report: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  prescription: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  lab: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  payment: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  registration: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  vital: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
};

export function RecentActivity({
  activities,
  title = 'Recent Activity',
  maxItems = 5,
}: RecentActivityProps) {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700" />

          <div className="space-y-4">
            {displayedActivities.map((activity, index) => {
              const Icon = activity.icon || ACTIVITY_ICONS[activity.type] || Activity;
              const colorClass = ACTIVITY_COLORS[activity.type] || ACTIVITY_COLORS.vital;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative flex items-start gap-4 pl-10"
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'absolute left-0 w-8 h-8 rounded-full flex items-center justify-center',
                      colorClass
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  </div>

                  {/* Time */}
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {activities.length > maxItems && (
          <button className="mt-4 w-full text-center text-sm text-primary hover:underline">
            View all activity
          </button>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
