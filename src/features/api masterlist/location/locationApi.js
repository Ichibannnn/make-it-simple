import { api } from "../../index";

const tags = ["Location"];

export const locationApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getLocation: builder.query({
      query: (params) => ({
        url: "location/page?Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),
    getLocationWithPagination: builder.query({
      query: (params) => ({
        url: "location/page?Status=true&PageNumber=1&PageSize=10000",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),
    syncLocation: builder.mutation({
      query: (body) => ({
        url: "location",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetLocationQuery, useSyncLocationMutation, useLazyGetLocationQuery, useLazyGetLocationWithPaginationQuery } = locationApi;
