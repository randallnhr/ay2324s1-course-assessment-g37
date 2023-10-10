import React from "react";
import styles from "./CategorySummary.module.css";

interface CategorySummaryProps {
  categorySummary: { [key: string]: number };
}

const CategorySummary: React.FC<CategorySummaryProps> = ({
  categorySummary,
}) => {
  const orderedCategories = [
    "All",
    ...Object.keys(categorySummary).filter((key) => key !== "All"),
  ]; // ensure All is always mapped first

  return (
    <div className={styles.summary_container}>
      {orderedCategories.map((category) => (
        <button key={category} className={styles.summary_button}>
          {category}{" "}
          <span className={styles.count}>({categorySummary[category]})</span>
        </button>
      ))}
    </div>
  );
};

export default CategorySummary;
