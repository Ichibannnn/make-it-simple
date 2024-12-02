import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  tagTypes: ["Reports"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASEURL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Authorization", `Bearer ${sessionStorage.getItem("token")}`);

      return headers;
    },
    paramsSerializer: (params) => {
      return queryString.stringify(params, {
        skipNull: true,
      });
    },
  }),

  endpoints: (builder) => ({
    getAllTickets: builder.query({
      query: (params) => ({
        url: "reports/all-tickets",
        method: "GET",
        params: params,
      }),
      providesTags: ["Reports"],
    }),

    getOpenTickets: builder.query({
      query: (params) => ({
        url: "reports/open",
        method: "GET",
        params: params,
      }),
      providesTags: ["Reports"],
    }),

    getClosedTickets: builder.query({
      query: (params) => ({
        url: "reports/closing",
        method: "GET",
        params: params,
      }),
      providesTags: ["Reports"],
    }),

    getTransferredTickets: builder.query({
      query: (params) => ({
        url: "reports/transfer",
        method: "GET",
        params: params,
      }),
      providesTags: ["Reports"],
    }),

    getOnHoldTickets: builder.query({
      query: (params) => ({
        url: "reports/on-hold",
        method: "GET",
        params: params,
      }),
      providesTags: ["Reports"],
    }),

    getDownloadOpenTickets: builder.query({
      query: (params) => ({
        url: `export/open`,
        method: "GET",
        params: params,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: ["Reports"],
    }),

    getDownloadClosedTickets: builder.query({
      query: (params) => ({
        url: `export/closing`,
        method: "GET",
        params: params,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: ["Reports"],
    }),

    getDownloadTransferredTickets: builder.query({
      query: (params) => ({
        url: `export/transfer`,
        method: "GET",
        params: params,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: ["Reports"],
    }),

    getDownloadOnHoldTickets: builder.query({
      query: (params) => ({
        url: `export/on-hold`,
        method: "GET",
        params: params,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: ["Reports"],
    }),
  }),
});

export const {
  useGetAllTicketsQuery,
  useGetOpenTicketsQuery,
  useGetClosedTicketsQuery,
  useGetTransferredTicketsQuery,
  useGetOnHoldTicketsQuery,

  useLazyGetAllTicketsQuery,
  useLazyGetDownloadOpenTicketsQuery,
  useLazyGetDownloadClosedTicketsQuery,
  useLazyGetDownloadTransferredTicketsQuery,
  useLazyGetDownloadOnHoldTicketsQuery,
} = reportsApi;
