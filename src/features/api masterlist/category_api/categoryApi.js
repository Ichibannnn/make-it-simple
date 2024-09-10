import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  tagTypes: ["Category"],
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
    getCategory: builder.query({
      query: (params) => ({
        url: "category/page",
        method: "GET",
        params: params,
      }),
      providesTags: ["Category"],
    }),

    createEditCategory: builder.mutation({
      query: (body) => ({
        url: "category",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Category"]),
    }),

    archiveCategory: builder.mutation({
      query: (id) => ({
        url: `category/status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Category"]),
    }),
  }),
});

export const { useGetCategoryQuery, useLazyGetCategoryQuery, useCreateEditCategoryMutation, useArchiveCategoryMutation } = categoryApi;
