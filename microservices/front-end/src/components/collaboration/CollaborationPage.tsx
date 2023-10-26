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

function CollaborationPage() {
  const COLLAB_SERVICE_URL = "http://localhost:3111";
  const navigate = useNavigate();
  const { roomId, difficulty } = useParams();
  const [socket, setSocket] = useState<Socket>();
  const [modalText, setModalText] = useState<string>("");

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
  }, []);

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
        <div className={classes.questions_code_container}>
          <CollabQuestionPage difficulty={difficulty as QuestionComplexity} />
          <Editor socket={socket} />
        </div>
        <div className={classes.chat_output_container}>
          <div style={{ width: "100%" }}>
            <Chat socket={socket} />
          </div>
          <div style={{ width: "100%", backgroundColor: "#64f4f4" }}>
            code output
          </div>
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
