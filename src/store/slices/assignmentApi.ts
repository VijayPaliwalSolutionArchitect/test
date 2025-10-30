/**
 * Assignment API - RTK Query
 */

import { baseApi } from '@/api/baseApi';
import type {
  Assignment,
  AssignmentSubmission,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const assignmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get assignments
    getAssignments: builder.query<
      PaginatedResponse<Assignment>,
      { classId?: string; subjectId?: string; studentId?: string; status?: string; page?: number }
    >({
      query: (params) => ({
        url: '/assignments',
        params,
      }),
      providesTags: ['Assignment'],
    }),

    // Get assignment by ID
    getAssignment: builder.query<Assignment, string>({
      query: (id) => `/assignments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Assignment', id }],
    }),

    // Create assignment
    createAssignment: builder.mutation<Assignment, FormData | Partial<Assignment>>({
      query: (data) => ({
        url: '/assignments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Assignment'],
    }),

    // Update assignment
    updateAssignment: builder.mutation<
      Assignment,
      { id: string; data: FormData | Partial<Assignment> }
    >({
      query: ({ id, data }) => ({
        url: `/assignments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Assignment', id }, 'Assignment'],
    }),

    // Delete assignment
    deleteAssignment: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Assignment'],
    }),

    // Get assignment submissions
    getAssignmentSubmissions: builder.query<
      PaginatedResponse<AssignmentSubmission>,
      { assignmentId: string; page?: number }
    >({
      query: ({ assignmentId, ...params }) => ({
        url: `/assignments/${assignmentId}/submissions`,
        params,
      }),
      providesTags: (result, error, { assignmentId }) => [{ type: 'Submission', id: assignmentId }],
    }),

    // Get student submission
    getStudentSubmission: builder.query<
      AssignmentSubmission,
      { assignmentId: string; studentId: string }
    >({
      query: ({ assignmentId, studentId }) => 
        `/assignments/${assignmentId}/submissions/student/${studentId}`,
      providesTags: (result, error, { assignmentId, studentId }) => [
        { type: 'Submission', id: `${assignmentId}-${studentId}` },
      ],
    }),

    // Submit assignment
    submitAssignment: builder.mutation<
      AssignmentSubmission,
      { assignmentId: string; data: FormData | Partial<AssignmentSubmission> }
    >({
      query: ({ assignmentId, data }) => ({
        url: `/assignments/${assignmentId}/submit`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Submission', 'Assignment'],
    }),

    // Grade submission
    gradeSubmission: builder.mutation<
      AssignmentSubmission,
      { submissionId: string; marks: number; feedback?: string }
    >({
      query: ({ submissionId, ...data }) => ({
        url: `/assignments/submissions/${submissionId}/grade`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Submission'],
    }),

    // Get pending assignments for student
    getPendingAssignments: builder.query<Assignment[], string>({
      query: (studentId) => `/assignments/student/${studentId}/pending`,
      providesTags: ['Assignment'],
    }),

    // Get pending grading for teacher
    getPendingGrading: builder.query<AssignmentSubmission[], string>({
      query: (teacherId) => `/assignments/teacher/${teacherId}/pending-grading`,
      providesTags: ['Submission'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetAssignmentSubmissionsQuery,
  useGetStudentSubmissionQuery,
  useSubmitAssignmentMutation,
  useGradeSubmissionMutation,
  useGetPendingAssignmentsQuery,
  useGetPendingGradingQuery,
} = assignmentApi;
