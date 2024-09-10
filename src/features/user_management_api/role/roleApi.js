import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roleApi = createApi({
  reducerPath: "roleApi",
  tagTypes: ["Roles"],
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
    getRoles: builder.query({
      query: (params) => ({
        url: "UserRole/GetUserRole",
        method: "GET",
        params: params,
      }),
      providesTags: ["Roles"],
    }),
    createRole: builder.mutation({
      query: (body) => ({
        url: "UserRole/AddNewUserRole",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Roles"]),
    }),

    updateRoleName: builder.mutation({
      query: (body) => ({
        url: "UserRole/UpdateUserRole",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Roles"]),
    }),

    updateRolePermission: builder.mutation({
      query: (body) => ({
        url: "UserRole/UntagAndTagUserRolePermission",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Roles"]),
    }),

    archiveRole: builder.mutation({
      query: (body) => ({
        url: "UserRole/UpdateUserRoleStatus",
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Roles"]),
    }),
  }),
});

export const { useLazyGetRolesQuery, useGetRolesQuery, useCreateRoleMutation, useUpdateRoleNameMutation, useUpdateRolePermissionMutation, useArchiveRoleMutation } = roleApi;
