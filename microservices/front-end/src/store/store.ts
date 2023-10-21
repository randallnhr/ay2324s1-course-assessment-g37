import { configureStore } from "@reduxjs/toolkit";
import successSnackbarReducer from "./slices/successSnackbarSlice";
import questionsReducer from "./slices/questionsSlice";
import historyReducer from "./slices/historySlice";
import questionFilterReducer from "./slices/questionFilterSlice";
import categoryFilterReducer from "./slices/categoryFilterSlice";
import addFormReducer from './slices/addFormSlice';
import questionTableUIReducer from "./slices/questionTableUISlice";

export const store = configureStore({
  reducer: {
    successSnackbar: successSnackbarReducer,
    questions: questionsReducer,
    history: historyReducer,
    questionFilter: questionFilterReducer,
    categoryFilter: categoryFilterReducer,
    addForm: addFormReducer,
    questionUI: questionTableUIReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
