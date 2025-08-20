import { api } from "../../index";

const tags = ["One Charging"];

export const oneChargingApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getOneCharging: builder.query({
      query: (params) => ({
        url: "GetOneCharging/page?Status=true",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),
    syncOneCharging: builder.mutation({
      query: (body) => ({
        url: "charging/sync",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetOneChargingQuery, useSyncOneChargingMutation, useLazyGetOneChargingQuery } = oneChargingApi;
