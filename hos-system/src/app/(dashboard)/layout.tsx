/**
 * HOS - Hospital Management System
 * Dashboard Layout
 * ===========================================
 * Layout wrapper for all dashboard pages with sidebar and header
 */

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
