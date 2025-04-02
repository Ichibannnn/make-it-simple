import { api } from "../../index";

const tags = ["Concern"];

export const concernApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    // REQUESTOR ---------------
    getRequestorConcerns: builder.query({
      query: (params) => ({
        url: "request-concern/requestor-page?UserType=Requestor&Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getBackjobTickets: builder.query({
      query: (params) => ({
        url: "request-concern/backjob",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getTechnicians: builder.query({
      query: (params) => ({
        url: "closing-ticket/technician",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    createEditRequestorConcern: builder.mutation({
      query: (body) => ({
        url: "request-concern/add-request-concern",
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    getRequestorAttachment: builder.query({
      query: (params) => ({
        url: `request-concern/request-attachment`,
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    deleteRequestorAttachment: builder.mutation({
      query: (body) => ({
        url: `request-concern/remove-attachment`,
        method: "PUT",
        body: body,
      }),
      providesTags: tags,
    }),

    confirmConcern: builder.mutation({
      query: (body) => ({
        url: "closing-ticket/confirmation",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    cancelConcern: builder.mutation({
      query: (body) => ({
        url: "request-concern/cancel-request",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    returnConcern: builder.mutation({
      query: (body) => ({
        url: "closing-ticket/return",
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const {
  useGetRequestorConcernsQuery,
  useLazyGetBackjobTicketsQuery,
  useLazyGetTechniciansQuery,
  useCreateEditRequestorConcernMutation,
  useLazyGetRequestorAttachmentQuery,
  useGetRequestorAttachmentQuery,
  useDeleteRequestorAttachmentMutation,
  useConfirmConcernMutation,
  useCancelConcernMutation,
  useReturnConcernMutation,
} = concernApi;
