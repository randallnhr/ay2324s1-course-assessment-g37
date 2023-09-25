import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QuestionBank.module.css";
import { Question, User } from "./types";
import {
  getQuestions,
  addQuestion,
  deleteQuestion,
  updateQuestion,
} from "./fetchData";
import AddQuestionForm from "./AddQuestionForm";
import { AppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { UserProvider, useUserContext } from "../UserContext";

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

  // Need to fetch current user as well
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const { currentUser, setCurrentUser } = useUserContext();

  // functions to fetch all questions and update UI
  const fetchQuestions = async () => {
    const fetchedQuestions = await getQuestions();
    setQuestions(fetchedQuestions);
  };

  // fetch when component mounts
  // Use isFetching on question fetching
  useEffect(() => {
    try {
      setIsFetching(true);
      fetchQuestions();
    } catch (error) {
      console.error("Error fetching questions", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  // on windows reload, need to re-fetch user credential
  useEffect(() => {
    if (Object.keys(currentUser).length === 0) {
      // initially currentUser = {}
      axios
        .get("/api/auth/current-user")
        .then((response) => {
          console.log(response.data);
          const userData: User = response.data;
          setCurrentUser(userData);
          console.log(currentUser.username);
        })
        .catch((error) => {
          console.error("Error fetching current user", error);
        });
    }
  }, [currentUser, setCurrentUser]);

  // check if currentUser is authenticated, if not, direct back to login
  useEffect(() => {
    if (Object.keys(currentUser).length != 0 && !currentUser.username) {
      navigate("/login");
    }
  });

  // if not user, try to fetch the user data
  // Can I remove the initial fetching of user data at all?
  const handleSignout = () => {
    axios
      .delete("/api/auth/log-out")
      .then((response) => {
        if (response.status === 200) {
          // reset user content
          setCurrentUser({} as User);
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
        alert("Failed to sign out, please try again!");
      });
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const toggleQuestionDetails = (id: string) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  // adding a new question
  const handleAddQuestion = async (newQuestion: Partial<Question>) => {
    await addQuestion(newQuestion);
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
    await updateQuestion(updatedQuestion, id);
    fetchQuestions();
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              HOME
            </Typography>
            <Button color="inherit" onClick={handleProfile}>
              Profile
            </Button>
            <Button color="inherit" onClick={handleSignout}>
              Log Out
            </Button>
          </Toolbar>
        </AppBar>
      </div>
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
                currentUser.username && (
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
                          <label className={styles.the_label}>Complexity</label>
                          <select
                            className={styles.the_select}
                            ref={complexityRef}
                            defaultValue={question.complexity}
                          >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                        </div>
                      </div>
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
                        onClick={() => {
                          const updatedTitle = titleRef.current?.value || "";
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
                          handleUpdateQuestion(updatedQuestion, question._id);
                          setUpdatingQuestionId(null);
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
                        currentUser.username && (
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
        currentUser.username && (
          <>
            <h2 className={styles.add_header}>Add a New Question</h2>
            <AddQuestionForm
              newQuestion={newQuestion}
              allCategories={allCategories}
              selectedCategory={selectedCategory}
              setNewQuestion={setNewQuestion}
              handleAddQuestions={handleAddQuestion}
              setSelectedCategory={setSelectedCategory}
            />
          </>
        )}
    </div>
  );
};
export default QuestionBank;
