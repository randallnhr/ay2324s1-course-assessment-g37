// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { useUserContext } from "./UserContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import QuestionBank from "./components/MainQuestionBank";
import ChangePasswordPage from "./components/ChangePasswordPage";
import ChangeDisplayName from "./components/ChangeDisplayName";
import ProfilePage from "./components/ProfilePage";
import Login from "./components/Login";
import Register from "./components/Register";
import { User } from "./components/types";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { HelmetProvider } from "react-helmet-async";
import TopBar from "./components/TopBar";

// useContext: create a global state, that can be accessed by any component
function App() {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const { currentUser, setCurrentUser } = useUserContext();
  // Do this once at App launch. When app launches, all the previous data will be emptied, and useEffect will re-run

  useEffect(() => {
    if (Object.keys(currentUser).length === 0) {
      // initially currentUser = {}
      axios
        .get("/api/auth/current-user")
        .then((response) => {
          const userData: User = response.data;
          setCurrentUser(userData);
        })
        .catch((error) => {
          console.error("Error fetching current user", error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else {
      setIsFetching(false);
    }
  }, [currentUser, setCurrentUser]);

  return (
    <HelmetProvider>
      <Router>
        {Object.keys(currentUser).length === 0 ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isFetching}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <>
            {currentUser &&
            Object.keys(currentUser).length != 0 &&
            currentUser.username ? (
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/" element={<TopBar />}>
                  {/* TopBar should appear in all these 4 pages */}
                  <Route path="/question-bank" element={<QuestionBank />} />
                  <Route
                    path="/change-password"
                    element={<ChangePasswordPage />}
                  />
                  <Route
                    path="/change-display-name"
                    element={<ChangeDisplayName />}
                  />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/" element={<Navigate to="/question-bank" />} />
                  <Route path="/*" element={<div>404 Page Not Found</div>} />
                </Route>
              </Routes>
            ) : (
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/*" element={<div>404 Page Not Found</div>} />
              </Routes>
            )}
          </>
        )}
      </Router>
    </HelmetProvider>
  );
}

export default App;
