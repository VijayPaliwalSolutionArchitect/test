/**
 * HOS - Hospital Management System
 * Stats Card Component
 * ===========================================
 * Animated statistics display card
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  loading?: boolean;
}

/**
 * Animated count-up effect for numbers
 */
function useCountUp(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

export function StatsCard({
  title,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  trend,
  description,
  loading = false,
}: StatsCardProps) {
  const animatedValue = useCountUp(value);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-card-hover transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {prefix}
                {animatedValue.toLocaleString()}
                {suffix}
              </span>
            </div>
            {trend && (
              <div className="flex items-center gap-1">
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.isPositive ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={cn('p-3 rounded-xl', iconBgColor)}>
            <Icon className={cn('w-6 h-6', iconColor)} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default StatsCard;
