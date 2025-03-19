import { api } from "../index";

const tags = ["Attachments"];

export const attachmentsApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getViewAttachment: builder.query({
      query: (id) => ({
        url: `request-concern/view/${id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      providesTags: tags,
      //   keepUnusedDataFor: 0,
    }),

    getDownloadAttachment: builder.query({
      query: (id) => ({
        url: `request-concern/download/${id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      providesTags: tags,
    }),
  }),
});

export const { useLazyGetViewAttachmentQuery, useLazyGetDownloadAttachmentQuery } = attachmentsApi;
