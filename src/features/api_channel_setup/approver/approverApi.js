import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const approverApi = createApi({
  reducerPath: "approverApi",
  tagTypes: ["Approver"],
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
    getApprover: builder.query({
      query: (params) => ({
        url: "approver/page",
        method: "GET",
        params: params,
      }),
      providesTags: ["Approver"],
    }),

    getSubUnitList: builder.query({
      query: (params) => ({
        url: "approver/subunit-approver",
        method: "GET",
        params: params,
      }),
      providesTags: ["Approver"],
    }),

    getApproverList: builder.query({
      query: ({ SubUnitId }) => ({
        url: `approver/approver-user?${SubUnitId}`,
        method: "GET",
      }),
      providesTags: ["Approver"],
    }),

    createEditApprover: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `approver/${id}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Approver"]),
    }),

    archiveApprover: builder.mutation({
      query: (body) => ({
        url: `approver/status`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Approver"]),
    }),
  }),
});

export const { useGetApproverQuery, useLazyGetSubUnitListQuery, useLazyGetApproverListQuery, useCreateEditApproverMutation, useArchiveApproverMutation } = approverApi;
