/**
 * HOS - Hospital Management System
 * Logout API Route
 * ===========================================
 * POST /api/auth/logout - Sign out user
 */

import { NextResponse } from 'next/server';
import { removeAuthCookie, getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (user) {
      // Log audit event
      await prisma.auditLog.create({
        data: {
          tenantId: user.tenantId,
          userId: user.id,
          action: 'LOGOUT',
          entity: 'User',
          entityId: user.id,
        },
      });
    }

    // Remove auth cookie
    await removeAuthCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear the cookie even if there's an error
    await removeAuthCookie();
    return NextResponse.json({ success: true });
  }
}
