/**
 * HOS - Hospital Management System
 * Home Page (Redirect to Login/Dashboard)
 * ===========================================
 */

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getRoleRedirectPath } from '@/lib/auth/jwt';

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    // Redirect to role-based dashboard
    redirect(getRoleRedirectPath(user.role));
  }

  // Redirect to login
  redirect('/login');
}
