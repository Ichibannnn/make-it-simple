import { api } from "../../index";

const tags = ["Sub Unit"];

export const subUnitApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getSubUnit: builder.query({
      query: (params) => ({
        url: "sub-unit/page",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    syncSubUnit: builder.mutation({
      query: (body) => ({
        url: "sub-unit",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    createEditSubUnit: builder.mutation({
      query: (body) => ({
        url: "sub-unit/upsert-subunit",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archiveSubUnit: builder.mutation({
      query: (id) => ({
        url: `sub-unit/status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetSubUnitQuery, useLazyGetSubUnitQuery, useSyncSubUnitMutation, useCreateEditSubUnitMutation, useArchiveSubUnitMutation } = subUnitApi;
