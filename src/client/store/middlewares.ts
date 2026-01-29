import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit";

export const rtkQueryError: Middleware = () => (next) => (action) => {
  // You can add custom logic here to handle RTK Query errors globally
  if (isRejectedWithValue(action)) {
    console.error("RTK Query Error:", action.payload);
    // Optionally, you can dispatch global error notifications here
  }
  return next(action);
};
