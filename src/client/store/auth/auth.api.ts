import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../config/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  // to prevent circular type issues, the return type needs to be annotated as any
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: "accounts/admin/sign-in",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});
