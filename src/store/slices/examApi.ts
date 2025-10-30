/**
 * Exam API - RTK Query
 */

import { baseApi } from '@/api/baseApi';
import type { Exam, ExamResult, ReportCard, PaginatedResponse } from '@/types';

export const examApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get exams
    getExams: builder.query<
      PaginatedResponse<Exam>,
      { classId?: string; subjectId?: string; from?: string; to?: string; page?: number }
    >({
      query: (params) => ({
        url: '/exams',
        params,
      }),
      providesTags: ['Exam'],
    }),

    // Get exam by ID
    getExam: builder.query<Exam, string>({
      query: (id) => `/exams/${id}`,
      providesTags: (result, error, id) => [{ type: 'Exam', id }],
    }),

    // Create exam
    createExam: builder.mutation<Exam, Partial<Exam>>({
      query: (data) => ({
        url: '/exams',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Exam'],
    }),

    // Update exam
    updateExam: builder.mutation<Exam, { id: string; data: Partial<Exam> }>({
      query: ({ id, data }) => ({
        url: `/exams/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Exam', id }, 'Exam'],
    }),

    // Delete exam
    deleteExam: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/exams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Exam'],
    }),

    // Get exam results
    getExamResults: builder.query<
      PaginatedResponse<ExamResult>,
      { examId: string; page?: number }
    >({
      query: ({ examId, ...params }) => ({
        url: `/exams/${examId}/results`,
        params,
      }),
      providesTags: (result, error, { examId }) => [{ type: 'Result', id: examId }],
    }),

    // Get student result for exam
    getStudentResult: builder.query<ExamResult, { examId: string; studentId: string }>({
      query: ({ examId, studentId }) => `/exams/${examId}/results/student/${studentId}`,
      providesTags: (result, error, { examId, studentId }) => [
        { type: 'Result', id: `${examId}-${studentId}` },
      ],
    }),

    // Upload exam results
    uploadExamResults: builder.mutation<
      { success: boolean; created: number; updated: number },
      { examId: string; results: Partial<ExamResult>[] }
    >({
      query: ({ examId, results }) => ({
        url: `/exams/${examId}/results`,
        method: 'POST',
        body: { results },
      }),
      invalidatesTags: ['Result'],
    }),

    // Get student's all results
    getStudentResults: builder.query<
      PaginatedResponse<ExamResult>,
      { studentId: string; academicYearId?: string; page?: number }
    >({
      query: ({ studentId, ...params }) => ({
        url: `/exams/student/${studentId}/results`,
        params,
      }),
      providesTags: (result, error, { studentId }) => [{ type: 'Result', id: `student-${studentId}` }],
    }),

    // Get report card
    getReportCard: builder.query<
      ReportCard,
      { studentId: string; classId: string; academicYearId: string; term: string }
    >({
      query: (params) => ({
        url: '/exams/report-card',
        params,
      }),
      providesTags: (result, error, { studentId }) => [{ type: 'Result', id: `report-${studentId}` }],
    }),

    // Publish results
    publishResults: builder.mutation<{ success: boolean }, string>({
      query: (examId) => ({
        url: `/exams/${examId}/publish`,
        method: 'POST',
      }),
      invalidatesTags: ['Result', 'Exam'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExamsQuery,
  useGetExamQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
  useGetExamResultsQuery,
  useGetStudentResultQuery,
  useUploadExamResultsMutation,
  useGetStudentResultsQuery,
  useGetReportCardQuery,
  usePublishResultsMutation,
} = examApi;
