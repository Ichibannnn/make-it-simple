import { api } from "../../index";

const tags = ["Category"];

export const categoryApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getCategory: builder.query({
      query: (params) => ({
        url: "category/page",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    createEditCategory: builder.mutation({
      query: (body) => ({
        url: "category",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archiveCategory: builder.mutation({
      query: (id) => ({
        url: `category/status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetCategoryQuery, useLazyGetCategoryQuery, useCreateEditCategoryMutation, useArchiveCategoryMutation } = categoryApi;
