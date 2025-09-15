import { api } from "../../index";

const tags = ["Service Provider"];

export const serviceProviderApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getServiceProvider: builder.query({
      query: (params) => ({
        url: "service-provider/page",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getServiceProviderWithParams: builder.query({
      query: (params) => ({
        url: "service-provider/page?Request=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    createEditServiceProvider: builder.mutation({
      query: (body) => ({
        url: "service-provider/addNewServiceProvider",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    serviceProviderValidation: builder.mutation({
      query: (body) => ({
        url: "service-provider/validation",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archiveServiceProvider: builder.mutation({
      query: (id) => ({
        url: `service-provider/status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const {
  useGetServiceProviderQuery,
  useLazyGetServiceProviderQuery,
  useLazyGetServiceProviderWithParamsQuery,
  useCreateEditServiceProviderMutation,
  useServiceProviderValidationMutation,
  useArchiveServiceProviderMutation,
} = serviceProviderApi;
