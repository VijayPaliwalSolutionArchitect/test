/**
 * HOS - Hospital Management System
 * Form Validation Schemas (Zod)
 * ===========================================
 * Centralized validation schemas for all forms
 */

import { z } from 'zod';
import { Gender, EncounterType, Role } from '@prisma/client';

// ===========================================
// AUTH SCHEMAS
// ===========================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[6-9]\d{9}$/.test(val),
      'Invalid phone number'
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ===========================================
// PATIENT SCHEMAS
// ===========================================

export const patientSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
  dob: z
    .date({ required_error: 'Date of birth is required' })
    .refine(
      (date) => date <= new Date(),
      'Date of birth cannot be in the future'
    ),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  address: z.string().max(500, 'Address too long').optional(),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    .optional(),
  allergies: z.array(z.string()).optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relation: z.string().optional(),
  }).optional(),
});

// ===========================================
// APPOINTMENT SCHEMAS
// ===========================================

export const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  departmentId: z.string().optional(),
  scheduledAt: z
    .date({ required_error: 'Appointment date/time is required' })
    .refine(
      (date) => date > new Date(),
      'Appointment must be scheduled for a future date'
    ),
  duration: z.number().min(5).max(120).default(15),
  type: z.nativeEnum(EncounterType).default(EncounterType.OPD),
  reason: z.string().max(500, 'Reason too long').optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
});

export const rescheduleSchema = z.object({
  appointmentId: z.string().min(1, 'Appointment ID is required'),
  scheduledAt: z
    .date({ required_error: 'New date/time is required' })
    .refine(
      (date) => date > new Date(),
      'Appointment must be rescheduled for a future date'
    ),
  reason: z.string().max(500, 'Reason too long').optional(),
});

// ===========================================
// CLINICAL SCHEMAS
// ===========================================

export const vitalSchema = z.object({
  encounterId: z.string().min(1, 'Encounter ID is required'),
  bp: z
    .string()
    .regex(/^\d{2,3}\/\d{2,3}$/, 'Invalid BP format (e.g., 120/80)')
    .optional(),
  heartRate: z
    .string()
    .regex(/^\d{2,3}$/, 'Invalid heart rate')
    .optional(),
  temperature: z
    .string()
    .regex(/^\d{2,3}(\.\d)?$/, 'Invalid temperature')
    .optional(),
  spo2: z
    .string()
    .regex(/^\d{2,3}$/, 'Invalid SpO2')
    .optional(),
  respiratoryRate: z
    .string()
    .regex(/^\d{1,2}$/, 'Invalid respiratory rate')
    .optional(),
  weight: z
    .string()
    .regex(/^\d{1,3}(\.\d)?$/, 'Invalid weight')
    .optional(),
  height: z
    .string()
    .regex(/^\d{2,3}$/, 'Invalid height')
    .optional(),
});

export const clinicalNoteSchema = z.object({
  encounterId: z.string().min(1, 'Encounter ID is required'),
  noteType: z.enum(['SUBJECTIVE', 'OBJECTIVE', 'ASSESSMENT', 'PLAN', 'PROGRESS', 'NURSING', 'DISCHARGE']),
  content: z
    .string()
    .min(1, 'Note content is required')
    .max(10000, 'Note too long'),
});

export const diagnosisSchema = z.object({
  encounterId: z.string().min(1, 'Encounter ID is required'),
  icdCode: z.string().optional(),
  snomedCode: z.string().optional(),
  description: z
    .string()
    .min(1, 'Diagnosis description is required')
    .max(500, 'Description too long'),
  isPrimary: z.boolean().default(false),
  notes: z.string().max(1000, 'Notes too long').optional(),
});

