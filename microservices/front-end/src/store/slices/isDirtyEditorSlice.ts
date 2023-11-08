import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const isDirtyEditorSlice = createSlice({
  name: "isDirtyEditor",
  initialState,
  reducers: {
    setIsDirtyEditor: (state, action) => action.payload,
  },
});

export const { setIsDirtyEditor } = isDirtyEditorSlice.actions;

export default isDirtyEditorSlice.reducer;
