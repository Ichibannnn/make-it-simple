import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const companyApi = createApi({
  reducerPath: "companyApi",
  tagTypes: ["Company"],
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
    getCompany: builder.query({
      query: (params) => ({
        url: "company/page",
        method: "GET",
        params: params,
      }),
      providesTags: ["Company"],
    }),
    syncCompany: builder.mutation({
      query: (body) => ({
        url: "company",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Company"]),
    }),
  }),
});

export const {
  useGetCompanyQuery,
  useSyncCompanyMutation,
  useLazyGetCompanyQuery,
} = companyApi;
