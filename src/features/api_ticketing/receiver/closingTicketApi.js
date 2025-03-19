import { api } from "../../index";

const tags = ["Closing Ticket"];

export const closingTicketApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    // Receiver ---------------
    getClosingTickets: builder.query({
      query: (params) => ({
        url: "closing-ticket/page?UserType=Receiver&IsClosed=false&IsReject=false",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    closeTicket: builder.mutation({
      query: (body) => ({
        url: "closing-ticket/approval",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    rejectTicket: builder.mutation({
      query: (body) => ({
        url: "closing-ticket/reject",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetClosingTicketsQuery, useCloseTicketMutation, useRejectTicketMutation } = closingTicketApi;
