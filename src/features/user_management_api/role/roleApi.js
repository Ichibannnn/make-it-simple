import { api } from "../../index";

const tags = ["Roles"];

export const roleApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: (params) => ({
        url: "UserRole/GetUserRole",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    createRole: builder.mutation({
      query: (body) => ({
        url: "UserRole/AddNewUserRole",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    updateRoleName: builder.mutation({
      query: (body) => ({
        url: "UserRole/UpdateUserRole",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    updateRolePermission: builder.mutation({
      query: (body) => ({
        url: "UserRole/UntagAndTagUserRolePermission",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archiveRole: builder.mutation({
      query: (body) => ({
        url: "UserRole/UpdateUserRoleStatus",
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useLazyGetRolesQuery, useGetRolesQuery, useCreateRoleMutation, useUpdateRoleNameMutation, useUpdateRolePermissionMutation, useArchiveRoleMutation } = roleApi;
