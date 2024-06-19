import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const closingTicketApi = createApi({
  reducerPath: "closingTicketApi",
  tagTypes: ["Closing Ticket"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASEURL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`);

      return headers;
    },
    paramsSerializer: (params) => {
      return queryString.stringify(params, {
        skipNull: true,
      });
    },
  }),
  endpoints: (builder) => ({
    // Approver ---------------
    getClosingTickets: builder.query({
      query: (params) => ({
        url: "closing-ticket/page?UserType=Approver&IsClosed=false&IsReject=false",
        method: "GET",
        params: params,
      }),
      providesTags: ["Closing Ticket"],
    }),

    closeTicket: builder.mutation({
      query: (body) => ({
        url: "closing-ticket/approval",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Closing Ticket"]),
    }),

    rejectTicket: builder.mutation({
      query: (body) => ({
        url: "closing-ticket/reject",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Closing Ticket"]),
    }),
  }),
});

export const { useGetClosingTicketsQuery, useCloseTicketMutation, useRejectTicketMutation } = closingTicketApi;
