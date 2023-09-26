// Use a separate component in nested routing to save repetitive codes
import React from "react";
import { AppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useUserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "./types";

import { Outlet } from "react-router-dom"; // allow render nested routes

const TopBar: React.FC = () => {
  const { currentUser, setCurrentUser } = useUserContext();
  const navigate = useNavigate();

  const handleQuestion = () => {
    navigate("/question-bank");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSignout = () => {
    axios
      .delete("/api/auth/log-out")
      .then((response) => {
        if (response.status === 200) {
          // reset user context
          setCurrentUser({} as User);
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
        alert("Failed to sign out, please try again!");
      });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography fontSize="1.5rem" style={{ flexGrow: 1 }}>
            HOME
          </Typography>
          <Button color="inherit" onClick={handleProfile}>
            Profile
          </Button>
          <Button color="inherit" onClick={handleQuestion}>
            Question
          </Button>
          <Button color="inherit" onClick={handleSignout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet /> {/* This will render the nested route */}
    </>
  );
};

export default TopBar;
