import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sedarApi = createApi({
  reducerPath: "sedarApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://rdfsedar.com/api",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Authorization", `Bearer ${process.env.REACT_APP_SEDAR_TOKEN}`);

      return headers;
    },
    paramsSerializer: (params) => {
      return queryString.stringify(params, {
        skipNull: true,
      });
    },
  }),
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => ({
        url: "/data/employees",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useLazyGetEmployeesQuery } = sedarApi;
