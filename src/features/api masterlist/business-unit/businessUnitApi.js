import { api } from "../../index";

const tags = ["Business Unit"];

export const businessUnitApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getBusinessUnit: builder.query({
      query: (params) => ({
        url: "GetOneCharging/page_business_unit?Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),
  }),
});

export const { useGetBusinessUnitQuery, useLazyGetBusinessUnitQuery } = businessUnitApi;
