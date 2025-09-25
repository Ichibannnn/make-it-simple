import { api } from "../index";

const tags = ["Reports"];

export const reportsApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getAllTickets: builder.query({
      query: (params) => ({
        url: "reports/all-tickets",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getOpenTickets: builder.query({
      query: (params) => ({
        url: "reports/open",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getClosedTickets: builder.query({
      query: (params) => ({
        url: "reports/closing",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getTransferredTickets: builder.query({
      query: (params) => ({
        url: "reports/transfer",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getOnHoldTickets: builder.query({
      query: (params) => ({
        url: "reports/on-hold",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getSlaTickets: builder.query({
      query: (params) => ({
        url: "reports/sla-report",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getMisClosedTickets: builder.query({
      query: (params) => ({
        url: "reports/finance-report",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getSadSlaTickets: builder.query({
      query: (params) => ({
        url: "reports/sad-sla-report",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getDownloadAllTickets: builder.query({
      query: (params) => ({
        url: `export/all-ticket-export`,
        method: "GET",
        params: params,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: tags,
    }),

    getDownloadOpenTickets: builder.query({
      query: (params) => ({
        url: `export/open`,
        method: "GET",
        params: params,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: tags,
    }),

    getDownloadClosedTickets: builder.query({
      query: (params) => ({
        url: `export/closing`,
        method: "GET",
        params: params,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: tags,
    }),

    getDownloadTransferredTickets: builder.query({
      query: (params) => ({
        url: `export/transfer`,
        method: "GET",
        params: params,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: tags,
    }),

    getDownloadOnHoldTickets: builder.query({
      query: (params) => ({
        url: `export/on-hold`,
        method: "GET",
        params: params,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: tags,
    }),

    getDownloadSlaTickets: builder.query({
      query: (params) => ({
        url: `export/sla-export`,
        method: "GET",
        params: params,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: tags,
    }),

    getDownloadMisClosedTickets: builder.query({
      query: (params) => ({
        url: `export/finance-report-export`,
        method: "GET",
        params: params,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: tags,
    }),

    getDownloadSadSlaTickets: builder.query({
      query: (params) => ({
        url: `export/sad-sla-export`,
        method: "GET",
        params: params,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: tags,
    }),
  }),
});

export const {
  useGetAllTicketsQuery,
  useGetOpenTicketsQuery,
  useGetClosedTicketsQuery,
  useGetTransferredTicketsQuery,
  useGetOnHoldTicketsQuery,
  useGetSlaTicketsQuery,
  useGetMisClosedTicketsQuery,
  useGetSadSlaTicketsQuery,

  useLazyGetDownloadAllTicketsQuery,
  useLazyGetDownloadOpenTicketsQuery,
  useLazyGetDownloadClosedTicketsQuery,
  useLazyGetDownloadTransferredTicketsQuery,
  useLazyGetDownloadOnHoldTicketsQuery,
  useLazyGetDownloadSlaTicketsQuery,
  useLazyGetDownloadMisClosedTicketsQuery,
  useLazyGetDownloadSadSlaTicketsQuery,
} = reportsApi;
