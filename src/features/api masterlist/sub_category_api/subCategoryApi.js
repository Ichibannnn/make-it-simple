import { api } from "../../index";

const tags = ["Sub Category"];

export const subCategoryApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getSubCategory: builder.query({
      query: (params) => ({
        url: "sub-category/page",
        method: "GET",
        params: params,
      }),
      providesTags: tags,
    }),

    getSubCategoryArray: builder.query({
      query: ({ CategoryId }) => {
        const categoryArray = CategoryId.map((id) => `CategoryId=${id}`).join(`&`);

        console.log("categoryArray: ", categoryArray);

        return {
          url: `request-concern/multiple-sub-category?${categoryArray}`,
          method: "GET",
        };
      },
      providesTags: tags,
    }),

    createEditSubCategory: builder.mutation({
      query: (body) => ({
        url: "sub-category",
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),

    archiveSubCategory: builder.mutation({
      query: (id) => ({
        url: `sub-category/status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_, error) => (error ? [] : tags),
    }),
  }),
});

export const { useGetSubCategoryQuery, useLazyGetSubCategoryQuery, useLazyGetSubCategoryArrayQuery, useCreateEditSubCategoryMutation, useArchiveSubCategoryMutation } =
  subCategoryApi;
