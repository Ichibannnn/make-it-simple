import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const channelApi = createApi({
  reducerPath: "channelApi",
  tagTypes: ["Receiver"],
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
    getChannels: builder.query({
      query: (params) => ({
        url: "channel/page",
        method: "GET",
        params: params,
      }),
      providesTags: ["Channel"],
    }),

    createChannel: builder.mutation({
      query: (body) => ({
        url: "channel",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Channel"]),
    }),

    createChannelValidation: builder.mutation({
      query: (body) => ({
        url: "channel/validation",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Channel"]),
    }),

    updateChannel: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `channel/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Channel"]),
    }),

    archiveChannel: builder.mutation({
      query: (id) => ({
        url: `channel/status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Channel"]),
    }),

    getChannelMembers: builder.query({
      query: ({ DepartmentId }) => {
        const departmentArray = DepartmentId.map(
          (id) => `DepartmentId=${id}`
        ).join(`&`);
        return {
          url: `channel/member-list?${departmentArray}`,
          method: "GET",
        };
      },
      providesTags: ["Channel"],
    }),

    createChannelMember: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `channel/member/${id}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Channel"]),
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useLazyGetChannelsQuery,
  useCreateChannelMutation,
  useCreateChannelValidationMutation,
  useUpdateChannelMutation,
  useArchiveChannelMutation,
  useLazyGetChannelMembersQuery,
  useCreateChannelMemberMutation,
} = channelApi;
