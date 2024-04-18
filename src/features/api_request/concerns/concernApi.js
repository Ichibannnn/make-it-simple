import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const concernApi = createApi({
  reducerPath: "concernApi",
  tagTypes: ["Concern"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASEURL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`);

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
        url: "request-concern/requestor-page?Requestor=Requestor&Status=true",
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
  }),
});

export const {
  useGetRequestorConcernsQuery,
  useCreateEditRequestorConcernMutation,
  useLazyGetRequestorAttachmentQuery,
  useGetRequestorAttachmentQuery,
  useDeleteRequestorAttachmentMutation,
} = concernApi;
