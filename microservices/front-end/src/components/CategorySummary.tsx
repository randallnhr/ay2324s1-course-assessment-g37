import React from "react";
import styles from "./CategorySummary.module.css";

interface CategorySummaryProps {
  categorySummary: { [key: string]: number };
}

const CategorySummary: React.FC<CategorySummaryProps> = ({
  categorySummary,
}) => {
  return (
    <div className={styles.summary_container}>
      {Object.keys(categorySummary).map((category) => (
        <button key={category} className={styles.summary_button}>
          {category} ({categorySummary[category]})
        </button>
      ))}
    </div>
  );
};

export default CategorySummary;
