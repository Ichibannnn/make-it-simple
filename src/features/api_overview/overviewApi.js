import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const overviewApi = createApi({
  reducerPath: "overviewApi",
  tagTypes: ["Overview"],
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
    getOverview: builder.query({
      query: (params) => ({
        url: "overview/analytic",
        method: "GET",
        params: params,
      }),
      providesTags: ["Overview"],
    }),
  }),
});

export const { useGetOverviewQuery } = overviewApi;
