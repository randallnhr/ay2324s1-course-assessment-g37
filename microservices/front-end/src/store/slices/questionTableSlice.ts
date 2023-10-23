import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
    updatingQuestionId: null as string | null,
    updateError: null as string | null,
    expandedQuestionId: null as string | null
};

const questionTableUISlice = createSlice({
    name: "questionui",
    initialState,
    reducers: {
        setUpdatingQuestionId: (state, action: PayloadAction<string | null>) => {
            state.updatingQuestionId = action.payload;
        },
        setUpdateError: (state, action: PayloadAction<string | null>) => {
            state.updateError = action.payload;
        },
        setExpandedQuestionId: (state, action: PayloadAction<string | null>) => {
            if (state.expandedQuestionId === action.payload) {
                state.expandedQuestionId = null; // collapse if it's already expanded
            } else {
                state.expandedQuestionId = action.payload; // expand if it's collapsed
            }
        }
    }
});

export const {
    setUpdatingQuestionId,
    setUpdateError,
    setExpandedQuestionId
} = questionTableUISlice.actions;

export default questionTableUISlice.reducer;


