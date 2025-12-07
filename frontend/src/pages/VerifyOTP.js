import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SimpleHeader from "./SimpleHeader";
import "../styles/VerifyOTP.css";

function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const email = sessionStorage.getItem('tempEmail');

    if (!email) {
      setError('Session expired. Please login again.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      const response = await api.post('/users/verify-login', {
        email,
        otp
      });

      // Store JWT token
      localStorage.setItem('token', response.data.token);

      // Store user info
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Clear temporary email
      sessionStorage.removeItem('tempEmail');

      // Show success message
      alert('Login successful!');

      // Redirect based on role
      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.errorMessage || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SimpleHeader />
      <div className="otp-container">
        <div className="otp-card">
          <h1>Verify OTP</h1>
          <p>Enter the 6-digit code sent to your email</p>

          {error && (
            <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              required
              maxLength={6}
              pattern="[0-9]{6}"
              disabled={loading}
            />
            <button type="submit" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <p style={{ marginTop: "20px" }}>
            <a href="/login">← Back to Login</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default VerifyOTP;
