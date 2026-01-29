import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./auth.api";

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.accountInfo;
      },
    );
  },
  selectors: {
    token: (state) => state.token,
    user: (state) => state.user,
    isAuthenticated: (state) => !!state.token,
  },
});

export default authSlice;
