import { api } from "../../index";

const tags = ["PMS Reminder"];

export const pmsReminderParamsApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getPmsReminder: builder.query({
      query: (params) => ({
        url: "pms/reminder",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),
  }),
});

export const { useGetPmsReminderQuery } = pmsReminderParamsApi;
