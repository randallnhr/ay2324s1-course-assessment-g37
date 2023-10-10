import React, { ChangeEvent } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import styles from "./QuestionFilter.module.css";

interface QuestionFilterProps {
  onAttemptFilterChange: (attempted: string) => void;
  onDifficultyFilterChange: (difficulty: string) => void;
}

const QuestionFilter: React.FC<QuestionFilterProps> = ({
  onAttemptFilterChange,
  onDifficultyFilterChange,
}) => {
  const [attempted, setAttempted] = React.useState<string>("all");
  const [difficulty, setDifficulty] = React.useState<string>("all");

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

  return (
    <div className={styles.filter_container}>
      <Box sx={{ minWidth: 250 }}>
        <FormControl fullWidth>
          <InputLabel id="attempted-label">Attempted</InputLabel>
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
          <InputLabel id="difficulty-label">Difficulty</InputLabel>
          <Select
            labelId="difficulty-label"
            id="difficulty-select"
            value={difficulty}
            label="Difficulty"
            onChange={handleDifficultyFilterChange}
          >
            <MenuItem value="all">All Levels</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </div>
  );
};

export default QuestionFilter;
