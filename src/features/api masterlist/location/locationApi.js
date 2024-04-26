import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const locationApi = createApi({
  reducerPath: "locationApi",
  tagTypes: ["Location"],
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
    getLocation: builder.query({
      query: (params) => ({
        url: "location/page?Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: ["Location"],
    }),
    syncLocation: builder.mutation({
      query: (body) => ({
        url: "location",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Location"]),
    }),
  }),
});

export const {
  useGetLocationQuery,
  useSyncLocationMutation,
  useLazyGetLocationQuery,
} = locationApi;
