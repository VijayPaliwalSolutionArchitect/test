/**
 * Attendance API - RTK Query
 */

import { baseApi } from '@/api/baseApi';
import type {
  AttendanceRecord,
  AttendanceSummary,
  MarkAttendanceRequest,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Mark attendance for a class
    markAttendance: builder.mutation<ApiResponse, MarkAttendanceRequest>({
      query: (data) => ({
        url: '/attendance/mark',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),

    // Get attendance by class
    getClassAttendance: builder.query<
      PaginatedResponse<AttendanceRecord>,
      { classId: string; from?: string; to?: string; page?: number }
    >({
      query: ({ classId, ...params }) => ({
        url: `/attendance/class/${classId}`,
        params,
      }),
      providesTags: (result, error, { classId }) => [{ type: 'Attendance', id: classId }],
    }),

    // Get attendance by student
    getStudentAttendance: builder.query<
      PaginatedResponse<AttendanceRecord>,
      { studentId: string; from?: string; to?: string; page?: number }
    >({
      query: ({ studentId, ...params }) => ({
        url: `/attendance/student/${studentId}`,
        params,
      }),
      providesTags: (result, error, { studentId }) => [{ type: 'Attendance', id: studentId }],
    }),

    // Get attendance summary
    getAttendanceSummary: builder.query<
      AttendanceSummary,
      { studentId: string; from?: string; to?: string }
    >({
      query: ({ studentId, ...params }) => ({
        url: `/attendance/student/${studentId}/summary`,
        params,
      }),
      providesTags: (result, error, { studentId }) => [{ type: 'Attendance', id: `summary-${studentId}` }],
    }),

    // Get today's attendance for a class
    getTodayAttendance: builder.query<AttendanceRecord[], string>({
      query: (classId) => `/attendance/class/${classId}/today`,
      providesTags: (result, error, classId) => [{ type: 'Attendance', id: `today-${classId}` }],
    }),

    // Update single attendance record
    updateAttendanceRecord: builder.mutation<
      AttendanceRecord,
      { id: string; data: Partial<AttendanceRecord> }
    >({
      query: ({ id, data }) => ({
        url: `/attendance/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),

    // Get attendance statistics for admin dashboard
    getAttendanceStats: builder.query<
      {
        date: string;
        totalStudents: number;
        present: number;
        absent: number;
        late: number;
        leave: number;
        percentage: number;
      },
      { date?: string }
    >({
      query: (params) => ({
        url: '/attendance/stats',
        params,
      }),
      providesTags: ['Attendance'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useMarkAttendanceMutation,
  useGetClassAttendanceQuery,
  useGetStudentAttendanceQuery,
  useGetAttendanceSummaryQuery,
  useGetTodayAttendanceQuery,
  useUpdateAttendanceRecordMutation,
  useGetAttendanceStatsQuery,
} = attendanceApi;
