import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  // Fetch all users on mount
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
      setError(err.response?.data?.errorMessage || "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDeleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${userName}?`
    );
    if (!confirmDelete) return;

    try {
      await userAPI.delete(userId);
      fetchUsers();
      alert(`User ${userName} deleted successfully`);
    } catch (err) {
      alert(err.response?.data?.errorMessage || "Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all required fields");
      return;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await userAPI.create(formData);
      alert(`User ${formData.name} created successfully`);
      setFormData({ name: "", email: "", password: "", role: "user" });
      setShowCreateForm(false);
      fetchUsers();
    } catch (err) {
      alert(
        err.response?.data?.errorMessage ||
          err.response?.data?.error ||
          "Failed to create user"
      );
      console.error("Error creating user:", err);
    }
  };

  const handleEditClick = (u) => {
    setEditingUser(u._id);
    setFormData({ name: u.name, email: u.email, password: "", role: u.role });
    setShowCreateForm(false);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "user" });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Name and email are required");
      return;
    }

    try {
      await userAPI.update(editingUser, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });
      alert("User updated successfully");
      handleCancelEdit();
      fetchUsers();
    } catch (err) {
      alert(
        err.response?.data?.errorMessage ||
          err.response?.data?.error ||
          "Failed to update user"
      );
      console.error("Error updating user:", err);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      {/* Admin info */}
      <div className="dashboard-info">
        <h3>Welcome, {user.name || user.email}!</h3>
        <p>Role: {user.role}</p>
        <p>Email: {user.email}</p>
      </div>

      <hr />

      {/* Users table */}
      <h2>All Users</h2>
      {loading && <p>Loading users...</p>}
      {error && <p className="error-text">Error: {error}</p>}
      {!loading && !error && users.length === 0 && <p>No users found.</p>}

      {!loading && !error && users.length > 0 && (
        <table className="users-table">
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
                    className="edit-btn"
                    onClick={() => handleEditClick(u)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
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

      {/* Create/Edit form below table */}
      <div className="form-section">
        {/* Toggle create form */}
        {!editingUser && (
          <button
            className="toggle-form-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "Cancel" : "Create New User"}
          </button>
        )}

        {/* Create user form */}
        {showCreateForm && (
          <div className="form-container">
            <h3>Create New User</h3>
            <form className="dashboard-form" onSubmit={handleCreateUser}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
              />

              <label>Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <button className="create-btn" type="submit">
                Create User
              </button>
            </form>
          </div>
        )}

        {/* Edit user form */}
        {editingUser && (
          <div className="form-container">
            <h3>Edit User</h3>
            <form className="dashboard-form" onSubmit={handleUpdateUser}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <label>Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <button className="update-btn" type="submit">
                Update User
              </button>
              <button
                className="cancel-btn"
                type="button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
