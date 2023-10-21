import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Need createAsyncThunk to handle async operations?
import { addQuestion } from '../../components/fetchData';
import { Question } from "../../components/types";
import { fetchQuestions } from "./questionsSlice";
import { AppDispatch, RootState } from "..";

// just like historySlice, set initialState of the slice!
const initialState = {
    newQuestion: {
        title: "",
        description: "",
        categories: [] as string[],
        complexity: "Easy" as "Easy" | "Medium" | "Hard"
    },
    selectedCategory: "",
    addError: null as string | null
};

const addFormSlice = createSlice({
    name: "addform",
    initialState,
    reducers: {
        setNewQuestionTitle: (state, action: PayloadAction<string>) => {
            state.newQuestion.title = action.payload;
        },
        setNewQuestionDescription: (state, action: PayloadAction<string>) => {
            state.newQuestion.description = action.payload;
        },
        addNewQuestionCategory: (state, action: PayloadAction<string>) => {
            state.newQuestion.categories.push(action.payload);
        },
        removeNewQuestionCategory: (state, action: PayloadAction<string>) => {
            state.newQuestion.categories = state.newQuestion.categories.filter(cat => cat !== action.payload);
        },
        setNewQuestionComplexity: (state, action: PayloadAction<"Easy" | "Medium" | "Hard">) => {
            state.newQuestion.complexity = action.payload;
        },
        setSelectedCategory: (state, action: PayloadAction<string>) => {
            state.selectedCategory = action.payload;
        },
        setAddError: (state, action: PayloadAction<string | null>) => {
            state.addError = action.payload;
        },
        resetForm: () => initialState,
    }
});

export const submitNewQuestion = createAsyncThunk<
    void, // return type of the payload creator
    Partial<Question>, // first argument to the payload creator
    {
        dispatch: AppDispatch;
        state: RootState;
    }
>(
    'addform/submitNewQuestion',
    async (newQuestion: Partial<Question>, thunkAPI) => {
        try {
            await addQuestion(newQuestion);
            thunkAPI.dispatch(fetchQuestions());
            thunkAPI.dispatch(resetForm());
        } catch (error) {
            if (error instanceof Error) {
                thunkAPI.dispatch(setAddError(error.message));
            } else {
                thunkAPI.dispatch(setAddError("An unknown error occurred."));
            }
        }
    }
)

export const {
    setNewQuestionTitle,
    setNewQuestionDescription,
    addNewQuestionCategory,
    removeNewQuestionCategory,
    setNewQuestionComplexity,
    setSelectedCategory,
    setAddError,
    resetForm
} = addFormSlice.actions;

export default addFormSlice.reducer;




