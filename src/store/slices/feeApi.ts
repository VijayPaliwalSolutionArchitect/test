/**
 * Fee API - RTK Query
 */

import { baseApi } from '@/api/baseApi';
import type { FeeInvoice, Payment, PaymentIntent, PaginatedResponse } from '@/types';

export const feeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get student invoices
    getStudentInvoices: builder.query<
      PaginatedResponse<FeeInvoice>,
      { studentId: string; status?: string; page?: number }
    >({
      query: ({ studentId, ...params }) => ({
        url: `/fees/student/${studentId}/invoices`,
        params,
      }),
      providesTags: (result, error, { studentId }) => [{ type: 'Fee', id: studentId }],
    }),

    // Get invoice by ID
    getInvoice: builder.query<FeeInvoice, string>({
      query: (id) => `/fees/invoices/${id}`,
      providesTags: (result, error, id) => [{ type: 'Fee', id }],
    }),

    // Create payment intent (for online payment)
    createPaymentIntent: builder.mutation<
      PaymentIntent,
      { invoiceId: string; amount: number; method: string }
    >({
      query: (data) => ({
        url: '/fees/payment-intent',
        method: 'POST',
        body: data,
      }),
    }),

    // Record payment (for offline/cash payments)
    recordPayment: builder.mutation<
      Payment,
      {
        invoiceId: string;
        amount: number;
        method: string;
        transactionId?: string;
        remarks?: string;
      }
    >({
      query: (data) => ({
        url: '/fees/payments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { invoiceId }) => [
        { type: 'Fee', id: invoiceId },
        { type: 'Payment', id: invoiceId },
      ],
    }),

    // Get payment receipt
    getPaymentReceipt: builder.query<{ receiptUrl: string }, string>({
      query: (paymentId) => `/fees/payments/${paymentId}/receipt`,
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),

    // Get all payments for invoice
    getInvoicePayments: builder.query<Payment[], string>({
      query: (invoiceId) => `/fees/invoices/${invoiceId}/payments`,
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),

    // Get fee statistics (for admin)
    getFeeStats: builder.query<
      {
        total: number;
        collected: number;
        pending: number;
        overdue: number;
        percentage: number;
      },
      { academicYearId?: string; classId?: string }
    >({
      query: (params) => ({
        url: '/fees/stats',
        params,
      }),
      providesTags: ['Fee'],
    }),

    // Create invoices in bulk
    createBulkInvoices: builder.mutation<
      { success: boolean; created: number },
      {
        classId: string;
        academicYearId: string;
        dueDate: string;
      }
    >({
      query: (data) => ({
        url: '/fees/invoices/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Fee'],
    }),

    // Send payment reminder
    sendPaymentReminder: builder.mutation<{ success: boolean }, string>({
      query: (invoiceId) => ({
        url: `/fees/invoices/${invoiceId}/remind`,
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStudentInvoicesQuery,
  useGetInvoiceQuery,
  useCreatePaymentIntentMutation,
  useRecordPaymentMutation,
  useGetPaymentReceiptQuery,
  useGetInvoicePaymentsQuery,
  useGetFeeStatsQuery,
  useCreateBulkInvoicesMutation,
  useSendPaymentReminderMutation,
} = feeApi;
