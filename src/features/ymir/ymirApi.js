import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ymirApi = createApi({
  reducerPath: "ymirApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.10.17:8001/api",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set(
        "Authorization",
        `Bearer ${process.env.REACT_APP_YMIR_TOKEN}`
      );

      return headers;
    },
    paramsSerializer: (params) => {
      return queryString.stringify(params, {
        skipNull: true,
      });
    },
  }),
  endpoints: (builder) => ({
    getCompanies: builder.query({
      query: () => ({
        url: "/companies?pagination=none&per_page=100&page=1&status=active",
        method: "GET",
      }),
      transformResponse: (response) => response.result,
    }),
    getBusinessUnits: builder.query({
      query: () => ({
        url: "/business-units?pagination=none&per_page=100&page=1&status=active",
        method: "GET",
      }),
      transformResponse: (response) => response.result,
    }),
    getDepartments: builder.query({
      query: () => ({
        url: "/departments?pagination=none&per_page=100&page=1&status=active",
        method: "GET",
      }),
      transformResponse: (response) => response.result,
    }),
    getUnits: builder.query({
      query: () => ({
        url: "/units_department?pagination=none&per_page=100&page=1&status=active",
        method: "GET",
      }),
      transformResponse: (response) => response.result,
    }),
    getSubUnits: builder.query({
      query: () => ({
        url: "/sub-units?pagination=none&per_page=100&page=1&status=active",
        method: "GET",
      }),
      transformResponse: (response) => response.result,
    }),
    getLocations: builder.query({
      query: () => ({
        url: "/locations?pagination=none&per_page=100&page=1&status=active",
        method: "GET",
      }),
      transformResponse: (response) => response.result,
    }),
  }),
});

export const {
  useLazyGetCompaniesQuery,
  useLazyGetBusinessUnitsQuery,
  useLazyGetDepartmentsQuery,
  useLazyGetUnitsQuery,
  useLazyGetSubUnitsQuery,
  useLazyGetLocationsQuery,
} = ymirApi;
