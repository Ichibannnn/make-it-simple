import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const approverApi = createApi({
  reducerPath: "approverApi",
  tagTypes: ["Approver"],
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
    getApprover: builder.query({
      query: (params) => ({
        url: "approver/page",
        method: "GET",
        params: params,
      }),
      providesTags: ["Approver"],
    }),

    // getReceiverList: builder.query({
    //   query: (params) => ({
    //     url: "receiver/receiver-list",
    //     method: "GET",
    //     params: params,
    //   }),
    //   providesTags: ["Receiver"],
    // }),

    // getReceiverBusinessList: builder.query({
    //   query: (params) => ({
    //     url: "receiver/receiver-business-unit",
    //     method: "GET",
    //     params: params,
    //   }),
    //   providesTags: ["Receiver"],
    // }),

    // createEditReceiver: builder.mutation({
    //   query: (body) => ({
    //     url: "receiver",
    //     method: "POST",
    //     body: body,
    //   }),
    //   invalidatesTags: (_, error) => (error ? [] : ["Receiver"]),
    // }),

    // archiveReceiver: builder.mutation({
    //   query: (UserId) => ({
    //     url: `receiver/status/${UserId}`,
    //     method: "PUT",
    //   }),
    //   invalidatesTags: (_, error) => (error ? [] : ["Receiver"]),
    // }),
  }),
});

export const { useGetApproverQuery } = approverApi;
