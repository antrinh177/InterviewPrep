import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const hostname = process.env.REACT_APP_HOSTNAME || "127.0.0.1";
const port = process.env.REACT_APP_PORT || 3001;
const API_BASE_URL = `http://${hostname}:${port}`;

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
      const response = await axios.post(`${API_BASE_URL}/users/verify-login`, {
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
    <div>
      <h1>Verify OTP</h1>
      <p>Enter the 6-digit code sent to your email</p>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="otp">OTP Code:</label>
          <br />
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            required
            maxLength={6}
            pattern="[0-9]{6}"
            disabled={loading}
            style={{ 
              width: '300px', 
              padding: '12px', 
              marginBottom: '15px',
              fontSize: '18px',
              letterSpacing: '5px',
              textAlign: 'center'
            }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || otp.length !== 6} 
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <p style={{ marginTop: '20px' }}>
        <a href="/login" style={{ color: '#667eea' }}>← Back to Login</a>
      </p>
    </div>
  );
}

export default VerifyOTP;
