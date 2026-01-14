/**
 * HOS - Hospital Management System
 * JWT Authentication Utilities
 * ===========================================
 * Handles JWT token creation, verification, and session management
 */

import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';
import type { JWTPayload, SessionUser } from '@/types';

// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';
const COOKIE_NAME = 'hos_session';

/**
 * Create a JWT token for authenticated user
 */
export async function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const token = await new SignJWT(payload as unknown as JoseJWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Set authentication cookie
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

/**
 * Get authentication cookie
 */
export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

/**
 * Remove authentication cookie
 */
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Get current session user from cookie
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await getAuthCookie();
  
  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  
  if (!payload) {
    return null;
  }

  return {
    id: payload.userId,
    tenantId: payload.tenantId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
}

/**
 * Check if user has specific role
 */
export function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Check if user has admin-level access
 */
export function isAdmin(role: Role): boolean {
  return [Role.SUPER_ADMIN, Role.ADMIN].includes(role);
}

/**
 * Check if user has clinical access (doctors, nurses)
 */
export function isClinicalStaff(role: Role): boolean {
  return [Role.DOCTOR, Role.NURSE].includes(role);
}

/**
 * Check if user has lab access
 */
export function isLabStaff(role: Role): boolean {
  return [Role.LAB_TECH, Role.RADIOLOGIST].includes(role);
}

/**
 * Get role-based redirect path after login
 */
export function getRoleRedirectPath(role: Role): string {
  switch (role) {
    case Role.SUPER_ADMIN:
    case Role.ADMIN:
      return '/admin/dashboard';
    case Role.DOCTOR:
      return '/doctor/dashboard';
    case Role.NURSE:
      return '/nurse/dashboard';
    case Role.LAB_TECH:
    case Role.RADIOLOGIST:
      return '/lab/dashboard';
    case Role.PHARMACIST:
      return '/pharmacy/dashboard';
    case Role.HR:
    case Role.FINANCE:
      return '/hr/dashboard';
    case Role.MARKETING:
      return '/marketing/dashboard';
    case Role.RECEPTIONIST:
      return '/reception/dashboard';
    case Role.PATIENT:
      return '/patient/dashboard';
    default:
      return '/dashboard';
  }
}

/**
 * Role-based access control matrix
 */
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: ['*'], // Full access
  ADMIN: [
    'dashboard:view',
    'patients:*',
    'appointments:*',
    'encounters:*',
    'billing:*',
    'inventory:*',
    'reports:*',
    'users:*',
    'settings:*',
  ],
  DOCTOR: [
    'dashboard:view',
    'patients:view',
    'patients:create',
    'appointments:*',
    'encounters:*',
    'prescriptions:*',
    'orders:create',
    'reports:view',
  ],
  NURSE: [
    'dashboard:view',
    'patients:view',
    'vitals:*',
    'medications:administer',
    'notes:create',
    'tasks:*',
  ],
  LAB_TECH: [
    'dashboard:view',
    'orders:view',
    'samples:*',
    'results:*',
    'reports:create',
  ],
  RADIOLOGIST: [
    'dashboard:view',
    'orders:view',
    'imaging:*',
    'reports:create',
  ],
  PHARMACIST: [
    'dashboard:view',
    'prescriptions:*',
    'inventory:view',
    'dispensing:*',
  ],
  HR: [
    'dashboard:view',
    'employees:*',
    'attendance:*',
    'payroll:*',
    'leaves:*',
  ],
  FINANCE: [
    'dashboard:view',
    'billing:*',
    'payments:*',
    'reports:financial',
  ],
  MARKETING: [
    'dashboard:view',
    'campaigns:*',
    'feedback:view',
    'analytics:view',
  ],
  RECEPTIONIST: [
    'dashboard:view',
    'patients:view',
    'patients:create',
    'appointments:*',
  ],
  PATIENT: [
    'dashboard:view',
    'profile:*',
    'appointments:view',
    'appointments:create',
    'reports:view',
    'prescriptions:view',
    'payments:view',
  ],
};

/**
 * Check if user has specific permission
 */
export function hasPermission(role: Role, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  
  // Super admin has all permissions
  if (permissions.includes('*')) return true;
  
  // Check exact permission
  if (permissions.includes(permission)) return true;
  
  // Check wildcard permissions (e.g., 'patients:*' matches 'patients:view')
  const [resource] = permission.split(':');
  if (permissions.includes(`${resource}:*`)) return true;
  
  return false;
}
