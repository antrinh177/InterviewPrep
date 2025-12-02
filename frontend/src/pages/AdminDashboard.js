import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getAll();
      setUsers(response.data.users || []);
    } catch (err) {
      setError(err.response?.data?.errorMessage || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDeleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${userName}?`);
    
    if (!confirmDelete) {
      return;
    }

    try {
      await userAPI.delete(userId);
      fetchUsers();
      alert(`User ${userName} deleted successfully`);
    } catch (err) {
      alert(err.response?.data?.errorMessage || 'Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await userAPI.create(formData);
      alert(`User ${formData.name} created successfully`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
      setShowCreateForm(false);
      
      // Refresh users list
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.errorMessage || err.response?.data?.error || 'Failed to create user');
      console.error('Error creating user:', err);
    }
  };

  return (
    <div>
      <div>
        <h1>Admin Dashboard</h1>
        <div>
          <button onClick={handleBackToHome}>Home</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div>
        <h3>Welcome, {user.name || user.email}!</h3>
        <p>Role: {user.role}</p>
        <p>Email: {user.email}</p>
      </div>

      <hr />

      <button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Cancel' : 'Create New User'}
      </button>

      {showCreateForm && (
        <div>
          <h3>Create New User</h3>
          <form onSubmit={handleCreateUser}>
            <div>
              <label>Name: </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label>Email: </label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label>Password: </label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange}
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label>Role: </label>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <button type="submit">Create User</button>
          </form>
        </div>
      )}

      <hr />

       <h2>All Users</h2>
      {loading && <p>Loading users...</p>}
      
      {error && <p>Error: {error}</p>}

      {!loading && !error && users.length === 0 && <p>No users found.</p>}

      {!loading && !error && users.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button 
                    onClick={() => handleDeleteUser(u._id, u.name)}
                    disabled={u._id === user._id || u._id === user.id}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
