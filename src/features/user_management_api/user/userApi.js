import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Users"],
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
    getUsers: builder.query({
      query: (params) => ({
        url: "User/GetUser",
        method: "GET",
        params: params,
      }),
      providesTags: ["Users"],
    }),
    resetUserPassword: builder.mutation({
      query: (body) => ({
        url: "User/UserResetPassword",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Users"]),
    }),
    archiveUser: builder.mutation({
      query: (body) => ({
        url: "User/UpdateUserStatus",
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Users"]),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useResetUserPasswordMutation,
  useArchiveUserMutation,
} = userApi;