/**
 * Timetable API - RTK Query
 */

import { baseApi } from '@/api/baseApi';
import type { TimetableEntry, DailyTimetable } from '@/types';

export const timetableApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get class timetable
    getClassTimetable: builder.query<TimetableEntry[], string>({
      query: (classId) => `/classes/${classId}/timetable`,
      providesTags: (result, error, classId) => [{ type: 'Timetable', id: classId }],
    }),

    // Get daily timetable for class
    getDailyTimetable: builder.query<
      DailyTimetable,
      { classId: string; date: string }
    >({
      query: ({ classId, date }) => ({
        url: `/classes/${classId}/timetable/daily`,
        params: { date },
      }),
      providesTags: (result, error, { classId, date }) => [
        { type: 'Timetable', id: `${classId}-${date}` },
      ],
    }),

    // Get student timetable
    getStudentTimetable: builder.query<TimetableEntry[], string>({
      query: (studentId) => `/students/${studentId}/timetable`,
      providesTags: (result, error, studentId) => [{ type: 'Timetable', id: `student-${studentId}` }],
    }),

    // Get teacher timetable
    getTeacherTimetable: builder.query<TimetableEntry[], string>({
      query: (teacherId) => `/teachers/${teacherId}/timetable`,
      providesTags: (result, error, teacherId) => [{ type: 'Timetable', id: `teacher-${teacherId}` }],
    }),

    // Get today's timetable
    getTodayTimetable: builder.query<
      DailyTimetable,
      { userId: string; userType: 'student' | 'teacher' }
    >({
      query: ({ userId, userType }) => 
        `/${userType}s/${userId}/timetable/today`,
      providesTags: (result, error, { userId }) => [{ type: 'Timetable', id: `today-${userId}` }],
    }),

    // Create/Update timetable entry
    createTimetableEntry: builder.mutation<
      TimetableEntry,
      Partial<TimetableEntry>
    >({
      query: (data) => ({
        url: '/timetable',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Timetable'],
    }),

    // Update timetable entry
    updateTimetableEntry: builder.mutation<
      TimetableEntry,
      { id: string; data: Partial<TimetableEntry> }
    >({
      query: ({ id, data }) => ({
        url: `/timetable/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Timetable'],
    }),

    // Delete timetable entry
    deleteTimetableEntry: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/timetable/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Timetable'],
    }),

    // Bulk update timetable
    bulkUpdateTimetable: builder.mutation<
      { success: boolean; updated: number },
      { classId: string; entries: Partial<TimetableEntry>[] }
    >({
      query: ({ classId, entries }) => ({
        url: `/classes/${classId}/timetable/bulk`,
        method: 'POST',
        body: { entries },
      }),
      invalidatesTags: ['Timetable'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetClassTimetableQuery,
  useGetDailyTimetableQuery,
  useGetStudentTimetableQuery,
  useGetTeacherTimetableQuery,
  useGetTodayTimetableQuery,
  useCreateTimetableEntryMutation,
  useUpdateTimetableEntryMutation,
  useDeleteTimetableEntryMutation,
  useBulkUpdateTimetableMutation,
} = timetableApi;
