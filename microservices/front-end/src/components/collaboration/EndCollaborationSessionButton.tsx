import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { CSSProperties, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../../store/hook";
import { DialogContentText } from "@mui/material";

interface EndCollaborationSessionButtonProps {
  socket: Socket | undefined;
}

const saveCodeStyles: CSSProperties = {
  backgroundColor: "#1976D2",
  color: "white",
  padding: "0.4rem 0.6rem",
  borderRadius: "0.3rem",
  fontSize: "0.9rem",
};

function EndCollaborationSessionButton({
  socket,
}: EndCollaborationSessionButtonProps): JSX.Element {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isDirtyEditor = useAppSelector((state) => state.isDirtyEditor);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleConfirm = () => {
    if (!socket) {
      return;
    }

    socket.disconnect();
    navigate("/find-match");
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
      >
        End session
      </Button>

      <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
        <DialogTitle>
          Are you sure you want to end the collaboration session?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {isDirtyEditor ? (
              <>
                <strong>Warning</strong>: You have{" "}
                <span style={{ color: "red" }}>unsaved changes</span> in the
                code editor.
                <br />
                <br />
                You can save your code via the{" "}
                <span style={saveCodeStyles}>SAVE CODE...</span> button
              </>
            ) : (
              <>All your changes are saved</>
            )}
          </DialogContentText>
        </DialogContent>
        <></>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EndCollaborationSessionButton;
