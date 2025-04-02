import { api } from "../../index";

const tags = ["Channel"];

export const channelApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: (params) => ({
        url: "channel/page",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    createChannel: builder.mutation({
      query: (body) => ({
        url: "channel",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    createChannelValidation: builder.mutation({
      query: (body) => ({
        url: "channel/validation",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    updateChannel: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `channel/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archiveChannel: builder.mutation({
      query: (id) => ({
        url: `channel/status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    getChannelMembers: builder.query({
      query: ({ DepartmentId }) => {
        const departmentArray = DepartmentId.map((id) => `DepartmentId=${id}`).join(`&`);
        return {
          url: `channel/member-list?${departmentArray}`,
          method: "GET",
        };
      },
      providesTags: tags,
    }),

    createChannelMember: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `channel/member/${id}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useLazyGetChannelsQuery,
  useCreateChannelMutation,
  useCreateChannelValidationMutation,
  useUpdateChannelMutation,
  useArchiveChannelMutation,
  useLazyGetChannelMembersQuery,
  useCreateChannelMemberMutation,
} = channelApi;
