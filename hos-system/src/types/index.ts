/**
 * HOS - Hospital Management System
 * TypeScript Type Definitions
 * ===========================================
 * Central type definitions for the entire application
 */

import { Role, Gender, EncounterType, EncounterStatus, AppointmentStatus, OrderStatus, InvoiceStatus, BedStatus, CampaignChannel, CampaignStatus } from '@prisma/client';

// Re-export Prisma enums for convenience
export { Role, Gender, EncounterType, EncounterStatus, AppointmentStatus, OrderStatus, InvoiceStatus, BedStatus, CampaignChannel, CampaignStatus };

// ===========================================
// AUTH TYPES
// ===========================================

export interface JWTPayload {
  userId: string;
  tenantId: string;
  email: string;
  role: Role;
  name: string;
  iat?: number;
  exp?: number;
}

export interface SessionUser {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  phone?: string;
}

// ===========================================
// DASHBOARD TYPES
// ===========================================

export interface DashboardStats {
  totalOPD: number;
  totalIPD: number;
  totalRevenue: number;
  totalPatients: number;
  todayAppointments: number;
  pendingReports: number;
  lowStockItems: number;
  activeStaff: number;
}

export interface AdminDashboardData {
  stats: DashboardStats;
  opdVsIpdChart: ChartData[];
  revenueChart: ChartData[];
  inventoryAlerts: InventoryAlert[];
  recentAppointments: AppointmentSummary[];
  departmentStats: DepartmentStat[];
}

export interface DoctorDashboardData {
  todayAppointments: AppointmentSummary[];
  pendingTasks: Task[];
  recentPatients: PatientSummary[];
  pendingLabResults: LabResultSummary[];
  stats: {
    todayPatients: number;
    completedConsults: number;
    pendingReports: number;
    followUps: number;
  };
}

export interface PatientDashboardData {
  upcomingAppointments: AppointmentSummary[];
  recentReports: ReportSummary[];
  activePrescriptions: PrescriptionSummary[];
  healthTimeline: TimelineEvent[];
  healthOverview: HealthOverview;
}

export interface NurseDashboardData {
  assignedPatients: PatientAssignment[];
  todayTasks: NurseTask[];
  alerts: Alert[];
  medicationSchedule: MedicationScheduleItem[];
  vitalsDue: VitalsDueItem[];
}

export interface LabDashboardData {
  pendingSamples: LabSample[];
  testsInProgress: LabTest[];
  resultsToReview: LabResult[];
  stats: {
    pendingCount: number;
    inProgressCount: number;
    completedToday: number;
  };
}

export interface PharmacyDashboardData {
  prescriptionQueue: PrescriptionQueueItem[];
  stockLevels: StockLevel[];
  expiryAlerts: ExpiryAlert[];
  topOrders: TopOrder[];
  stats: {
    pendingPrescriptions: number;
    dispensedToday: number;
    lowStockItems: number;
  };
}

export interface HRDashboardData {
  employeeStats: EmployeeStats;
  payrollSummary: PayrollSummary;
  recentHires: RecentHire[];
  upcomingShifts: ShiftSchedule[];
  leaveRequests: LeaveRequest[];
}

export interface MarketingDashboardData {
  activeCampaigns: CampaignSummary[];
  emailPerformance: EmailPerformance;
  patientSegments: PatientSegment[];
  feedbackSummary: FeedbackSummary;
  stats: {
    totalCampaigns: number;
    activeCount: number;
    avgOpenRate: number;
    npsScore: number;
  };
}

// ===========================================
// CHART & VISUALIZATION TYPES
// ===========================================

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

// ===========================================
// ENTITY SUMMARY TYPES
// ===========================================

export interface PatientSummary {
  id: string;
  fullName: string;
  mrn: string;
  gender: Gender;
  age: number;
  phone: string;
  lastVisit?: Date;
}

export interface AppointmentSummary {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  scheduledAt: Date;
  status: AppointmentStatus;
  type: EncounterType;
  reason?: string;
}

export interface EncounterSummary {
  id: string;
  encounterNo: string;
  patientName: string;
  doctorName: string;
  type: EncounterType;
  status: EncounterStatus;
  chiefComplaint?: string;
  startedAt: Date;
}

export interface PrescriptionSummary {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: string;
  prescribedAt: Date;
  isDispensed: boolean;
}

export interface ReportSummary {
  id: string;
  testName: string;
  orderedAt: Date;
  publishedAt?: Date;
  status: OrderStatus;
  isAbnormal: boolean;
}

export interface LabResultSummary {
  id: string;
  patientName: string;
  testName: string;
  status: OrderStatus;
  priority: string;
  orderedAt: Date;
}

// ===========================================
// DASHBOARD-SPECIFIC TYPES
// ===========================================

export interface InventoryAlert {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  status: 'critical' | 'low' | 'expiring';
}

export interface DepartmentStat {
  name: string;
  opdCount: number;
  ipdCount: number;
  revenue: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  type: string;
}

export interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  date: Date;
  icon?: string;
}

export interface HealthOverview {
  conditions: string[];
  allergies: string[];
  lastBP?: string;
  lastWeight?: string;
  lastVisit?: Date;
}

export interface PatientAssignment {
  id: string;
  patientName: string;
  bedNumber?: string;
  wardName?: string;
  admittedAt: Date;
  attendingDoctor: string;
  status: string;
}

