import { REHYDRATE } from "redux-persist";
import { RootState } from "../store";
import { Action } from "@reduxjs/toolkit";

export const isHydrateAction = (
  action: Action,
): action is Action<typeof REHYDRATE> & {
  key: string;
  payload: RootState;
  err: unknown;
} => {
  return action.type === REHYDRATE;
};
