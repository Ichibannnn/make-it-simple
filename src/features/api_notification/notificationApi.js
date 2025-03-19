import { api } from "../index";

const tags = ["Notification"];

export const notificationApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: (params) => ({
        url: "ticketing-notification/ticket-notif",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),
  }),
});

export const { useGetNotificationQuery } = notificationApi;
