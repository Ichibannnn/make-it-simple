import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const attachmentsApi = createApi({
  reducerPath: "attachmentsApi",
  tagTypes: ["Attachments"],
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
    getViewAttachment: builder.query({
      query: (id) => ({
        url: `request-concern/view/${id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      providesTags: ["Attachments"],
      //   keepUnusedDataFor: 0,
    }),

    getDownloadAttachment: builder.query({
      query: (id) => ({
        url: `request-concern/download/${id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      providesTags: ["Attachments"],
    }),
  }),
});

export const { useLazyGetViewAttachmentQuery, useLazyGetDownloadAttachmentQuery } = attachmentsApi;
