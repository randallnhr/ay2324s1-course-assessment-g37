import React from "react";
import styles from "./CategorySummary.module.css";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { setFilteredCategory } from "../store/slices/categoryFilterSlice";
import { selectCategorySummary } from "../store/slices/selectCategorySummary";

const CategorySummary: React.FC = () => {
  const dispatch = useAppDispatch();
  const filteredCategory = useAppSelector(
    (state) => state.categoryFilter.filteredCategory
  );
  const categorySummary = useAppSelector(selectCategorySummary);

  const orderedCategories = [
    "All",
    ...Object.keys(categorySummary).filter((key) => key !== "All"),
  ]; // ensure All is always mapped first

  const handleCategoryClick = (category: string) => {
    dispatch(setFilteredCategory(category));
  };

  return (
    <div className={styles.summary_container}>
      {orderedCategories.map((category) => (
        <button
          key={category}
          className={`${styles.summary_button} ${
            category !== "All" && category === filteredCategory
              ? styles.active
              : ""
          }`}
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
