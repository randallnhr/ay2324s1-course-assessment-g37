import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hook";
import { selectSortedFilteredQuestions } from "../store/slices/questionFilterSlice";
import CollabQuestion from "./CollabQuestion";
import { QuestionComplexity } from "./types";
import { resetAndSetDifficulty } from "../store/slices/questionFilterSlice";

interface CollabPageProps {
  difficulty: QuestionComplexity;
}

const CollabPage: React.FC<CollabPageProps> = ({ difficulty }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetAndSetDifficulty(difficulty));
  }, [dispatch, difficulty]);

  const sortedQuestions = useAppSelector(selectSortedFilteredQuestions);

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    null
  );

  const toggleQuestionDetails = (id: string) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  return (
    <div>
      <CollabQuestion
        questions={sortedQuestions}
        expandedQuestionId={expandedQuestionId}
        toggleQuestionDetails={toggleQuestionDetails}
      />
    </div>
  );
};

export default CollabPage;
