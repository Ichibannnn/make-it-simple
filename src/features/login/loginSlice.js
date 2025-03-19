import { api } from "../index";

const tags = ["loginApi"];

export const loginApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  reducerPath: tags,
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (params) => ({
        url: `Authentication/AuthenticateUser`,
        method: "POST",
        body: params,
      }),
    }),
  }),
});

export const { useSignInMutation } = loginApi;
