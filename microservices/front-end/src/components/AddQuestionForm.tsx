import React from "react";
import styles from "./QuestionBank.module.css";

import { useAppSelector, useAppDispatch } from "../store/hook";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Box } from "@mui/material";
import {
  setNewQuestionTitle,
  setNewQuestionDescription,
  addNewQuestionCategory,
  removeNewQuestionCategory,
  setNewQuestionComplexity,
  setSelectedCategory,
  setAddError,
  resetForm,
  submitNewQuestion,
} from "../store/slices/addFormSlice";

// React.dispatch = a funciton to dispatch actions
// SetStateAction = set or update current state
// interface = define a contract. Includes value + function

const allCategories = [
  "Arrays",
  "Strings",
  "Hash Table",
  "Math",
  "Dynamic Programming",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Databases",
  "Breadth-First Search",
  "Tree",
  "Matrix",
  "Two Pointers",
  "Binary Tree",
  "Bit Manipulation",
  "Heap (Priority Queue)",
  "Stack",
  "Prefix Sum",
  "Graph",
  "Simulation",
  "Design",
  "Counting",
  "Backtracking",
  "Queue",
  "Algorithms",
  "Data Structures",
  "Recursion",
  "Brainteaser",
  "Others",
];

const AddQuestionForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const newQuestion = useAppSelector((state) => state.addForm.newQuestion);
  const selectedCategory = useAppSelector(
    (state) => state.addForm.selectedCategory
  );
  const error = useAppSelector((state) => state.addForm.addError);

  return (
    <form
      className={styles.form_container}
      onSubmit={(e) => {
        e.preventDefault();
        dispatch(submitNewQuestion(newQuestion));
        dispatch(resetForm());
      }}
    >
      <div>
        <label className={styles.the_label}>Title</label>
        <input
          className={styles.input_text}
          type="text"
          value={newQuestion.title}
          onChange={(e) => {
            dispatch(setNewQuestionTitle(e.target.value));
            dispatch(setAddError(null));
          }}
        />
      </div>
      <div>
        <label className={styles.the_label}>Description</label>
        <textarea
          className={styles.text_area}
          value={newQuestion.description}
          onChange={(e) => {
            dispatch(setNewQuestionDescription(e.target.value));
            dispatch(setAddError(null));
          }}
        ></textarea>
      </div>
      <div>
        <label className={styles.the_label}>Category</label>
        <div>
          {/* take all the current categories, and display them one by one (start from an empty array) */}
          {/* Here map and filter will only be called if category exists */}
          {newQuestion.categories?.map((cat, index) => (
            // display each category followed by 'X'. Click X will remove the category
            <span key={index}>
              {cat}{" "}
              <button
                className={styles.category_button}
                type="button"
                onClick={() => dispatch(removeNewQuestionCategory(cat))}
              >
                X
              </button>
            </span>
          ))}
          {/* drop-down list to add new categories. Only those not already added will be displayed */}
          <select
            className={styles.the_select}
            value={selectedCategory}
            onChange={(e) => {
              dispatch(addNewQuestionCategory(e.target.value));
              dispatch(setSelectedCategory(""));
              dispatch(setAddError(null));
            }}
          >
            <option value="" disabled>
              {/* Here should not have disabled selected, cause confusion */}
              Select your option
            </option>
            {allCategories
              .filter((cat) => !(newQuestion.categories || []).includes(cat))
              .map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
          </select>
        </div>
        {/* <input type="text" value={newQuestion.category} onChange={e => setNewQuestion({ ...newQuestion, category: e.target.value })} /> */}
      </div>
      <div>
        <label className={styles.the_label}>Complexity</label>
        <select
          className={styles.the_select}
          value={newQuestion.complexity as "Easy" | "Medium" | "Hard"}
          onChange={(e) => {
            dispatch(
              setNewQuestionComplexity(
                e.target.value as "Easy" | "Medium" | "Hard"
              )
            );
            dispatch(setAddError(null));
          }}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Handle error situation */}
      {error && (
        <Box mt={1} mb={1}>
          <Alert severity="error" onClose={() => dispatch(setAddError(null))}>
            <AlertTitle>Add Question Error</AlertTitle>
            {error}
          </Alert>
        </Box>
      )}

      <button className={styles.action_button} type="submit">
        Add Question
      </button>
    </form>
  );
};

export default AddQuestionForm;
