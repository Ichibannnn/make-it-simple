import { api } from "../../index";

const tags = ["PMS Type"];

export const pmsTypeApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getPmsType: builder.query({
      query: (params) => ({
        url: "pms-types",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getActivePmsType: builder.query({
      query: (params) => ({
        url: "pms-types?Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    addEditPmsType: builder.mutation({
      query: (body) => ({
        url: "pms-types",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archivePmsType: builder.mutation({
      query: (id) => ({
        url: `pms-types/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetPmsTypeQuery, useLazyGetActivePmsTypeQuery, useAddEditPmsTypeMutation, useArchivePmsTypeMutation } = pmsTypeApi;
