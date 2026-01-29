import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./auth/auth.api";
import { useDispatch } from "react-redux";
import dataApi from "./data/data.api";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import { rootReducers } from "./rootReducers";
import { setupListeners } from "@reduxjs/toolkit/query";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: [authApi.reducerPath, dataApi.reducerPath],
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducers>>(
  persistConfig,
  rootReducers,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApi.middleware)
      .concat(dataApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
