import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const concernApi = createApi({
  reducerPath: "concernApi",
  tagTypes: ["Concern"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASEURL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Authorization", `Bearer ${sessionStorage.getItem("token")}`);

      return headers;
    },
    paramsSerializer: (params) => {
      return queryString.stringify(params, {
        skipNull: true,
      });
    },
  }),
  endpoints: (builder) => ({
    // REQUESTOR ---------------
    getRequestorConcerns: builder.query({
      query: (params) => ({
        url: "request-concern/requestor-page?UserType=Requestor&Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: ["Concern"],
    }),

    getBackjobTickets: builder.query({
      query: (params) => ({
        url: "request-concern/backjob",
        method: "GET",
        params: params,
      }),
      providesTags: ["Concern"],
    }),

    getTechnicians: builder.query({
      query: (params) => ({
        url: "closing-ticket/technician",
        method: "GET",
        params: params,
      }),
      providesTags: ["Concern"],
    }),

    createEditRequestorConcern: builder.mutation({
      query: (body) => ({
        url: "request-concern/add-request-concern",
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Concern"]),
    }),

    getRequestorAttachment: builder.query({
      query: (params) => ({
        url: `request-concern/request-attachment`,
        method: "GET",
        params: params,
      }),
      providesTags: ["Concern"],
    }),

    deleteRequestorAttachment: builder.mutation({
      query: (body) => ({
        url: `request-concern/remove-attachment`,
        method: "PUT",
        body: body,
      }),
      providesTags: ["Concern"],
    }),

    confirmConcern: builder.mutation({
      query: (body) => ({
        url: "closing-ticket/confirmation",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Concern"]),
    }),

    cancelConcern: builder.mutation({
      query: (body) => ({
        url: "request-concern/cancel-request",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Concern"]),
    }),

    returnConcern: builder.mutation({
      query: (body) => ({
        url: "closing-ticket/return",
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Concern"]),
    }),
  }),
});

export const {
  useGetRequestorConcernsQuery,
  useLazyGetBackjobTicketsQuery,
  useLazyGetTechniciansQuery,
  useCreateEditRequestorConcernMutation,
  useLazyGetRequestorAttachmentQuery,
  useGetRequestorAttachmentQuery,
  useDeleteRequestorAttachmentMutation,
  useConfirmConcernMutation,
  useCancelConcernMutation,
  useReturnConcernMutation,
} = concernApi;
