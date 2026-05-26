import { api } from "../../index";

const tags = ["Checklist Management"];

export const checklistManagementApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getChecklists: builder.query({
      query: (params) => ({
        url: "pms-checklist-management",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    addEditChecklist: builder.mutation({
      query: (body) => ({
        url: "pms-checklist-management",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    // archiveSites: builder.mutation({
    //   query: (id) => ({
    //     url: `pms-sites/${id}`,
    //     method: "PATCH",
    //   }),
    //   invalidatesTags: (_, error) => (error ? [] : tags),
    // }),
  }),
});

export const { useGetChecklistsQuery, useAddEditChecklistMutation } = checklistManagementApi;
