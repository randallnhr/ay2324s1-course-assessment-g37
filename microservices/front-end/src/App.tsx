// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'


import './App.css'
import { UserProvider } from './UserContext'
import LoginPage from './components/LoginPage'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import QuestionBank from './components/MainQuestionBank'
import SignupPage from './components/SignupPage';
import ChangePasswordPage from './components/ChangePasswordPage';
import ChangeDisplayName from './components/ChangeDisplayName';
import ProfilePage from './components/ProfilePage';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path = "/login" element = {<LoginPage/>} />
          <Route path='/question-bank' element = {<QuestionBank/> } />
          <Route path = "/signup" element = {<SignupPage /> } />
          <Route path = "/change-password" element = {<ChangePasswordPage /> } />
          <Route path = "/change-display-name" element = {<ChangeDisplayName /> } />
          <Route path = "/profile" element = {<ProfilePage /> } />
          <Route path="*" element={<Navigate to="/login" />} /> {/* Catch-all route */}
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
