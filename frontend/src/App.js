import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import QuestionSearchForm from "./pages/forms/QuestionSearchForm";
import Results from './pages/Results';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';import Header from "./pages/Header";
import SimpleHeader from "./pages/SimpleHeader";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <>
              <SimpleHeader />
              <Login />
            </>
          }
        />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Protected routes - require login */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Header />
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Header />
              <QuestionSearchForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Header />
              <Results />
            </ProtectedRoute>
          }
        />

        {/* Admin-only route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Header />
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
