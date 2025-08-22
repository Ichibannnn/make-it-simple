import { api } from "../../index";

const tags = ["Approver Setup"];

export const approverSetupApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getApproverSetup: builder.query({
      query: (params) => ({
        url: "approveruser/GetApproverUsers",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getAllApprovers: builder.query({
      query: (params) => ({
        url: "User/GetUserByPermission?Status=true&UserType=Approver",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getAllIssueHandlers: builder.query({
      query: (params) => ({
        url: "User/GetUserByPermission?Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    createEditApproverSetup: builder.mutation({
      query: (body) => ({
        url: "approveruser/AddApproverUsers",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetApproverSetupQuery, useCreateEditApproverSetupMutation, useLazyGetAllApproversQuery, useLazyGetAllIssueHandlersQuery } = approverSetupApi;
