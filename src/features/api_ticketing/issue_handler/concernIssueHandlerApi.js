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
        url: "open-Ticket/page?Is_Approve=true&UserType=Issue%20Handler&Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: ["Concern Issue Handler"],
    }),

    // createEditReceiverConcern: builder.mutation({
    //   query: (body) => ({
    //     url: "request-concern/add-ticket-concern",
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //     body: body,
    //   }),
    //   invalidatesTags: (_, error) => (error ? [] : ["Concern Receiver"]),
    // }),

    // approveReceiverConcern: builder.mutation({
    //   query: (body) => ({
    //     url: "request-concern/approve-request",
    //     method: "PUT",
    //     body: body,
    //   }),
    //   invalidatesTags: (_, error) => (error ? [] : ["Concern Receiver"]),
    // }),

    // getReceiverAttachment: builder.query({
    //   query: (params) => ({
    //     url: `request-concern/request-attachment`,
    //     method: "GET",
    //     params: params,
    //   }),
    //   providesTags: ["Concern Receiver"],
    // }),
  }),
});

export const { useGetIssueHandlerConcernsQuery } = concernIssueHandlerApi;
