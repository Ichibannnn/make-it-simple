import { api } from "../../index";

const tags = ["User Type"];

export const buildingsApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getUserTypes: builder.query({
      query: (params) => ({
        url: "userType",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getActiveUserTypes: builder.query({
      query: (params) => ({
        url: "userType?Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    addEditUserType: builder.mutation({
      query: (body) => ({
        url: "userType",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archiveUserType: builder.mutation({
      query: (id) => ({
        url: `userType?Id=${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const {
  useGetUserTypesQuery,
  useLazyGetActiveUserTypesQuery,
  useAddEditUserTypeMutation,
  useArchiveUserTypeMutation,
} = buildingsApi;
