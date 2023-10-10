import React, { ChangeEvent } from "react";
import styles from "./QuestionFilter.module.css";

interface QuestionFilterProps {
  onAttemptFilterChange: (attempted: string) => void;
  onDifficultyFilterChange: (difficulty: string) => void;
}

const QuestionFilter: React.FC<QuestionFilterProps> = ({
  onAttemptFilterChange,
  onDifficultyFilterChange,
}) => {
  const handleAttemptFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onAttemptFilterChange(e.target.value);
  };

  const handleDifficultyFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onDifficultyFilterChange(e.target.value);
  };

  return (
    <div className={styles.filter_container}>
      <select
        className={styles.the_select}
        onChange={handleAttemptFilterChange}
      >
        <option value="all">All</option>
        <option value="attempted">Attempted</option>
        <option value="unattempted">Unattempted</option>
      </select>

      <select
        className={styles.the_select}
        onChange={handleDifficultyFilterChange}
      >
        <option value="all">All Levels</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  );
};

export default QuestionFilter;
