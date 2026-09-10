import { api } from "../../index";

const tags = ["Buildings"];

export const buildingsApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getBuildings: builder.query({
      query: (params) => ({
        url: "building",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getActiveBuildings: builder.query({
      query: (params) => ({
        url: "building?Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    addEditBuilding: builder.mutation({
      query: (body) => ({
        url: "building",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archiveBuilding: builder.mutation({
      query: (id) => ({
        url: `building?Id=${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const {
  useGetBuildingsQuery,
  useLazyGetActiveBuildingsQuery,
  useAddEditBuildingMutation,
  useArchiveBuildingMutation,
} = buildingsApi;
