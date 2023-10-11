import { configureStore } from "@reduxjs/toolkit";
import successSnackbarReducer from "./slices/successSnackbarSliceTemp";

export const store = configureStore({
  reducer: {
    successSnackbar: successSnackbarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
