import { api } from "../../index";

const tags = ["Company"];

export const companyApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getCompany: builder.query({
      query: (params) => ({
        url: "GetOneCharging/page_company?Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),
  }),
});

export const { useGetCompanyQuery, useLazyGetCompanyQuery } = companyApi;
