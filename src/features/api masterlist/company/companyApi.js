import { api } from "../../index";

const tags = ["Company"];

export const companyApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getCompany: builder.query({
      query: (params) => ({
        url: "company/page?Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),
    syncCompany: builder.mutation({
      query: (body) => ({
        url: "company",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetCompanyQuery, useSyncCompanyMutation, useLazyGetCompanyQuery } = companyApi;
