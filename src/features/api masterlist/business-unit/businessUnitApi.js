import { api } from "../../index";

const tags = ["Business Unit"];

export const businessUnitApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getBusinessUnit: builder.query({
      query: (params) => ({
        url: "business-unit/page?Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    syncBusinessUnit: builder.mutation({
      query: (body) => ({
        url: "business-unit",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetBusinessUnitQuery, useSyncBusinessUnitMutation, useLazyGetBusinessUnitQuery } = businessUnitApi;
