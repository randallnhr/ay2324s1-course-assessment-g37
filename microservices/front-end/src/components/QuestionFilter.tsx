import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./QuestionFilter.module.css";
import CloseIcon from "@mui/icons-material/Close";

import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  setAttempted,
  setDifficulty,
  setSortBy,
  setLocalSearchQuery,
} from "../store/slices/questionFilterSlice";

const QuestionFilter: React.FC = () => {
  const [inputValue, setInputValue] = useState(""); // set one for handling search value

  const dispatch = useAppDispatch();
  const { attempted, difficulty, sortBy } = useAppSelector(
    (state) => state.questionFilter
  );

  const handleAttemptFilterChange = (event: SelectChangeEvent<string>) => {
    dispatch(setAttempted(event.target.value as string));
  };

  const handleDifficultyFilterChange = (event: SelectChangeEvent<string>) => {
    dispatch(setDifficulty(event.target.value as string));
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    dispatch(setSortBy(event.target.value as string));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className={styles.filter_container}>
      <Box sx={{ minWidth: 250 }}>
        <FormControl fullWidth>
          <InputLabel id="attempted-label">Status</InputLabel>
          <Select
            labelId="attempted-label"
            id="attempted-select"
            value={attempted}
            label="Attempted"
            onChange={handleAttemptFilterChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Attempted">Attempted</MenuItem>
            <MenuItem value="Unattempted">Unattempted</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ minWidth: 250 }}>
        <FormControl fullWidth>
          <InputLabel id="difficulty-label">Level</InputLabel>
          <Select
            labelId="difficulty-label"
            id="difficulty-select"
            value={difficulty}
            label="Difficulty"
            onChange={handleDifficultyFilterChange}
          >
            <MenuItem value="All">All Levels</MenuItem>
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ minWidth: 250 }}>
        <FormControl fullWidth>
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            id="sort-select"
            value={sortBy}
            label="Sort By"
            onChange={handleSortChange} // New handler for sorting
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="Title">Title</MenuItem>
            <MenuItem value="Complexity">Complexity</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Added Search Bar */}
      <Paper
        component="form" // this is rendering Paper as a HTML form!
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 300,
          boxShadow: "none",
          border: "1px solid rgba(0, 0, 0, 0.23)",
        }}
        onSubmit={(e) => {
          e.preventDefault(); // Prevent refreshing the page every time user press enter
          dispatch(setLocalSearchQuery(inputValue)); // let the submit handle stuff
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Questions"
          inputProps={{ "aria-label": "search questions" }}
          value={inputValue}
          onChange={handleInputChange}
        />
        {inputValue && (
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="clear search"
            onClick={() => {
              setInputValue("");
              dispatch(setLocalSearchQuery(""));
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    </div>
  );
};

export default QuestionFilter;
