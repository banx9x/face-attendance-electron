import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "./auth/auth.api";
import authSlice from "./auth/auth.slice";
import dataApi from "./data/data.api";

export const rootReducers = combineReducers({
  auth: authSlice.reducer,

  [authApi.reducerPath]: authApi.reducer,
  [dataApi.reducerPath]: dataApi.reducer,
});
