/**
 * HOS - Hospital Management System
 * Quick Actions Component
 * ===========================================
 * Grid of quick action buttons
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  title: string;
  href: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

export function QuickActions({ actions, title = 'Quick Actions' }: QuickActionsProps) {
  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold">{title}</h3>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={action.href}>
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <div className={cn('p-3 rounded-xl', action.bgColor)}>
                    <Icon className={cn('w-6 h-6', action.color)} />
                  </div>
                  <span className="text-sm font-medium text-center">{action.title}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
