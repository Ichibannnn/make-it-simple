import { api } from "../../index";

const tags = ["Ticket Approval"];

export const ticketApprovalApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    // Approver Target Date Approval ---------------
    getTargetApproval: builder.query({
      query: (params) => ({
        url: "open-ticket/date?UserType=Approver&IsDateApproved=false&IsReject=false",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    approveTarget: builder.mutation({
      query: (body) => ({
        url: "open-ticket/approval",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    disapproveTarget: builder.mutation({
      query: (body) => ({
        url: "open-ticket/reject",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    // Approver Ticket Approval ---------------
    getTicketApproval: builder.query({
      query: (params) => ({
        url: "closing-ticket/page?UserType=Approver&IsClosed=false&IsReject=false",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    approveTicket: builder.mutation({
      query: (body) => ({
        url: "closing-ticket/approval",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    disapproveTicket: builder.mutation({
      query: (body) => ({
        url: "closing-ticket/reject",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    // Approver Transfer Approval
    getTransferApproval: builder.query({
      query: (params) => ({
        url: "transfer-ticket/page?UserType=Approver&IsTransfer=false&IsReject=false",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    approveTransfer: builder.mutation({
      query: (body) => ({
        url: "transfer-ticket/approval",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    rejectTransfer: builder.mutation({
      query: (body) => ({
        url: "transfer-ticket/reject",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    // Approver OnHold Approval
    getOnHoldApproval: builder.query({
      query: (params) => ({
        url: "on-hold/page?UserType=Approver&IsHold=false&IsReject=false",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    approveOnHold: builder.mutation({
      query: (body) => ({
        url: "on-hold/approval",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    rejectOnHold: builder.mutation({
      query: (body) => ({
        url: "on-hold/reject",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const {
  useGetTargetApprovalQuery,
  useApproveTargetMutation,
  useDisapproveTargetMutation,
  useGetTicketApprovalQuery,
  useApproveTicketMutation,
  useDisapproveTicketMutation,
  useGetTransferApprovalQuery,
  useApproveTransferMutation,
  useRejectTransferMutation,
  useGetOnHoldApprovalQuery,
  useApproveOnHoldMutation,
  useRejectOnHoldMutation,
} = ticketApprovalApi;
