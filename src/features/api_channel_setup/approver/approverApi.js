import { api } from "../../index";

const tags = ["Approver"];

export const approverApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getApprover: builder.query({
      query: (params) => ({
        url: "approver/page",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getSubUnitList: builder.query({
      query: (params) => ({
        url: "approver/subunit-approver",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getApproverList: builder.query({
      query: ({ SubUnitId }) => ({
        url: `approver/approver-user?${SubUnitId}`,
        method: "GET",
      }),
      providesTags: tags,
    }),

    createEditApprover: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `approver/${id}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archiveApprover: builder.mutation({
      query: (body) => ({
        url: `approver/status`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetApproverQuery, useLazyGetSubUnitListQuery, useLazyGetApproverListQuery, useCreateEditApproverMutation, useArchiveApproverMutation } = approverApi;
