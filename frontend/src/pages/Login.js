import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const hostname = process.env.REACT_APP_HOSTNAME || "127.0.0.1";
const port = process.env.REACT_APP_PORT || 3001;
const API_BASE_URL = `http://${hostname}:${port}`;

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password // Default: password123
      });

      // Store email temporarily for OTP verification
      sessionStorage.setItem('tempEmail', email);

      alert(response.data.message || 'OTP sent to your email');

      // Redirect to OTP verification page
      navigate('/verify-otp');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.errorMessage || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Interview Prep - Login</h1>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
            style={{ width: '300px', padding: '8px', marginBottom: '15px' }}
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
            style={{ width: '300px', padding: '8px', marginBottom: '15px' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {loading ? 'Sending OTP...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
