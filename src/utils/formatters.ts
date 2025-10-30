/**
 * Formatting Utilities
 */

import { format, formatDistanceToNow, parseISO, isToday, isYesterday, isTomorrow } from 'date-fns';

export const Formatters = {
  // Format date
  formatDate: (date: string | Date, formatStr: string = 'dd MMM yyyy'): string => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return format(dateObj, formatStr);
    } catch {
      return '';
    }
  },

  // Format time
  formatTime: (date: string | Date, formatStr: string = 'hh:mm a'): string => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return format(dateObj, formatStr);
    } catch {
      return '';
    }
  },

  // Format datetime
  formatDateTime: (date: string | Date, formatStr: string = 'dd MMM yyyy, hh:mm a'): string => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return format(dateObj, formatStr);
    } catch {
      return '';
    }
  },

  // Relative time (e.g., "2 hours ago")
  formatRelativeTime: (date: string | Date): string => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch {
      return '';
    }
  },

  // Smart date formatting (Today, Yesterday, or date)
  formatSmartDate: (date: string | Date): string => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      
      if (isToday(dateObj)) return 'Today';
      if (isYesterday(dateObj)) return 'Yesterday';
      if (isTomorrow(dateObj)) return 'Tomorrow';
      
      return format(dateObj, 'dd MMM yyyy');
    } catch {
      return '';
    }
  },

  // Format currency (Indian Rupee)
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  // Format percentage
  formatPercentage: (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
  },

  // Format phone number (Indian format)
  formatPhoneNumber: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  // Format name (title case)
  formatName: (name: string): string => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  // Get initials
  getInitials: (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  },

  // Truncate text
  truncate: (text: string, maxLength: number = 50, suffix: string = '...'): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  },

  // Format grade
  formatGrade: (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 33) return 'D';
    return 'F';
  },

  // Format attendance percentage with color
  getAttendanceColor: (percentage: number): string => {
    if (percentage >= 90) return '#22c55e'; // green
    if (percentage >= 75) return '#f59e0b'; // orange
    return '#ef4444'; // red
  },
};

export default Formatters;
