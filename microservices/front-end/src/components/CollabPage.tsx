import React, { useState } from "react";
import { useAppSelector } from "../store/hook";
import { selectSortedFilteredQuestions } from "../store/slices/questionFilterSlice";
import CollabQuestion from "./CollabQuestion";

const CollabPage: React.FC = () => {
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
