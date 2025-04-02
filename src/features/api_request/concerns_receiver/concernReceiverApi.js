import { api } from "../../index";

const tags = ["Concern Receiver"];

export const concernReceiverApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    // RECEIVER ---------------
    getReceiverConcerns: builder.query({
      query: (params) => ({
        url: "request-concern/requestor-page?UserType=Receiver&Status=true&is_Reject=false",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    createEditReceiverConcern: builder.mutation({
      query: (body) => ({
        url: "request-concern/add-ticket-concern",
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    approveReceiverConcern: builder.mutation({
      query: (body) => ({
        url: "request-concern/approval-request-receiver",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    getReceiverAttachment: builder.query({
      query: (params) => ({
        url: `request-concern/request-attachment`,
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),
  }),
});

export const { useGetReceiverConcernsQuery, useCreateEditReceiverConcernMutation, useLazyGetReceiverAttachmentQuery, useApproveReceiverConcernMutation } = concernReceiverApi;
