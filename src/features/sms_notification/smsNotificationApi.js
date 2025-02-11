import queryString from "query-string";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const smsNotificationApi = createApi({
  reducerPath: "smsNotificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.2.77",
  }),

  endpoints: (builder) => ({
    sendSmsNotification: builder.mutation({
      query: (message) => ({
        url: "/api/post_message",
        method: "POST",
        body: message,
      }),
    }),
  }),
});

export const { useSendSmsNotificationMutation } = smsNotificationApi;
