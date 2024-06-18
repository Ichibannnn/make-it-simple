import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ticketApprovalApi = createApi({
  reducerPath: "ticketApprovalApi",
  tagTypes: ["Ticket Approval"],
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
    getTicketApproval: builder.query({
      query: (params) => ({
        url: "closing-ticket/page?UserType=Approver&IsClosed=false&IsReject=false",
        method: "GET",
        params: params,
      }),
      providesTags: ["Ticket Approval"],
    }),

    approveTicket: builder.mutation({
      query: (body) => ({
        url: "closing-ticket/approval",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Ticket Approval"]),
    }),
  }),
});

export const { useGetTicketApprovalQuery, useApproveTicketMutation } = ticketApprovalApi;
