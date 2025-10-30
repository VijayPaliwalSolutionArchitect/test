/**
 * Core TypeScript type definitions for the SIS Mobile App
 */

// ============================================================================
// User & Authentication Types
// ============================================================================

export type UserRole = 'student' | 'teacher' | 'admin' | 'parent';

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  schoolId: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  role: 'student';
  rollNumber: string;
  classId: string;
  className: string;
  section: string;
  dateOfBirth: string;
  bloodGroup?: string;
  parentIds: string[];
  admissionDate: string;
}

export interface Teacher extends User {
  role: 'teacher';
  employeeId: string;
  subjects: string[];
  classes: string[];
  qualification?: string;
  joiningDate: string;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface Parent extends User {
  role: 'parent';
  childrenIds: string[];
  children?: Student[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  identifier: string; // email or phone
  password: string;
}

export interface LoginResponse {
  user: User | Student | Teacher | Admin | Parent;
  tokens: AuthTokens;
}

// ============================================================================
// Class & Academic Types
// ============================================================================

export interface Class {
  id: string;
  name: string;
  section: string;
  grade: number;
  academicYearId: string;
  classTeacherId?: string;
  studentCount: number;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherId?: string;
  teacherName?: string;
  classId: string;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

// ============================================================================
// Timetable Types
// ============================================================================

export interface TimetableEntry {
  id: string;
  classId: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  room?: string;
}

export interface DailyTimetable {
  date: string;
  entries: TimetableEntry[];
}

// ============================================================================
// Attendance Types
// ============================================================================

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave' | 'halfDay';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: AttendanceStatus;
  date: string;
  classId: string;
  markedBy: string;
  markedAt: string;
  reason?: string;
  remarks?: string;
}

export interface AttendanceSummary {
  studentId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
  percentage: number;
}

export interface MarkAttendanceRequest {
  classId: string;
  date: string;
  records: {
    studentId: string;
    status: AttendanceStatus;
    reason?: string;
  }[];
}

// ============================================================================
// Assignment Types
// ============================================================================

export type AssignmentStatus = 'draft' | 'published' | 'closed';
export type SubmissionStatus = 'pending' | 'submitted' | 'graded' | 'overdue';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  status: AssignmentStatus;
  dueDate: string;
  maxMarks?: number;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  status: SubmissionStatus;
  submittedAt?: string;
  text?: string;
  attachments: Attachment[];
  marks?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string; // 'pdf', 'image', 'video', 'doc'
  fileSize: number;
  uploadedAt: string;
}

// ============================================================================
// Exam & Results Types
// ============================================================================

export type ExamType = 'unit_test' | 'mid_term' | 'final' | 'practical';

export interface Exam {
  id: string;
  name: string;
  type: ExamType;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  date: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passingMarks: number;
  venue?: string;
  instructions?: string;
  syllabus?: string[];
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
  remarks?: string;
  publishedAt?: string;
}

export interface ReportCard {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  academicYearId: string;
  term: string;
  results: ExamResult[];
  overallPercentage: number;
  overallGrade: string;
  rank?: number;
  attendance: AttendanceSummary;
  remarks?: string;
  generatedAt: string;
}

// ============================================================================
// Fee Management Types
// ============================================================================

export type FeeStatus = 'pending' | 'paid' | 'overdue' | 'partial';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'net_banking' | 'cheque';

export interface FeeStructure {
  id: string;
  classId: string;
  academicYearId: string;
  tuitionFee: number;
  transportFee?: number;
  examFee?: number;
  libraryFee?: number;
  activityFee?: number;
  otherFees?: { name: string; amount: number }[];
  totalAmount: number;
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  classId: string;
  academicYearId: string;
  feeStructure: FeeStructure;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: FeeStatus;
  dueDate: string;
  issuedAt: string;
  payments: Payment[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  paymentDate: string;
  receiptUrl?: string;
  remarks?: string;
}

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
  invoiceId: string;
}

// ============================================================================
// Messaging & Notifications
// ============================================================================

export type NotificationType = 
  | 'announcement' 
  | 'assignment' 
  | 'exam' 
  | 'attendance' 
  | 'fee' 
  | 'message'
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  userId?: string; // null for broadcast
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  attachments?: Attachment[];
  isRead: boolean;
  sentAt: string;
  editedAt?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Library Types
// ============================================================================

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher?: string;
  totalCopies: number;
  availableCopies: number;
  coverImage?: string;
}

export interface BookIssue {
  id: string;
  bookId: string;
  studentId: string;
  issuedDate: string;
  dueDate: string;
  returnedDate?: string;
  fine?: number;
  status: 'issued' | 'returned' | 'overdue';
}

// ============================================================================
// Transport Types
// ============================================================================

export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  stops: BusStop[];
  activeStudents: number;
}

export interface BusStop {
  id: string;
  name: string;
  time: string;
  latitude?: number;
  longitude?: number;
  order: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ============================================================================
// App State Types
// ============================================================================

export interface AppSettings {
  language: 'en' | 'hi' | 'gu';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    assignments: boolean;
    attendance: boolean;
    fees: boolean;
    exams: boolean;
  };
  biometricEnabled: boolean;
}

export interface SyncStatus {
  lastSyncAt?: string;
  isSyncing: boolean;
  pendingItems: number;
  failedItems: number;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface StudentDashboard {
  upcomingClasses: TimetableEntry[];
  pendingAssignments: Assignment[];
  recentNotifications: Notification[];
  attendanceSummary: AttendanceSummary;
  feeStatus: FeeInvoice[];
  todayTimetable: TimetableEntry[];
}

export interface TeacherDashboard {
  todayClasses: TimetableEntry[];
  pendingGrading: AssignmentSubmission[];
  recentNotifications: Notification[];
  classStats: {
    classId: string;
    className: string;
    totalStudents: number;
    presentToday: number;
    absentToday: number;
  }[];
}

export interface AdminDashboard {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceToday: {
    present: number;
    absent: number;
    percentage: number;
  };
  feeCollection: {
    total: number;
    collected: number;
    pending: number;
    percentage: number;
  };
  recentActivities: {
    type: string;
    description: string;
    timestamp: string;
  }[];
}

// ============================================================================
// Form Types
// ============================================================================

export interface CreateStudentForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodGroup?: string;
  classId: string;
  rollNumber: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  admissionDate: string;
}

export interface CreateAssignmentForm {
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  dueDate: string;
  maxMarks?: number;
  attachments: File[];
}

export interface SubmitAssignmentForm {
  assignmentId: string;
  text?: string;
  attachments: File[];
}
