import React from "react";
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

interface QuestionFilterProps {
  onAttemptFilterChange: (attempted: string) => void;
  onDifficultyFilterChange: (difficulty: string) => void;
  onSortChange: (sortBy: string) => void;
}

const QuestionFilter: React.FC<QuestionFilterProps> = ({
  onAttemptFilterChange,
  onDifficultyFilterChange,
  onSortChange,
}) => {
  const [attempted, setAttempted] = React.useState<string>("");
  const [difficulty, setDifficulty] = React.useState<string>("");
  const [sortBy, setSortBy] = React.useState<string>("");

  const handleAttemptFilterChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setAttempted(value);
    onAttemptFilterChange(value);
  };

  const handleDifficultyFilterChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setDifficulty(value);
    onDifficultyFilterChange(value);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSortBy(value);
    onSortChange(value);
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
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="attempted">Attempted</MenuItem>
            <MenuItem value="unattempted">Unattempted</MenuItem>
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
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Title">Title</MenuItem>
            <MenuItem value="Complexity">Complexity</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Added Search Bar */}
      <Paper
        component="form"
        sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 300 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Questions"
          inputProps={{ "aria-label": "search questions" }}
        />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    </div>
  );
};

export default QuestionFilter;
