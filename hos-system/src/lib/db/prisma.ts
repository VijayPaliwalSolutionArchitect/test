/**
 * HOS - Hospital Management System
 * Prisma Database Client
 * ===========================================
 * Singleton pattern for Prisma client instance
 */

import { PrismaClient } from '@prisma/client';

// Declare global type for PrismaClient to prevent multiple instances in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Create Prisma client with logging configuration
 */
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

/**
 * Singleton Prisma client instance
 * Uses global variable in development to prevent hot-reload issues
 */
export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
