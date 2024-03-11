import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const businessUnitApi = createApi({
  reducerPath: "businessUnitApi",
  tagTypes: ["Business Unit"],
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
    getBusinessUnit: builder.query({
      query: (params) => ({
        url: "business-unit/page",
        method: "GET",
        params: params,
      }),
      providesTags: ["Business Unit"],
    }),
    syncBusinessUnit: builder.mutation({
      query: (body) => ({
        url: "business-unit",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Business Unit"]),
    }),
  }),
});

export const {
  useGetBusinessUnitQuery,
  useSyncBusinessUnitMutation,
  useLazyGetBusinessUnitQuery,
} = businessUnitApi;
