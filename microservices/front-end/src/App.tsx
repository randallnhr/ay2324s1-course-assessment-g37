// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { useUserContext } from "./UserContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuestionBank from "./components/MainQuestionBank";
import ChangePasswordPage from "./components/ChangePasswordPage";
import ChangeDisplayName from "./components/ChangeDisplayName";
import ProfilePage from "./components/ProfilePage";
import Login from "./components/Login";
import Register from "./components/Register";
import { User } from "./components/types";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet, HelmetProvider } from "react-helmet-async";
import TopBar from "./components/TopBar";
import HomePage from "./components/HomePage";
import SuccessSnackbar from "./components/SuccessSnackbar";

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
      <Helmet>
        <title>PeerPrep</title>
      </Helmet>

      <SuccessSnackbar />

      <Router>
        {Object.keys(currentUser).length === 0 ? (
          <></>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/" element={<TopBar />}>
              {/* TopBar should appear in all these 4 pages */}
              <Route path="/question-bank" element={<QuestionBank />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route
                path="/change-display-name"
                element={<ChangeDisplayName />}
              />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="/*" element={<div>404 Page Not Found</div>} />
          </Routes>
        )}
      </Router>
    </HelmetProvider>
  );
}

export default App;
