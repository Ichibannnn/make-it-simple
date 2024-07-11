import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const concernIssueHandlerApi = createApi({
  reducerPath: "concernIssueHandlerApi",
  tagTypes: ["Concern Issue Handler"],
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
    // ISSUE HANDLER ---------------
    getIssueHandlerConcerns: builder.query({
      query: (params) => ({
        url: "open-Ticket/page?UserType=Issue%20Handler&Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: ["Concern Issue Handler"],
    }),

    getTicketHistory: builder.query({
      query: (id) => ({
        url: `open-Ticket/history/${id}`,
        method: "GET",
      }),
      providesTags: ["Concern Issue Handler"],
    }),

    closeIssueHandlerTickets: builder.mutation({
      query: (body) => ({
        url: "closing-ticket",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Concern Issue Handler"]),
    }),
  }),
});

export const { useGetIssueHandlerConcernsQuery, useGetTicketHistoryQuery, useCloseIssueHandlerTicketsMutation } = concernIssueHandlerApi;
