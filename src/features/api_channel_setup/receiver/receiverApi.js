import { api } from "../../index";

const tags = ["Receiver"];

export const receiverApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getReceiver: builder.query({
      query: (params) => ({
        url: "receiver/page",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getReceiverList: builder.query({
      query: (params) => ({
        url: "receiver/receiver-list",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getReceiverBusinessList: builder.query({
      query: (params) => ({
        url: "receiver/receiver-business-unit",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    createEditReceiver: builder.mutation({
      query: (body) => ({
        url: "receiver",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archiveReceiver: builder.mutation({
      query: (UserId) => ({
        url: `receiver/status/${UserId}`,
        method: "PUT",
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetReceiverQuery, useLazyGetReceiverListQuery, useLazyGetReceiverBusinessListQuery, useCreateEditReceiverMutation, useArchiveReceiverMutation } = receiverApi;
