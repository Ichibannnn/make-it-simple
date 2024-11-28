import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subCategoryApi = createApi({
  reducerPath: "subCategoryApi",
  tagTypes: ["Sub Category"],
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
    getSubCategory: builder.query({
      query: (params) => ({
        url: "sub-category/page",
        method: "GET",
        params: params,
      }),
      providesTags: ["Sub Category"],
    }),

    getSubCategoryArray: builder.query({
      query: ({ CategoryId }) => {
        const categoryArray = CategoryId.map((id) => `CategoryId=${id}`).join(`&`);
        return {
          url: `request-concern/multiple-sub-category?${categoryArray}`,
          method: "GET",
        };
      },
      providesTags: ["Sub Category"],
    }),

    createEditSubCategory: builder.mutation({
      query: (body) => ({
        url: "sub-category",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Sub Category"]),
    }),

    archiveSubCategory: builder.mutation({
      query: (id) => ({
        url: `sub-category/status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Sub Category"]),
    }),
  }),
});

export const { useGetSubCategoryQuery, useLazyGetSubCategoryQuery, useLazyGetSubCategoryArrayQuery, useCreateEditSubCategoryMutation, useArchiveSubCategoryMutation } =
  subCategoryApi;
