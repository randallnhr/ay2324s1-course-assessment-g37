import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QuestionBank.module.css";
import { Question } from "./types";
import {
  getQuestions,
  addQuestion,
  deleteQuestion,
  updateQuestion,
} from "./fetchData";
import AddQuestionForm from "./AddQuestionForm";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useUserContext } from "../UserContext";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Box } from "@mui/material";

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

const QuestionBank: React.FC = () => {
  // State to store the list of questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    null
  );
  const [updatingQuestionId, setUpdatingQuestionId] = useState<string | null>(
    null
  );
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
    categories: [] as string[],
    complexity: "Easy" as "Easy" | "Medium" | "Hard", // default value
  });
  const navigate = useNavigate();

  // These are to reset selection field, otherwise it will display strange stuff
  const [selectedCategory, setSelectedCategory] = useState("");
  const [updateSelectedOption, setUpdateSelectedOption] = useState("");

  // Create refs outside the map
  const titleRef = React.createRef<HTMLInputElement>();
  // const categoryRef = React.createRef<HTMLInputElement>();
  const complexityRef = React.createRef<HTMLSelectElement>();
  const descriptionRef = React.createRef<HTMLTextAreaElement>();

  // set the Add & Update status
  const [addError, setAddError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Need to fetch current user as well
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const { currentUser, setCurrentUser } = useUserContext();

  const isAuthenticated =
    currentUser && Object.keys(currentUser).length != 0 && currentUser.username;

  // fetch when component mounts
  // Use isFetching on question fetching
  useEffect(() => {
    async function init() {
      if (!isAuthenticated) {
        return;
      }

      try {
        setIsFetching(true);
        await fetchQuestions();
      } catch (error) {
        console.error("Error fetching questions", error);
      } finally {
        setIsFetching(false);
      }
    }

    init();
  }, [isAuthenticated]);

  // check if currentUser is authenticated, if not, direct back to login
  // Including an dependency array is good practice! Otherwise will re-render whenever some state changes
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <></>;
  }

  // functions to fetch all questions and update UI
  const fetchQuestions = async () => {
    const fetchedQuestions = await getQuestions();

    if (fetchedQuestions === undefined) {
      alert("Failed to fetch questions");
      return;
    }

    setQuestions(fetchedQuestions);
  };

  const toggleQuestionDetails = (id: string) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  // adding a new question
  const handleAddQuestion = async (newQuestion: Partial<Question>) => {
    await addQuestion(newQuestion, setAddError);
    fetchQuestions();
  };

  const handleDeleteQuestion = async (id: string) => {
    await deleteQuestion(id);
    fetchQuestions();
  };

  const handleUpdateQuestion = async (
    updatedQuestion: Question,
    id: string | number
  ) => {
    const success = await updateQuestion(updatedQuestion, id, setUpdateError);
    fetchQuestions();
    return success;
  };

  const updateExistingCategoryArray = (
    qustionId: string,
    category: string,
    action: "add" | "remove"
  ) => {
    const index = questions.findIndex((q) => q._id === qustionId);
    if (index != -1) {
      const updatedQuestions = [...questions];
      const question = { ...updatedQuestions[index] };
      if (action == "add") {
        question.categories.push(category);
      } else {
        question.categories = question.categories.filter(
          (cat) => cat != category
        );
      }
      // trigger a re-render to show the current question tags
      // limit this to ONLY the current question!
      updatedQuestions[index] = question;
      setQuestions(updatedQuestions);
    }
  };

  return (
    <div>
      {isFetching ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isFetching}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <div className={styles.header_container}>
            <h1>Question Bank</h1>
          </div>
          {/* If user is null, no access to questions */}
          {currentUser &&
          Object.keys(currentUser).length != 0 &&
          !currentUser.username ? (
            <div>
              <h2 style={{ textAlign: "center" }}>
                Please sign in to access the questions.
              </h2>
            </div>
          ) : (
            <table className={styles.table_container}>
              <thead>
                <tr>
                  <th className={styles.table_header}>Title</th>
                  <th className={styles.table_header}>Category</th>
                  <th className={styles.table_header}>Complexity</th>
                  {currentUser &&
                    Object.keys(currentUser).length != 0 &&
                    currentUser.username &&
                    currentUser.role === "admin" && (
                      <th className={styles.table_header}>Actions</th>
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
                              <label className={styles.the_label}>
                                Description
                              </label>
                              <textarea
                                className={styles.text_area}
                                ref={descriptionRef}
                                defaultValue={question.description}
                                onChange={() => setUpdateError(null)}
                              ></textarea>
                            </div>
                            <div>
                              <label className={styles.the_label}>
                                Category
                              </label>
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
                                  .filter(
                                    (cat) => !question.categories.includes(cat)
                                  )
                                  .map((cat, index) => (
                                    <option key={index} value={cat}>
                                      {cat}
                                    </option>
                                  ))}
                              </select>
                              {/* <input ref={categoryRef} type="text" defaultValue={question.category} /> */}
                            </div>
                            <div>
                              <label className={styles.the_label}>
                                Complexity
                              </label>
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
                            onClick={() => setUpdatingQuestionId(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className={styles.action_button}
                            onClick={async () => {
                              const updatedTitle =
                                titleRef.current?.value || "";
                              // const updatedCategory = categoryRef.current?.value || "";
                              const updatedComplexity = complexityRef.current
                                ?.value as "Easy" | "Medium" | "Hard"; // type assertion
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
                                setUpdatingQuestionId(null);
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
                            onClick={() => toggleQuestionDetails(question._id)}
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
                                  onClick={() =>
                                    handleDeleteQuestion(question._id)
                                  }
                                >
                                  Delete
                                </button>
                                <button
                                  className={styles.action_button}
                                  onClick={() =>
                                    setUpdatingQuestionId(question._id)
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
          )}
          {/* Render AddQuestionForm conditionally */}
          {currentUser &&
            Object.keys(currentUser).length != 0 &&
            currentUser.username &&
            currentUser.role === "admin" && (
              <>
                <h2 className={styles.add_header}>Add a New Question</h2>
                <AddQuestionForm
                  newQuestion={newQuestion}
                  allCategories={allCategories}
                  selectedCategory={selectedCategory}
                  setNewQuestion={setNewQuestion}
                  handleAddQuestions={handleAddQuestion}
                  setSelectedCategory={setSelectedCategory}
                  error={addError}
                  onErrorChange={setAddError}
                />
              </>
            )}
        </>
      )}
    </div>
  );
};
export default QuestionBank;
