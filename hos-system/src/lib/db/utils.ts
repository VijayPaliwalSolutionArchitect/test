/**
 * HOS - Hospital Management System
 * Database Utility Functions
 * ===========================================
 * Common database operations and helpers
 */

import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

/**
 * Generate unique identifier with prefix
 */
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`.toUpperCase();
}

/**
 * Generate sequential number with prefix
 */
export async function generateSequentialNumber(
  tenantId: string,
  prefix: string,
  model: 'appointment' | 'encounter' | 'invoice' | 'admission' | 'patient'
): Promise<string> {
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2);
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  
  let count = 0;
  
  switch (model) {
    case 'appointment':
      count = await prisma.appointment.count({ where: { tenantId } });
      break;
    case 'encounter':
      count = await prisma.encounter.count({ where: { tenantId } });
      break;
    case 'invoice':
      count = await prisma.invoice.count({ where: { tenantId } });
      break;
    case 'admission':
      count = await prisma.admission.count();
      break;
    case 'patient':
      count = await prisma.patient.count({ where: { tenantId } });
      break;
  }
  
  return `${prefix}${year}${month}${(count + 1).toString().padStart(5, '0')}`;
}

/**
 * Soft delete helper - marks record as deleted without removing
 */
export async function softDelete<T extends { id: string }>(
  model: Prisma.ModelName,
  id: string
): Promise<T> {
  const now = new Date();
  
  // @ts-expect-error - Dynamic model access
  return prisma[model.toLowerCase()].update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: now,
    },
  });
}

/**
 * Pagination helper
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  pageSize: number;
}

export function getPagination(params: PaginationParams): PaginationResult {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize || 20));
  
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
    page,
    pageSize,
  };
}

/**
 * Calculate total pages
 */
export function getTotalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize);
}

/**
 * Date range filter helper
 */
export interface DateRangeFilter {
  gte?: Date;
  lte?: Date;
}

export function getDateRangeFilter(
  startDate?: string | Date,
  endDate?: string | Date
): DateRangeFilter | undefined {
  if (!startDate && !endDate) return undefined;
  
  const filter: DateRangeFilter = {};
  
  if (startDate) {
    filter.gte = new Date(startDate);
  }
  
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    filter.lte = end;
  }
  
  return filter;
}

/**
 * Search filter helper for text fields
 */
export function getSearchFilter(search?: string): Prisma.StringFilter | undefined {
  if (!search || search.trim() === '') return undefined;
  
  return {
    contains: search.trim(),
    mode: 'insensitive' as Prisma.QueryMode,
  };
}

/**
 * Multi-field search helper
 */
export function getMultiFieldSearch(
  search: string | undefined,
  fields: string[]
): Prisma.Enumerable<Record<string, unknown>> | undefined {
  if (!search || search.trim() === '') return undefined;
  
  return fields.map((field) => ({
    [field]: {
      contains: search.trim(),
      mode: 'insensitive' as Prisma.QueryMode,
    },
  }));
}

/**
 * Order by helper
 */
export function getOrderBy(
  sortField?: string,
  sortOrder?: 'asc' | 'desc',
  defaultField: string = 'createdAt',
  defaultOrder: 'asc' | 'desc' = 'desc'
): Record<string, 'asc' | 'desc'> {
  return {
    [sortField || defaultField]: sortOrder || defaultOrder,
  };
}

/**
 * Transaction helper with retry logic
 */
export async function executeTransaction<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await prisma.$transaction(operation, {
        maxWait: 5000,
        timeout: 10000,
      });
    } catch (error) {
      lastError = error as Error;
      
      // Only retry on specific errors
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        ['P2028', 'P2034'].includes(error.code)
      ) {
        // Wait before retry with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
}

/**
 * Batch operation helper
 */
export async function batchOperation<T, R>(
  items: T[],
  operation: (item: T) => Promise<R>,
  batchSize: number = 50
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(operation));
    results.push(...batchResults);
  }
  
  return results;
}
