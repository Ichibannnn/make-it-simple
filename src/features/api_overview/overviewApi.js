import { api } from "../index";

const tags = ["Overview"];

export const overviewApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query({
      query: (params) => ({
        url: "overview/analytic",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),
  }),
});

export const { useGetOverviewQuery } = overviewApi;
