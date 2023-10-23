import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteQuestion as apiDeleteQuestion } from '../../components/fetchData';
import { fetchQuestions } from "./questionsSlice";
import { RootState } from "..";

const initialState = {
    updatingQuestionId: null as string | null,
    updateError: null as string | null,
    expandedQuestionId: null as string | null
};

export const deleteQuestion = createAsyncThunk<void, string, { state: RootState }>(
    'questionTable/deleteQuestion',
    async (id, thunkAPI) => {
        try {
            await apiDeleteQuestion(id);
            thunkAPI.dispatch(fetchQuestions());  // Re-fetch questions after deletion
        } catch (error) {
            alert("Failed to delete question");
        }
    }
)

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
    },
});

export const {
    setUpdatingQuestionId,
    setUpdateError,
    setExpandedQuestionId
} = questionTableUISlice.actions;

export default questionTableUISlice.reducer;


