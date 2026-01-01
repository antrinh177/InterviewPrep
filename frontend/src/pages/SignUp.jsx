import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import '../styles/SignUp.css';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await userAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.errorMessage ||
        err.response?.data?.error ||
        'Failed to sign up'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Create Account</h1>
      <form className="dashboard-form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="Enter your name"
        />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          placeholder="Enter your email"
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          minLength={6}
          placeholder="Enter your password"
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          minLength={6}
          placeholder="Confirm your password"
        />
        {error && <div className="error">{error}</div>}
        <button className="create-btn-signup" type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <div className="login-link-container">
        Already have an account?{' '}
        <span
          className="login-link"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </span>
      </div>
    </div>
  );
}

export default SignUp;