export const prescriptionSchema = z.object({
  encounterId: z.string().optional(),
  patientId: z.string().min(1, 'Patient is required'),
  medication: z
    .string()
    .min(1, 'Medication name is required')
    .max(200, 'Medication name too long'),
  genericName: z.string().max(200).optional(),
  dosage: z
    .string()
    .min(1, 'Dosage is required')
    .max(100, 'Dosage too long'),
  frequency: z
    .string()
    .min(1, 'Frequency is required')
    .max(50, 'Frequency too long'),
  duration: z
    .string()
    .min(1, 'Duration is required')
    .max(50, 'Duration too long'),
  route: z.string().max(50).optional(),
  instructions: z.string().max(500, 'Instructions too long').optional(),
  quantity: z.number().min(1).optional(),
});

export const labOrderSchema = z.object({
  encounterId: z.string().min(1, 'Encounter ID is required'),
  testName: z
    .string()
    .min(1, 'Test name is required')
    .max(200, 'Test name too long'),
  testCode: z.string().max(50).optional(),
  priority: z.enum(['ROUTINE', 'URGENT', 'STAT']).default('ROUTINE'),
  notes: z.string().max(500, 'Notes too long').optional(),
});

// ===========================================
// BILLING SCHEMAS
// ===========================================

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  category: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Price cannot be negative'),
  discount: z.number().min(0).max(100).default(0),
});

export const invoiceSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  discount: z.number().min(0).max(100).default(0),
  dueDate: z.date().optional(),
  notes: z.string().max(500).optional(),
});

export const paymentSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  method: z.enum(['CASH', 'CARD', 'UPI', 'INSURANCE', 'BANK_TRANSFER', 'STRIPE']),
  transactionId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

// ===========================================
// INVENTORY SCHEMAS
// ===========================================

export const inventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  sku: z.string().max(50).optional(),
  category: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  minStock: z.number().min(0).default(10),
  maxStock: z.number().min(0).optional(),
  unit: z.string().max(50).optional(),
  costPrice: z.number().min(0).optional(),
  sellPrice: z.number().min(0).optional(),
  expiryDate: z.date().optional(),
  batchNo: z.string().max(50).optional(),
  location: z.string().max(100).optional(),
});

// ===========================================
// HR SCHEMAS
// ===========================================

export const employeeSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  employeeNo: z.string().max(20).optional(),
  designation: z.string().min(1, 'Designation is required'),
  department: z.string().optional(),
  joiningDate: z.date().optional(),
  salary: z.number().min(0).optional(),
  bankDetails: z.object({
    accountNo: z.string().optional(),
    ifsc: z.string().optional(),
    bankName: z.string().optional(),
  }).optional(),
});

export const leaveRequestSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  leaveType: z.enum(['SICK', 'CASUAL', 'ANNUAL', 'MATERNITY', 'PATERNITY', 'UNPAID']),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  reason: z.string().max(500).optional(),
}).refine((data) => data.endDate >= data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// ===========================================
// MARKETING SCHEMAS
// ===========================================

export const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(200),
  description: z.string().max(1000).optional(),
  channel: z.enum(['EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WHATSAPP']),
  content: z.object({
    subject: z.string().max(200).optional(),
    body: z.string().max(5000).optional(),
  }).optional(),
  targetAudience: z.object({
    segment: z.string().optional(),
    filters: z.record(z.unknown()).optional(),
  }).optional(),
  scheduledAt: z.date().optional(),
});

// ===========================================
// USER SCHEMAS
// ===========================================

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone').optional().or(z.literal('')),
  role: z.nativeEnum(Role),
  isActive: z.boolean().default(true),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone').optional().or(z.literal('')),
  avatar: z.string().url('Invalid URL').optional(),
});

// ===========================================
// SEARCH & FILTER SCHEMAS
// ===========================================

export const searchSchema = z.object({
  query: z.string().max(100).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
  sortField: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const dateRangeSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine(
  (data) => !data.startDate || !data.endDate || data.endDate >= data.startDate,
  { message: 'End date must be after start date', path: ['endDate'] }
);

// ===========================================
// TYPE EXPORTS
// ===========================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PatientInput = z.infer<typeof patientSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type VitalInput = z.infer<typeof vitalSchema>;
export type PrescriptionInput = z.infer<typeof prescriptionSchema>;
export type LabOrderInput = z.infer<typeof labOrderSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type CampaignInput = z.infer<typeof campaignSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
