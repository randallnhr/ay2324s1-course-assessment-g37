import { createSelector } from '@reduxjs/toolkit';
import { RootState } from "..";

// Assuming that `questions` is in Redux state.
export const selectCategorySummary = createSelector(
    (state: RootState) => state.questions,
    (questions) => {
        const summary: { [key: string]: number } = { All: questions.length };

        questions.forEach((question) => {
            question.categories.forEach((category) => {
                if (summary[category]) {
                    summary[category] += 1;
                } else {
                    summary[category] = 1;
                }
            });
        });

        return summary;
    }
);