/**
 * HOS - Hospital Management System
 * Dashboard Layout Component
 * ===========================================
 * Main layout wrapper for all dashboard pages
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { SessionUser } from '@/types';
import type { Role } from '@prisma/client';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: SessionUser;
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        role={user.role as Role}
        userName={user.name}
        userAvatar={user.avatar}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Header */}
      <Header
        user={user}
        sidebarCollapsed={sidebarCollapsed}
        onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-200',
          sidebarCollapsed ? 'ml-[70px]' : 'ml-[260px]'
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;
