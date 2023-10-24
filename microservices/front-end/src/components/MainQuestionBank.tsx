import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QuestionBank.module.css";
import { Question } from "./types";
import { updateQuestion, calculateCategorySummary } from "./fetchData";
import AddQuestionForm from "./AddQuestionForm";
import QuestionTable from "./QuestionTable";
import CategorySummary from "./CategorySummary";
import QuestionFilter from "./QuestionFilter";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useUserContext } from "../UserContext";
import { useAppSelector, useAppDispatch } from "../store/hook";
import { fetchQuestions } from "../store/slices/questionsSlice";
import { updateQuestionCategory } from "../store/slices/questionsSlice";
import {
  selectSortedFilteredQuestions,
  resetAndSetDifficulty,
} from "../store/slices/questionFilterSlice";
import { setFilteredCategory } from "../store/slices/categoryFilterSlice";

const QuestionBank: React.FC = () => {
  const dispatch = useAppDispatch();

  const [categorySummary, setCategorySummary] = useState<{
    [key: string]: number;
  }>({});

  const navigate = useNavigate();

  // These are to reset selection field, otherwise it will display strange stuff
  const [updateSelectedOption, setUpdateSelectedOption] = useState("");

  // Create refs outside the map
  const titleRef = React.createRef<HTMLInputElement>();
  // const categoryRef = React.createRef<HTMLInputElement>();
  const complexityRef = React.createRef<HTMLSelectElement>();
  const descriptionRef = React.createRef<HTMLTextAreaElement>();

  // set the Add & Update status
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Need to fetch current user as well
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const { currentUser } = useUserContext();

  // Add an additional step to clear the filters
  useEffect(() => {
    dispatch(resetAndSetDifficulty("All"));
    dispatch(setFilteredCategory("All"));
  }, [dispatch]);

  const isAuthenticated =
    currentUser && Object.keys(currentUser).length != 0 && currentUser.username;

  const sortedQuestions = useAppSelector(selectSortedFilteredQuestions);

  // fetch when component mounts
  // Use isFetching on question fetching
  useEffect(() => {
    async function init() {
      if (!isAuthenticated) {
        return;
      }

      try {
        setIsFetching(true);

        // fetch questions here again?
        const fetchedQuestions = await dispatch(fetchQuestions());

        await setQuestionSummary(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions", error);
      } finally {
        setIsFetching(false);
      }
    }

    init();
  }, [isAuthenticated, dispatch]);

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

  const setQuestionSummary = async (questions?: Question[]) => {
    if (questions && questions.length > 0) {
      const summary = calculateCategorySummary(questions);
      setCategorySummary(summary);
    } else {
      alert("Failed to fetch question summary");
    }
  };

  const handleUpdateQuestion = async (
    updatedQuestion: Question,
    id: string | number
  ) => {
    const success = await updateQuestion(updatedQuestion, id, setUpdateError);
    dispatch(fetchQuestions());
    return success;
  };

  const updateExistingCategoryArray = (
    qustionId: string,
    category: string,
    action: "add" | "remove"
  ) => {
    dispatch(updateQuestionCategory({ qustionId, category, action }));
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
            <>
              <CategorySummary />

              <QuestionFilter />

              <QuestionTable
                questions={sortedQuestions}
                titleRef={titleRef}
                descriptionRef={descriptionRef}
                setUpdateError={setUpdateError}
                updateExistingCategoryArray={updateExistingCategoryArray}
                updateSelectedOption={updateSelectedOption}
                setUpdateSelectedOption={setUpdateSelectedOption}
                complexityRef={complexityRef}
                updateError={updateError}
                handleUpdateQuestion={handleUpdateQuestion}
              />
            </>
          )}
          {/* Render AddQuestionForm conditionally */}
          {currentUser &&
            Object.keys(currentUser).length != 0 &&
            currentUser.username &&
            currentUser.role === "admin" && (
              <>
                <h2 className={styles.add_header}>Add a New Question</h2>
                <AddQuestionForm />
              </>
            )}
        </>
      )}
    </div>
  );
};
export default QuestionBank;
