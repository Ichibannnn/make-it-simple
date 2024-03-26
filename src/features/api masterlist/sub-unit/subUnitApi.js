import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subUnitApi = createApi({
  reducerPath: "subUnitApi",
  tagTypes: ["Sub Unit"],
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
    getSubUnit: builder.query({
      query: (params) => ({
        url: "sub-unit/page",
        method: "GET",
        params: params,
      }),
      providesTags: ["Sub Unit"],
    }),

    syncSubUnit: builder.mutation({
      query: (body) => ({
        url: "sub-unit",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Sub Unit"]),
    }),

    createEditSubUnit: builder.mutation({
      query: (body) => ({
        url: "sub-unit/upsert-subunit",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Sub Unit"]),
    }),

    archiveSubUnit: builder.mutation({
      query: (id) => ({
        url: `sub-unit/status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Sub Unit"]),
    }),
  }),
});

export const {
  useGetSubUnitQuery,
  useLazyGetSubUnitQuery,
  useSyncSubUnitMutation,
  useCreateEditSubUnitMutation,
  useArchiveSubUnitMutation,
} = subUnitApi;
