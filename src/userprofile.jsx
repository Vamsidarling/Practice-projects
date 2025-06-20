import { useState } from "react";
import { userAuth } from "./AuthContext";
import { useNavigate, Navigate, Link } from "react-router-dom"; // Added Navigate and Link
import { toast } from "react-toastify"; // Added toast import
// import './Profile.css'; // If you create Profile.css, uncomment this

export function ProfileWrapper() {
  const { user, logout } = userAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("view"); // 'view', 'edit', 'settings', 'security'

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out.");
    navigate("/Home");
  };
  // const handleSettings =() =>
  // {
  //   console.log("Settings");

  //   <button>Twitter Account</button>
  // }
  if (!user) {
    // Use the Navigate component for declarative navigation
    return <Navigate to="/Signin" replace />;
  }

  return (
    <div className="profile-page-container">
      {/* Sidebar */}
      <aside className="profile-sidebar">
        <h3>Profile Menu</h3>
        <ul>
          <li>
            <button
              onClick={() => setActiveSection("view")}
              className={`sidebar-button ${
                activeSection === "view" ? "active" : ""
              }`}
            >
              View Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("edit")}
              className={`sidebar-button ${
                activeSection === "edit" ? "active" : ""
              }`}
            >
              Edit Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("settings")}
              className={`sidebar-button ${
                activeSection === "settings" ? "active" : ""
              }`}
            >
              Account Settings
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("security")}
              className={`sidebar-button ${
                activeSection === "security" ? "active" : ""
              }`}
            >
              Security
            </button>
          </li>
          <div className="sidebar-logout-section">
            <button
              onClick={handleLogout}
              className="sidebar-button sidebar-logout-button" // Combined classes
            >
              Logout
            </button>
          </div>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="profile-main-content">
        {activeSection === "view" && (
          <div className="profile-section-card">
            <h2>Welcome, {user.name}!</h2>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {/* You can add more user details here from the user object if available */}
            <p className="text-muted">
              This is your profile overview. Select an option from the sidebar
              to manage your account.
            </p>
          </div>
        )}
        {activeSection === "edit" && (
          <div className="profile-section-card">
            <h2>Edit Profile</h2>
            <p>
              Here you can create a form to update your name, email (if
              allowed), bio, profile picture, etc.
            </p>
          </div>
        )}
        {activeSection === "settings" && (
          <div className="profile-section-card">
            <h2>Account Settings</h2>
            <p>
              Manage your notification preferences, or other
              application-specific settings.
            </p>
           
          </div>
        )}
        {activeSection === "security" && (
          <div className="profile-section-card">
            <h2>Security</h2>
            <p>
              Options to change your password, manage two-factor authentication,
              or view active sessions.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
