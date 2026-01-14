/**
 * HOS - Hospital Management System
 * Sidebar Component
 * ===========================================
 * Role-based navigation sidebar with collapse functionality
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Building2,
  Receipt,
  Package,
  UserCog,
  FlaskConical,
  Pill,
  Megaphone,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  ClipboardList,
  Heart,
  Activity,
  CreditCard,
  Bell,
  MessageSquare,
  TrendingUp,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Role } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
}

interface SidebarProps {
  role: Role;
  userName: string;
  userAvatar?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

// Role-based navigation configurations
const ROLE_NAV_ITEMS: Record<string, NavItem[]> = {
  ADMIN: [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Patients', href: '/admin/patients', icon: Users },
    { title: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { title: 'IPD & Wards', href: '/admin/ipd', icon: Building2 },
    { title: 'Billing', href: '/admin/billing', icon: Receipt },
    { title: 'Inventory', href: '/admin/inventory', icon: Package },
    { title: 'HR & Payroll', href: '/admin/hr', icon: UserCog },
    { title: 'Labs', href: '/admin/labs', icon: FlaskConical },
    { title: 'Pharmacy', href: '/admin/pharmacy', icon: Pill },
    { title: 'Marketing', href: '/admin/marketing', icon: Megaphone },
    { title: 'Reports', href: '/admin/reports', icon: FileText },
    { title: 'Users & Roles', href: '/admin/users', icon: Shield },
    { title: 'Settings', href: '/admin/settings', icon: Settings },
  ],
  DOCTOR: [
    { title: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
    { title: 'Appointments', href: '/doctor/appointments', icon: Calendar },
    { title: 'Patients', href: '/doctor/patients', icon: Users },
    { title: 'My Tasks', href: '/doctor/tasks', icon: ClipboardList },
    { title: 'Lab Orders', href: '/doctor/lab-orders', icon: FlaskConical },
    { title: 'Prescriptions', href: '/doctor/prescriptions', icon: Pill },
    { title: 'AI Copilot', href: '/doctor/ai-copilot', icon: MessageSquare },
  ],
  NURSE: [
    { title: 'Dashboard', href: '/nurse/dashboard', icon: LayoutDashboard },
    { title: 'Patient List', href: '/nurse/patients', icon: Users },
    { title: 'Vitals', href: '/nurse/vitals', icon: Activity },
    { title: 'Medications', href: '/nurse/medications', icon: Pill },
    { title: 'Tasks', href: '/nurse/tasks', icon: ClipboardList },
    { title: 'Shift Handover', href: '/nurse/handover', icon: UserCog },
  ],
  PATIENT: [
    { title: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
    { title: 'My Health', href: '/patient/health', icon: Heart },
    { title: 'Appointments', href: '/patient/appointments', icon: Calendar },
    { title: 'My Tests', href: '/patient/tests', icon: FlaskConical },
    { title: 'Prescriptions', href: '/patient/prescriptions', icon: Pill },
    { title: 'Billing', href: '/patient/billing', icon: CreditCard },
    { title: 'AI Assistant', href: '/patient/ai-assistant', icon: MessageSquare },
  ],
  LAB_TECH: [
    { title: 'Dashboard', href: '/lab/dashboard', icon: LayoutDashboard },
    { title: 'Test Orders', href: '/lab/orders', icon: ClipboardList },
    { title: 'In Progress', href: '/lab/in-progress', icon: Activity },
    { title: 'Results', href: '/lab/results', icon: FileText },
    { title: 'Reports', href: '/lab/reports', icon: FileText },
  ],
  PHARMACIST: [
    { title: 'Dashboard', href: '/pharmacy/dashboard', icon: LayoutDashboard },
    { title: 'Prescriptions', href: '/pharmacy/prescriptions', icon: Pill },
    { title: 'Drug Stock', href: '/pharmacy/stock', icon: Package },
    { title: 'Orders', href: '/pharmacy/orders', icon: ClipboardList },
    { title: 'Suppliers', href: '/pharmacy/suppliers', icon: Users },
    { title: 'Reports', href: '/pharmacy/reports', icon: FileText },
  ],
  HR: [
    { title: 'Dashboard', href: '/hr/dashboard', icon: LayoutDashboard },
    { title: 'Employee List', href: '/hr/employees', icon: Users },
    { title: 'Attendance', href: '/hr/attendance', icon: Calendar },
    { title: 'Payroll', href: '/hr/payroll', icon: CreditCard },
    { title: 'Schedules', href: '/hr/schedules', icon: ClipboardList },
    { title: 'Reports', href: '/hr/reports', icon: FileText },
  ],
  MARKETING: [
    { title: 'Dashboard', href: '/marketing/dashboard', icon: LayoutDashboard },
    { title: 'Campaigns', href: '/marketing/campaigns', icon: Megaphone },
    { title: 'SMS & Email', href: '/marketing/messaging', icon: MessageSquare },
    { title: 'Patient Segments', href: '/marketing/segments', icon: Users },
    { title: 'Analytics', href: '/marketing/analytics', icon: TrendingUp },
  ],
};

// Role-based color themes
const ROLE_THEMES: Record<string, string> = {
  ADMIN: 'from-blue-600 to-blue-800',
  SUPER_ADMIN: 'from-blue-600 to-blue-800',
  DOCTOR: 'from-blue-700 to-indigo-800',
  NURSE: 'from-green-600 to-emerald-700',
  PATIENT: 'from-orange-500 to-orange-700',
  LAB_TECH: 'from-teal-600 to-cyan-700',
  RADIOLOGIST: 'from-teal-600 to-cyan-700',
  PHARMACIST: 'from-purple-600 to-violet-700',
  HR: 'from-yellow-600 to-amber-700',
  FINANCE: 'from-yellow-600 to-amber-700',
  MARKETING: 'from-pink-600 to-rose-700',
  RECEPTIONIST: 'from-blue-600 to-blue-800',
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  PATIENT: 'Patient',
  LAB_TECH: 'Lab',
  RADIOLOGIST: 'Lab',
  PHARMACIST: 'Pharmacy',
  HR: 'HR',
  FINANCE: 'HR',
  MARKETING: 'Marketing',
  RECEPTIONIST: 'Admin',
};

export function Sidebar({ role, userName, userAvatar, collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const navItems = ROLE_NAV_ITEMS[role] || ROLE_NAV_ITEMS.ADMIN;
  const theme = ROLE_THEMES[role] || ROLE_THEMES.ADMIN;
  const roleLabel = ROLE_LABELS[role] || 'Admin';

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 70 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'fixed left-0 top-0 h-screen z-40 bg-gradient-to-b',
        theme
      )}
    >
      {/* Logo & Brand */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-lg">HOS</span>
                <span className="text-white/70 text-xs ml-1">{roleLabel}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mx-auto">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200',
                    isActive && 'text-white bg-white/20',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!collapsed && item.badge && (
                    <span className="ml-auto bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-white/10 p-3">
        <div
          className={cn(
            'flex items-center gap-3',
            collapsed && 'justify-center'
          )}
        >
          <Avatar className="h-9 w-9 border-2 border-white/30">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-white/20 text-white text-sm">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-white text-sm font-medium truncate">{userName}</p>
                <p className="text-white/60 text-xs truncate">{role.replace('_', ' ')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </motion.aside>
  );
}

export default Sidebar;
