import { api } from "../../index";

const tags = ["Department"];

export const departmentApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getDepartment: builder.query({
      query: (params) => ({
        url: "department/page?Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),
    syncDepartment: builder.mutation({
      query: (body) => ({
        url: "department",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetDepartmentQuery, useLazyGetDepartmentQuery, useSyncDepartmentMutation } = departmentApi;
