import React from "react";
import { RefObject } from "react";
import { Question, User } from "./types";
import styles from "./QuestionBank.module.css";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Box } from "@mui/material";

import { useAppSelector, useAppDispatch } from "../store/hook";
import {
  setExpandedQuestionId,
  setUpdatingQuestionId,
} from "../store/slices/questionTableSlice";

interface QuestionTableProps {
  currentUser: User;
  questions: Question[];
  allCategories: string[];

  titleRef: RefObject<HTMLInputElement>;
  descriptionRef: RefObject<HTMLTextAreaElement>;
  complexityRef: RefObject<HTMLSelectElement>;

  updateExistingCategoryArray: (
    questionId: string,
    category: string,
    action: "add" | "remove"
  ) => void;

  updateSelectedOption: string;
  setUpdateSelectedOption: React.Dispatch<React.SetStateAction<string>>;

  handleUpdateQuestion: (
    updatedQuestion: Question,
    id: string | number
  ) => Promise<boolean>;
  handleDeleteQuestion: (id: string) => Promise<void>;

  updateError: string | null;
  setUpdateError: React.Dispatch<React.SetStateAction<string | null>>;
}

const QuestionTable: React.FC<QuestionTableProps> = ({
  currentUser,
  questions,
  titleRef,
  descriptionRef,
  updateExistingCategoryArray,
  updateSelectedOption,
  setUpdateSelectedOption,
  allCategories,
  complexityRef,
  handleUpdateQuestion,
  handleDeleteQuestion,
  updateError,
  setUpdateError,
}) => {
  const dispatch = useAppDispatch();

  const expandedQuestionId = useAppSelector(
    (state) => state.questionTable.expandedQuestionId
  );
  const updatingQuestionId = useAppSelector(
    (state) => state.questionTable.updatingQuestionId
  );

  const hasActionsColumn =
    currentUser &&
    Object.keys(currentUser).length !== 0 &&
    currentUser.username &&
    currentUser.role === "admin";

  return (
    <table className={styles.table_container}>
      <thead>
        <tr>
          {hasActionsColumn ? (
            <>
              <th className={`${styles.table_header} ${styles.title}`}>
                Title
              </th>
              <th className={`${styles.table_header} ${styles.category}`}>
                Category
              </th>
              <th className={`${styles.table_header} ${styles.complexity}`}>
                Complexity
              </th>
              <th className={`${styles.table_header} ${styles.actions}`}>
                Actions
              </th>
            </>
          ) : (
            <>
              <th className={`${styles.table_header_basic} ${styles.title}`}>
                Title
              </th>
              <th className={`${styles.table_header_basic} ${styles.category}`}>
                Category
              </th>
              <th
                className={`${styles.table_header_basic} ${styles.complexity}`}
              >
                Complexity
              </th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {questions.map((question) => (
          <React.Fragment key={question._id}>
            {updatingQuestionId === question._id ? (
              <tr>
                <td colSpan={3}>
                  <div className={styles.update_form}>
                    <div>
                      <label className={styles.the_label}>Title</label>
                      <input
                        className={styles.input_text}
                        ref={titleRef}
                        type="text"
                        defaultValue={question.title}
                        onChange={() => setUpdateError(null)}
                      />
                    </div>
                    <div>
                      <label className={styles.the_label}>Description</label>
                      <textarea
                        className={styles.text_area}
                        ref={descriptionRef}
                        defaultValue={question.description}
                        onChange={() => setUpdateError(null)}
                      ></textarea>
                    </div>
                    <div>
                      <label className={styles.the_label}>Category</label>
                      <div>
                        {question.categories.map((cat, index) => (
                          <span key={index}>
                            {cat}
                            <button
                              className={styles.category_button}
                              onClick={() =>
                                updateExistingCategoryArray(
                                  question._id,
                                  cat,
                                  "remove"
                                )
                              }
                            >
                              X
                            </button>
                          </span>
                        ))}
                      </div>
                      <select
                        className={styles.the_select}
                        value={updateSelectedOption} // explicitly set the value
                        onChange={(e) => {
                          const newValue = e.target.value;
                          updateExistingCategoryArray(
                            question._id,
                            newValue,
                            "add"
                          );
                          setUpdateSelectedOption(""); // reset the selected option
                          setUpdateError(null);
                        }}
                      >
                        <option value="" disabled>
                          Select your option
                        </option>
                        {allCategories
                          .filter((cat) => !question.categories.includes(cat))
                          .map((cat, index) => (
                            <option key={index} value={cat}>
                              {cat}
                            </option>
                          ))}
                      </select>
                      {/* <input ref={categoryRef} type="text" defaultValue={question.category} /> */}
                    </div>
                    <div>
                      <label className={styles.the_label}>Complexity</label>
                      <select
                        className={styles.the_select}
                        ref={complexityRef}
                        defaultValue={question.complexity}
                        onChange={() => setUpdateError(null)}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {updateError && (
                    <Box mt={1} mb={1}>
                      <Alert
                        severity="error"
                        onClose={() => setUpdateError(null)}
                      >
                        <AlertTitle>Update Question Error</AlertTitle>
                        {updateError}
                      </Alert>
                    </Box>
                  )}
                </td>
                <td>
                  <button
                    className={styles.action_button}
                    onClick={() => dispatch(setUpdatingQuestionId(null))}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.action_button}
                    onClick={async () => {
                      const updatedTitle = titleRef.current?.value || "";
                      // const updatedCategory = categoryRef.current?.value || "";
                      const updatedComplexity = complexityRef.current?.value as
                        | "Easy"
                        | "Medium"
                        | "Hard"; // type assertion
                      const updatedDescription =
                        descriptionRef.current?.value || ""; // New line
                      const updatedQuestion = {
                        _id: question._id,
                        title: updatedTitle,
                        categories: question.categories, // already updated in-place
                        complexity: updatedComplexity,
                        description: updatedDescription, // New field
                      };
                      const success = await handleUpdateQuestion(
                        updatedQuestion,
                        question._id
                      );

                      // Only close the update tab if there is no error
                      if (success) {
                        dispatch(setUpdatingQuestionId(null));
                      }
                    }}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ) : (
              <tr>
                <td>
                  <button
                    className={styles.category_button}
                    onClick={
                      () => dispatch(setExpandedQuestionId(question._id))
                      // Here the 'toggle' should be put in setExpandedQuestionId definition!
                    }
                  >
                    {question.title}
                  </button>
                </td>
                <td className={styles.center_align_cell}>
                  {question.categories.join(", ")}
                </td>
                <td className={styles.center_align_cell}>
                  {question.complexity}
                </td>
                <td>
                  {/* Render Actions conditionally for non-basic users */}
                  {currentUser &&
                    Object.keys(currentUser).length != 0 &&
                    currentUser.username &&
                    currentUser.role === "admin" && (
                      <>
                        <button
                          className={styles.action_button}
                          onClick={() => handleDeleteQuestion(question._id)}
                        >
                          Delete
                        </button>
                        <button
                          className={styles.action_button}
                          onClick={() =>
                            dispatch(setUpdatingQuestionId(question._id))
                          }
                        >
                          Update
                        </button>
                      </>
                    )}
                </td>
              </tr>
            )}
            {expandedQuestionId === question._id && (
              <tr>
                <td colSpan={4}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: question.description,
                    }}
                  ></div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default QuestionTable;

// all the required variables:
/*
currentUser, questions, updatingQuestionId, titleRef,
descriptionRef, setUpdateError, updateExistingCategoryArray,
updateSelectedOption, setUpdateSelectedOption, 
allCategories, complexityRef, updateError, 
handleUpdateQuestion, toggleQuestionDetails, handleDeleteQuestion,
expandedQuestionId, setUpdatingQuestionId
*/
