import { api } from "../../index";

const tags = ["Sites"];

export const sitesApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getSites: builder.query({
      query: (params) => ({
        url: "pms-sites",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    addEditSites: builder.mutation({
      query: (body) => ({
        url: "pms-sites",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archiveSites: builder.mutation({
      query: (id) => ({
        url: `pms-sites/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetSitesQuery, useAddEditSitesMutation, useArchiveSitesMutation } = sitesApi;
