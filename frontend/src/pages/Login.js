import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const hostname = process.env.REACT_APP_HOSTNAME || "127.0.0.1";
const port = process.env.REACT_APP_PORT || 3001;
const API_BASE_URL = `http://${hostname}:${port}`;

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      });

      // Store email temporarily for OTP verification
      sessionStorage.setItem("tempEmail", email);

      alert(response.data.message || "OTP sent to your email");

      // Redirect to OTP verification page
      navigate("/verify-otp");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.errorMessage || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Interview Prep - Login</h1>

      {error && <div className="login-error">{error}</div>}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Sending OTP..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
