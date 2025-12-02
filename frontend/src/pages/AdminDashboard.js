import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Admin Dashboard</h1>
        <div>
          <button 
            onClick={handleBackToHome}
          >
            Back to Home
          </button>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc3545',
              color: 'white'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div>
        <h3>Welcome, {user.name || user.email}!</h3>
        <p>Role: {user.role}</p>
        <p>Email: {user.email}</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
