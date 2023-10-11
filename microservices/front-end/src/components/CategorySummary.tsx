import React from "react";
import styles from "./CategorySummary.module.css";

interface CategorySummaryProps {
  categorySummary: { [key: string]: number };
  onSelectCategory: (category: string) => void;
}

const CategorySummary: React.FC<CategorySummaryProps> = ({
  categorySummary,
  onSelectCategory,
}) => {
  const orderedCategories = [
    "All",
    ...Object.keys(categorySummary).filter((key) => key !== "All"),
  ]; // ensure All is always mapped first

  const handleCategoryClick = (category: string) => {
    onSelectCategory(category);
  };

  return (
    <div className={styles.summary_container}>
      {orderedCategories.map((category) => (
        <button
          key={category}
          className={styles.summary_button}
          onClick={() => handleCategoryClick(category)}
        >
          {category}{" "}
          <span className={styles.count}>({categorySummary[category]})</span>
        </button>
      ))}
    </div>
  );
};

export default CategorySummary;
