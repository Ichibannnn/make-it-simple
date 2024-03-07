import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const unitApi = createApi({
  reducerPath: "unitApi",
  tagTypes: ["Unit"],
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
    getUnit: builder.query({
      query: (params) => ({
        url: "unit/page",
        method: "GET",
        params: params,
      }),
      providesTags: ["Unit"],
    }),
    syncUnit: builder.mutation({
      query: (body) => ({
        url: "unit",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Unit"]),
    }),
  }),
});

export const { useGetUnitQuery, useSyncUnitMutation } = unitApi;
