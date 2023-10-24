import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectHistory = (state: RootState) => state.history;

export const selectAttemptedQuestions = createSelector(
    [selectHistory],
    (history) => history.map((historyItem) => historyItem.questionId)
);