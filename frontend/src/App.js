import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import QuestionSearchForm from "./pages/forms/QuestionSearchForm";
import Results from './pages/Results';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<QuestionSearchForm />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;