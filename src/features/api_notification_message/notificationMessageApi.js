import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationMessageApi = createApi({
  reducerPath: "notificationMessageApi",
  tagTypes: ["Notification Message"],
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
    getNotificationMessage: builder.query({
      query: (params) => ({
        url: "ticketing-notification/ticket-transaction",
        method: "GET",
        params: params,
      }),
      providesTags: ["Notification Message"],
    }),

    getNotificationNav: builder.mutation({
      query: (body) => ({
        url: "ticketing-notification/clicked-transaction",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Notification Message"]),
    }),
  }),
});

export const { useGetNotificationMessageQuery, useGetNotificationNavMutation } = notificationMessageApi;
