import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const departmentApi = createApi({
  reducerPath: "departmentApi",
  tagTypes: ["Department"],
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
    getDepartment: builder.query({
      query: (params) => ({
        url: "department/page",
        method: "GET",
        params: params,
      }),
      providesTags: ["Department"],
    }),
    syncDepartment: builder.mutation({
      query: (body) => ({
        url: "department",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Department"]),
    }),
  }),
});

export const { useGetDepartmentQuery, useSyncDepartmentMutation } =
  departmentApi;
