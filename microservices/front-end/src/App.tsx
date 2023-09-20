// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'


import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import QuestionBank from './components/MainQuestionBank'
// import LoginPage from './components/LoginPage'
// import SignupPage from './components/SignupPage';
// import ChangePasswordPage from './components/ChangePasswordPage';
// import ChangeDisplayName from './components/ChangeDisplayName';
// import UserContext from './UserContext';
// import React, { useState } from 'react';
// import { User } from './components/types';

// function App() {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);

//   return (
//     <UserContext.Provider value = {{currentUser, setCurrentUser}}>
//       <Router>
//         <Routes>
//           <Route path = "/login" element = {<LoginPage/>} />
//           <Route path='/question-bank' element = {<QuestionBank/> } />
//           <Route path = "/signup" element = {<SignupPage /> } />
//           <Route path = "/change-password" element = {<ChangePasswordPage /> } />
//           <Route path = "/change-display-name" element = {<ChangeDisplayName /> } />
//           <Route path="*" element={<Navigate to="/login" />} /> {/* Catch-all route */}
//         </Routes>
//       </Router>
//     </UserContext.Provider>     
//   )
// }

import './App.css'
import { UserProvider } from './UserContext'
import LoginPage from './components/LoginPage'

function App() {
  return (
    <UserProvider>
      <LoginPage></LoginPage>
    </UserProvider>
  )
}

export default App
