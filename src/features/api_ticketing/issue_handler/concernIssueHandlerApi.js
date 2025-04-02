import { api } from "../../index";

const tags = ["Concern Issue Handler"];

export const concernIssueHandlerApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    // ISSUE HANDLER ---------------
    getIssueHandlerConcerns: builder.query({
      query: (params) => ({
        url: "open-Ticket/page?UserType=Issue%20Handler&Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getTicketHistory: builder.query({
      query: (id) => ({
        url: `open-Ticket/history/${id}`,
        method: "GET",
      }),
      providesTags: tags,
    }),

    getForTransferUsers: builder.query({
      query: (id) => ({
        url: `transfer-ticket/transfer-user?TicketConcernId=${id}`,
        method: "GET",
      }),
      providesTags: tags,
    }),

    holdIssueHandlerTickets: builder.mutation({
      query: (body) => ({
        url: "on-hold/create",
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    resumeIssueHandlerTickets: builder.mutation({
      query: (body) => ({
        url: "on-hold/resume",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    closeIssueHandlerTickets: builder.mutation({
      query: (body) => ({
        url: "closing-ticket",
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    cancelClosingIssueHandlerTickets: builder.mutation({
      query: (body) => ({
        url: "closing-ticket/cancel",
        method: "DELETE",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    transferIssueHandlerTickets: builder.mutation({
      query: (body) => ({
        url: "transfer-ticket/add-transfer",
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    approveTransferTicket: builder.mutation({
      query: (body) => ({
        url: "transfer-ticket/approval",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    cancelTransferTicket: builder.mutation({
      query: (body) => ({
        url: "transfer-ticket/cancel",
        method: "DELETE",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    rejectTransferTicket: builder.mutation({
      query: (body) => ({
        url: "transfer-ticket/reject",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const {
  useGetIssueHandlerConcernsQuery,
  useGetTicketHistoryQuery,
  useLazyGetForTransferUsersQuery,
  useHoldIssueHandlerTicketsMutation,
  useResumeIssueHandlerTicketsMutation,
  useCloseIssueHandlerTicketsMutation,
  useCancelClosingIssueHandlerTicketsMutation,
  useTransferIssueHandlerTicketsMutation,
  useApproveTransferTicketMutation,
  useCancelTransferTicketMutation,
  useRejectTransferTicketMutation,
} = concernIssueHandlerApi;
