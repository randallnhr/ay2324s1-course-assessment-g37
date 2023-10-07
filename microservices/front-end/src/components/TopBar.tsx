// Use a separate component in nested routing to save repetitive codes
import { AppBar } from "@mui/material";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";
import { User } from "./types";

import { Outlet } from "react-router-dom"; // allow render nested routes

const TopBar: React.FC = () => {
  const { currentUser, setCurrentUser } = useUserContext();
  const navigate = useNavigate();

  const isAuthenticated =
    currentUser && Object.keys(currentUser).length != 0 && currentUser.username;
    
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <></>;
  }

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
