import { api } from "../../index";

const tags = ["Category Concern"];

export const categoryConcernApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getCategoryConcern: builder.query({
      query: (params) => ({
        url: "categoryConcern/page",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    createEditCategoryConcern: builder.mutation({
      query: (body) => ({
        url: "categoryConcern",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archiveCategoryConcern: builder.mutation({
      query: (id) => ({
        url: `categoryConcern/status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetCategoryConcernQuery, useLazyGetCategoryConcernQuery, useCreateEditCategoryConcernMutation, useArchiveCategoryConcernMutation } = categoryConcernApi;
