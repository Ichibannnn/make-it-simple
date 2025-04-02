import { api } from "../../index";

const tags = ["Users"];

export const userApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => ({
        url: "User/GetUser",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    createUser: builder.mutation({
      query: (body) => ({
        url: "User/AddNewUser",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    updateUser: builder.mutation({
      query: (body) => ({
        url: "User/UpdateUser",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    resetUserPassword: builder.mutation({
      query: (body) => ({
        url: "User/UserResetPassword",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archiveUser: builder.mutation({
      query: (body) => ({
        url: "User/UpdateUserStatus",
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    changeUserPassword: builder.mutation({
      query: (body) => ({
        url: "User/UserChangePassword",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useResetUserPasswordMutation,
  useArchiveUserMutation,
  useChangeUserPasswordMutation,
} = userApi;
