/**
 * User API - RTK Query
 */

import { baseApi } from '@/api/baseApi';
import type { User, Student, Teacher, Admin, Parent, ApiResponse, PaginatedResponse } from '@/types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user
    getMe: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),

    // Update current user
    updateMe: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/users/me',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Upload avatar
    uploadAvatar: builder.mutation<{ avatarUrl: string }, FormData>({
      query: (formData) => ({
        url: '/users/me/avatar',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),

    // Get user by ID
    getUser: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Students
    getStudents: builder.query<
      PaginatedResponse<Student>,
      { classId?: string; search?: string; page?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: '/students',
        params,
      }),
      providesTags: ['Student'],
    }),

    getStudent: builder.query<Student, string>({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),

    createStudent: builder.mutation<Student, Partial<Student>>({
      query: (data) => ({
        url: '/students',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Student'],
    }),

    updateStudent: builder.mutation<Student, { id: string; data: Partial<Student> }>({
      query: ({ id, data }) => ({
        url: `/students/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }, 'Student'],
    }),

    bulkCreateStudents: builder.mutation<{ created: number; errors: any[] }, FormData>({
      query: (formData) => ({
        url: '/students/bulk',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Student'],
    }),

    // Teachers
    getTeachers: builder.query<
      PaginatedResponse<Teacher>,
      { subjectId?: string; search?: string; page?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: '/teachers',
        params,
      }),
      providesTags: ['Teacher'],
    }),

    getTeacher: builder.query<Teacher, string>({
      query: (id) => `/teachers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Teacher', id }],
    }),

    createTeacher: builder.mutation<Teacher, Partial<Teacher>>({
      query: (data) => ({
        url: '/teachers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Teacher'],
    }),

    updateTeacher: builder.mutation<Teacher, { id: string; data: Partial<Teacher> }>({
      query: ({ id, data }) => ({
        url: `/teachers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Teacher', id }, 'Teacher'],
    }),

    // Parents
    getParent: builder.query<Parent, string>({
      query: (id) => `/parents/${id}`,
      providesTags: (result, error, id) => [{ type: 'Parent', id }],
    }),

    getParentChildren: builder.query<Student[], string>({
      query: (parentId) => `/parents/${parentId}/children`,
      providesTags: ['Student'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useUploadAvatarMutation,
  useGetUserQuery,
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useBulkCreateStudentsMutation,
  useGetTeachersQuery,
  useGetTeacherQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useGetParentQuery,
  useGetParentChildrenQuery,
} = userApi;
