import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ymirApi = createApi({
  reducerPath: "ymirApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://rdfymir.com/backend/public/api",
    // baseUrl: "http://10.10.10.17:8000/api",
    // baseUrl: "http://10.10.13.6:8080/api",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Token", `Bearer ${process.env.REACT_APP_YMIR_TOKEN}`);
      // headers.set("Authorization", `Bearer ${process.env.REACT_APP_YMIR_TOKEN}`);

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
      transformResponse: (response) => response,
    }),
    getBusinessUnits: builder.query({
      query: () => ({
        url: "/business-units?pagination=none&per_page=100&page=1&status=active",
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),
    getDepartments: builder.query({
      query: () => ({
        url: "/departments?pagination=none&per_page=100&page=1&status=active",
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),
    getUnits: builder.query({
      query: () => ({
        url: "/units_department?pagination=none&per_page=100&page=1&status=active",
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),
    getSubUnits: builder.query({
      query: () => ({
        url: "/sub_units?pagination=none&per_page=100&page=1&status=active",
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),
    getLocations: builder.query({
      query: () => ({
        url: "/locations?pagination=none&per_page=100&page=1&status=active",
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),
  }),
});

export const { useLazyGetCompaniesQuery, useLazyGetBusinessUnitsQuery, useLazyGetDepartmentsQuery, useLazyGetUnitsQuery, useLazyGetSubUnitsQuery, useLazyGetLocationsQuery } =
  ymirApi;
