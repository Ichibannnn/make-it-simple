import { api } from "../index";

const tags = ["Notification Message"];

export const notificationMessageApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getNotificationMessage: builder.query({
      query: (params) => ({
        url: "ticketing-notification/ticket-transaction",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getNotificationNav: builder.mutation({
      query: (body) => ({
        url: "ticketing-notification/clicked-transaction",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetNotificationMessageQuery, useGetNotificationNavMutation } = notificationMessageApi;