export interface NurseTask {
  id: string;
  patientName: string;
  taskType: string;
  description: string;
  dueTime: Date;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface MedicationScheduleItem {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  scheduledTime: Date;
  administered: boolean;
}

export interface VitalsDueItem {
  id: string;
  patientName: string;
  vitalType: string;
  lastRecorded?: Date;
  dueAt: Date;
}

export interface LabSample {
  id: string;
  patientName: string;
  testName: string;
  collectedAt?: Date;
  priority: string;
  status: string;
}

export interface LabTest {
  id: string;
  patientName: string;
  testName: string;
  status: string;
  startedAt: Date;
  estimatedCompletion?: Date;
}

export interface LabResult {
  id: string;
  patientName: string;
  testName: string;
  result: Record<string, unknown>;
  isAbnormal: boolean;
  completedAt: Date;
}

export interface PrescriptionQueueItem {
  id: string;
  patientName: string;
  doctorName: string;
  medicationCount: number;
  prescribedAt: Date;
  status: 'pending' | 'processing' | 'ready';
}

export interface StockLevel {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  percentage: number;
}

export interface ExpiryAlert {
  id: string;
  name: string;
  batchNo?: string;
  expiryDate: Date;
  quantity: number;
  daysToExpiry: number;
}

export interface TopOrder {
  id: string;
  name: string;
  orderCount: number;
  totalQuantity: number;
}

export interface EmployeeStats {
  totalEmployees: number;
  activeToday: number;
  onLeave: number;
  departments: { name: string; count: number }[];
}

export interface PayrollSummary {
  totalSalary: number;
  processed: number;
  pending: number;
  monthlyTrend: ChartData[];
}

export interface RecentHire {
  id: string;
  name: string;
  designation: string;
  department: string;
  joiningDate: Date;
}

export interface ShiftSchedule {
  id: string;
  employeeName: string;
  shiftType: string;
  date: Date;
  startTime: Date;
  endTime: Date;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

export interface CampaignSummary {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  sent: number;
  opened: number;
  clicked: number;
  openRate: number;
}

export interface EmailPerformance {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  trend: ChartData[];
}

export interface PatientSegment {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface FeedbackSummary {
  averageRating: number;
  totalResponses: number;
  npsScore: number;
  distribution: ChartData[];
  recentComments: { rating: number; comment: string; date: Date }[];
}

// ===========================================
// API RESPONSE TYPES
// ===========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// ===========================================
// AI TYPES
// ===========================================

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface AIChatRequest {
  message: string;
  context?: Record<string, unknown>;
  sessionId?: string;
}

export interface AIChatResponse {
  message: string;
  suggestions?: string[];
  confidence?: number;
  sources?: string[];
}

export interface AIClinicalSummary {
  summary: string;
  keyFindings: string[];
  riskFactors: string[];
  recommendations: string[];
}

// ===========================================
// FORM TYPES
// ===========================================

export interface PatientFormData {
  fullName: string;
  gender: Gender;
  dob: Date;
  phone: string;
  email?: string;
  address?: string;
  bloodGroup?: string;
  allergies?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  departmentId?: string;
  scheduledAt: Date;
  duration?: number;
  type: EncounterType;
  reason?: string;
  notes?: string;
}

export interface VitalFormData {
  encounterId: string;
  bp?: string;
  heartRate?: string;
  temperature?: string;
  spo2?: string;
  weight?: string;
  height?: string;
  respiratoryRate?: string;
  bloodSugar?: string;
}

export interface PrescriptionFormData {
  encounterId?: string;
  patientId: string;
  medication: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  route?: string;
  instructions?: string;
  quantity?: number;
}

export interface LabOrderFormData {
  encounterId: string;
  testName: string;
  testCode?: string;
  priority: 'ROUTINE' | 'URGENT' | 'STAT';
  notes?: string;
}

// ===========================================
// NAVIGATION & UI TYPES
// ===========================================

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// ===========================================
// THEME TYPES
// ===========================================

export type RoleTheme = 'admin' | 'doctor' | 'patient' | 'nurse' | 'lab' | 'pharmacy' | 'hr' | 'marketing';

export interface ThemeConfig {
  role: RoleTheme;
  primaryColor: string;
  sidebarBg: string;
  accentColor: string;
}

export const ROLE_THEMES: Record<Role, ThemeConfig> = {
  SUPER_ADMIN: { role: 'admin', primaryColor: '#3B82F6', sidebarBg: '#1E40AF', accentColor: '#60A5FA' },
  ADMIN: { role: 'admin', primaryColor: '#3B82F6', sidebarBg: '#1E40AF', accentColor: '#60A5FA' },
  DOCTOR: { role: 'doctor', primaryColor: '#2563EB', sidebarBg: '#1D4ED8', accentColor: '#3B82F6' },
  NURSE: { role: 'nurse', primaryColor: '#22C55E', sidebarBg: '#15803D', accentColor: '#4ADE80' },
  LAB_TECH: { role: 'lab', primaryColor: '#14B8A6', sidebarBg: '#0F766E', accentColor: '#2DD4BF' },
  RADIOLOGIST: { role: 'lab', primaryColor: '#14B8A6', sidebarBg: '#0F766E', accentColor: '#2DD4BF' },
  PHARMACIST: { role: 'pharmacy', primaryColor: '#8B5CF6', sidebarBg: '#6D28D9', accentColor: '#A78BFA' },
  HR: { role: 'hr', primaryColor: '#EAB308', sidebarBg: '#A16207', accentColor: '#FACC15' },
  FINANCE: { role: 'hr', primaryColor: '#EAB308', sidebarBg: '#A16207', accentColor: '#FACC15' },
  MARKETING: { role: 'marketing', primaryColor: '#EC4899', sidebarBg: '#BE185D', accentColor: '#F472B6' },
  RECEPTIONIST: { role: 'admin', primaryColor: '#3B82F6', sidebarBg: '#1E40AF', accentColor: '#60A5FA' },
  PATIENT: { role: 'patient', primaryColor: '#F97316', sidebarBg: '#C2410C', accentColor: '#FB923C' },
};
