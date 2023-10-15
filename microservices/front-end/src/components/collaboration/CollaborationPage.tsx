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
import { useNavigate } from "react-router-dom";

function CollaborationPage() {
  const COLLAB_SERVICE_URL = "http://localhost:3111";
  const navigate = useNavigate();

  const [socket, setSocket] = useState<Socket>();
  const [modalText, setModalText] = useState<string>("");

  useEffect(() => {
    const socket = io(COLLAB_SERVICE_URL, { query: { roomId: "123" } });
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("other user has left", () => {
      setModalText("The other user has left the room.");
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
          {modalText === "Waiting for the other user." && <CircularProgress />}
          {modalText === "The other user has left the room." && (
            <Button variant="contained" onClick={() => navigate("/find-match")}>
              {" "}
              Go back to home page
            </Button>
          )}
        </Box>
      </Modal>
      <Editor socket={socket} />
    </>
  );
}

export default CollaborationPage;
