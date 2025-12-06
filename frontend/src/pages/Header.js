import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="app-header">
      <h1 className="logo">InterviewPrep</h1>

      <div className="header-right">
        <NavLink
          to="/home"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Search
        </NavLink>

        {/* if a user is admin, show Admin Dashboard */}
        {user.role === "admin" && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Admin Dashboard
          </NavLink>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
