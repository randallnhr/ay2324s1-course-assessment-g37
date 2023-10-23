import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QuestionBank.module.css";
import { Question } from "./types";
import {
  deleteQuestion,
  updateQuestion,
  calculateCategorySummary,
} from "./fetchData";
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
import { selectSortedFilteredQuestions } from "../store/slices/questionFilterSlice";
import CollabQuestion from "./CollabQuestion";

const CollabPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const sortedQuestions = useAppSelector(selectSortedFilteredQuestions);

  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useUserContext();

  return (
    <div>
      <CollabQuestion 
      questions={sortedQuestions}


    </div>
  )
};
