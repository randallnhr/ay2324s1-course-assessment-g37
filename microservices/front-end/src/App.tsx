// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import "./App.css";
import { UserProvider } from "./UserContext";
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

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/question-bank" element={<QuestionBank />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/change-display-name" element={<ChangeDisplayName />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/login" />} />{" "}
          {/* Catch-all route */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
