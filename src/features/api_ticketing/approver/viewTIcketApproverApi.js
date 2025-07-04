import { api } from "../../index/index";

const tags = ["View Tickets Approver"];

export const viewTIcketApproverApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    // View Open Tickets
    getViewOpenTicketsApprover: builder.query({
      query: (params) => ({
        url: "open-ticket/page_subunit?UserType=Approver",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    // View Delayed Tickets
    getViewDelayedTicketsApprover: builder.query({
      query: (params) => ({
        url: "open-ticket/page_subunit?UserType=Approver&TicketStatus=Delayed",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),
  }),
});

export const { useGetViewOpenTicketsApproverQuery, useGetViewDelayedTicketsApproverQuery } = viewTIcketApproverApi;
