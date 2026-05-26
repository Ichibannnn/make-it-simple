import { api } from "../../index";

const tags = ["PMS Calendar"];

export const pmsCalendarParams = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getPmsCalendar: builder.query({
      query: (params) => ({
        url: "pms",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    reschedulePms: builder.mutation({
      query: (body) => ({
        url: "pms",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    // archivePmsType: builder.mutation({
    //   query: (id) => ({
    //     url: `pms-types/${id}`,
    //     method: "PATCH",
    //   }),
    //   invalidatesTags: (_, error) => (error ? [] : tags),
    // }),
  }),
});

export const { useGetPmsCalendarQuery, useReschedulePmsMutation } = pmsCalendarParams;
