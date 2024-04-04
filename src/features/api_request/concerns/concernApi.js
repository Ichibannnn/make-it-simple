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
        url: "request-concern/requestor-page?Requestor=Requestor",
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

    // getReceiverList: builder.query({
    //   query: (params) => ({
    //     url: "receiver/receiver-list",
    //     method: "GET",
    //     params: params,
    //   }),
    //   providesTags: ["Receiver"],
    // }),

    // getReceiverBusinessList: builder.query({
    //   query: (params) => ({
    //     url: "receiver/receiver-business-unit",
    //     method: "GET",
    //     params: params,
    //   }),
    //   providesTags: ["Receiver"],
    // }),

    // createEditReceiver: builder.mutation({
    //   query: (body) => ({
    //     url: "receiver",
    //     method: "POST",
    //     body: body,
    //   }),
    //   invalidatesTags: (_, error) => (error ? [] : ["Receiver"]),
    // }),

    // archiveReceiver: builder.mutation({
    //   query: (UserId) => ({
    //     url: `receiver/status/${UserId}`,
    //     method: "PUT",
    //   }),
    //   invalidatesTags: (_, error) => (error ? [] : ["Receiver"]),
    // }),
  }),
});

export const {
  useGetRequestorConcernsQuery,
  useCreateEditRequestorConcernMutation,
} = concernApi;
