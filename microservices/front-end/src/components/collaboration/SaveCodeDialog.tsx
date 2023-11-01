import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import { useCallback, useState } from "react";
import { useUserContext } from "../../UserContext";
import { useAppSelector } from "../../store/hook";
import { selectSortedFilteredQuestions } from "../../store/slices/questionFilterSlice";
import authServiceUrl from "../../utility/authServiceUrl";

interface SaveCodeDialogProps {
  getTextFunction: () => string | undefined;
  programmingLanguage: string;
}

function SaveCodeDialog({
  getTextFunction,
  programmingLanguage,
}: SaveCodeDialogProps): JSX.Element {
  const sortedQuestions = useAppSelector(selectSortedFilteredQuestions);
  const [open, setOpen] = useState(false);
  const [isPostingToHistoryService, setIsPostingToHistoryService] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formHelperText, setFormHelperText] = useState("");
  const [questionId, setQuestionId] = useState("");

  const { currentUser } = useUserContext();

  const handleOpen = useCallback(() => {
    setOpen(true);
    setIsPostingToHistoryService(false);
    setErrorMessage("");
    setFormHelperText("");
    // the selected question id will persist between dialog opens
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSave = useCallback(async () => {
    if (getTextFunction() === undefined) {
      window.alert("code editor text is undefined");
      return;
    }

    if (questionId === "") {
      setFormHelperText("Please select a question for this attempt");
      return;
    }

    setIsPostingToHistoryService(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${authServiceUrl}/api/history`,
        {
          username: currentUser.username,
          questionId: questionId,
          text: getTextFunction(),
          programmingLanguage: programmingLanguage,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        handleClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.message);
      } else {
        window.alert(error);
        console.error(error);
      }
    }
  }, [currentUser.username, handleClose, questionId, getTextFunction]);

  const handleQuestionIdSelectChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      setFormHelperText("");
      setQuestionId(e.target.value);
    },
    []
  );

  return (
    <>
      <Button
        variant="contained"
        style={{ minWidth: "140px" }}
        onClick={handleOpen}
      >
        Save Code...
      </Button>

      <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
        <DialogTitle>Save code to history</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: "1rem" }}>
            <InputLabel id="question-select-label">Question</InputLabel>
            <Select
              labelId="question-select-label"
              id="question-select"
              value={questionId}
              label="Question"
              onChange={handleQuestionIdSelectChange}
              error={formHelperText !== ""}
            >
              {sortedQuestions.map((each) => (
                <MenuItem key={each._id} value={each._id}>
                  {each.title}
                </MenuItem>
              ))}
            </Select>

            {formHelperText !== "" && (
              <FormHelperText error={true}>{formHelperText}</FormHelperText>
            )}
          </FormControl>

          {errorMessage !== "" && (
            <Alert severity="error" onClose={() => setErrorMessage("")}>
              <AlertTitle>Error</AlertTitle>
              Failed to update history: {errorMessage}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            endIcon={
              isPostingToHistoryService && <CircularProgress size={20} />
            }
            disabled={isPostingToHistoryService}
            onClick={handleSave}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SaveCodeDialog;
