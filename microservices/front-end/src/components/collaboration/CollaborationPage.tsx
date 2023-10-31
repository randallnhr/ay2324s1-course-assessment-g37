import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import Editor from "./Editor";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import classes from "./CollaborationPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import CollabQuestionPage from "./CollabQuestionPage";
import { QuestionComplexity } from "../types";
import Chat from "../chat/Chat";
import Output from "./Output";

function CollaborationPage() {
  const COLLAB_SERVICE_URL =
    import.meta.env.VITE_COLLAB_SERVICE_URL ?? "http://127.0.0.1:3111";
  const navigate = useNavigate();
  const { roomId, difficulty } = useParams();
  const [socket, setSocket] = useState<Socket>();
  const [modalText, setModalText] = useState<string>("");
  const [stdout, setStdout] = useState<string>("");
  const [isOutputLoading, setIsOutputLoading] = useState<boolean>(false);

  const handleEndSession = () => {
    if (!socket) return;
    socket.disconnect();
    navigate("/find-match");
  };

  useEffect(() => {
    const socket = io(COLLAB_SERVICE_URL, { query: { roomId: roomId } });
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("room count", (count) => {
      if (count === 1) {
        setModalText("Waiting for the other user.");
      } else {
        setModalText("");
      }
    });
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <>
      <Modal open={!!modalText}>
        <Box className={classes.modal}>
          <Typography variant="h5" style={{}}>
            {modalText}
          </Typography>
          {modalText === "Waiting for the other user." && (
            <>
              <CircularProgress />
              <Button
                variant="contained"
                onClick={() => navigate("/find-match")}
              >
                {" "}
                Go back to home page
              </Button>
            </>
          )}
        </Box>
      </Modal>

      <div className={classes.collab_container}>
        <div className={classes.grid_question}>
          <CollabQuestionPage difficulty={difficulty as QuestionComplexity} />
        </div>
        <div className={classes.grid_editor}>
          <Editor
            socket={socket}
            setStdout={setStdout}
            setIsOutputLoading={setIsOutputLoading}
          />
        </div>
        <div className={classes.grid_chat}>
          <Chat socket={socket} />
        </div>
        <div className={classes.grid_code_output}>
          {isOutputLoading ? (
            <CircularProgress
              style={{ position: "relative", top: "50%", left: "50%" }}
            />
          ) : (
            <Output stdout={stdout} />
          )}
        </div>
      </div>

      <Button
        variant="contained"
        onClick={handleEndSession}
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
      >
        End session
      </Button>
    </>
  );
}

export default CollaborationPage;
