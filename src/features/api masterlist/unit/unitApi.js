import { api } from "../../index";

const tags = ["Unit"];

export const unitApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getUnit: builder.query({
      query: (params) => ({
        url: "unit/page?Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    syncUnit: builder.mutation({
      query: (body) => ({
        url: "unit",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetUnitQuery, useSyncUnitMutation, useLazyGetUnitQuery } = unitApi;
