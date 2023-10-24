import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryFilterState {
    filteredCategory: string;
}

const initialState: CategoryFilterState = {
    filteredCategory: "All",
};

const categoryFilterSlice = createSlice({
    name: "categoryFilter",
    initialState,
    reducers: {
        setFilteredCategory: (state, action: PayloadAction<string>) => {
            state.filteredCategory = action.payload;
        },
    },
});

export const { setFilteredCategory } = categoryFilterSlice.actions;

export default categoryFilterSlice.reducer;