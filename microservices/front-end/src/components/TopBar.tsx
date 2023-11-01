// Use a separate component in nested routing to save repetitive codes
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";
import { User } from "./types";

import { Outlet } from "react-router-dom"; // allow render nested routes
import authServiceUrl from "../utility/authServiceUrl";

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

  const handleHistory = () => {
    navigate("/history");
  };

  const handleFindMatch = () => {
    navigate("/find-match");
  };

  const handleQuestion = () => {
    navigate("/question-bank");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSignout = () => {
    axios
      .delete(`${authServiceUrl}/api/auth/log-out`, { withCredentials: true })
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
          <Button color="inherit" onClick={handleFindMatch}>
            Find Match
          </Button>
          <Button color="inherit" onClick={handleQuestion}>
            Question
          </Button>
          <Button color="inherit" onClick={handleHistory}>
            History
          </Button>
          <Button color="inherit" onClick={handleProfile}>
            Profile
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
