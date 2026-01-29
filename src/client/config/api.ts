import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: "https://admin.hsa.edu.vn/api",
  headers: {
    "Content-Type": "application/json",
  },
  prepareHeaders(headers, api) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = api.getState() as any;
    const token = state.auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});
