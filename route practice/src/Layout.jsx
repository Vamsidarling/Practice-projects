import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react"; // Import useEffect and useRef
import { userAuth } from "./AuthContext";
import Sidebar from "./SideBar"; // Import the Sidebar component
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';

export default function Layout() {
  const  {user, logout } = userAuth(); // Get logout from userAuth
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility, default to open
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null); // To store the selected history item
  const [newSessionKey, setNewSessionKey] = useState(Date.now()); // Key to trigger new session in GeneareteContent
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const handleNewGenerationSession = () => {
    console.log("Layout: Start new generation session");
    setSelectedHistoryItem(null); // Clear any selected history
    setNewSessionKey(Date.now()); // Update the key to trigger a new session

    // Clear selected history when starting a new session
    toast.info("New generation session started!");
    // This could navigate to a specific route or reset state in GeneareteContent
    // For example, if GeneareteContent clears its state based on a prop or context:
    navigate('/Home'); // Assuming Home shows GeneareteContent
    // You might need a more sophisticated way to signal GeneareteContent to reset.
  };

  const handleLoadHistoryItem = (historyItem) => {
    console.log("Layout: Loading history item", historyItem);
    setSelectedHistoryItem(historyItem);
    // toast.info(`Loaded history: ${historyItem.question.substring(0,20)}...`);
    navigate('/Home'); // Navigate to where GeneareteContent is displayed
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out.");
    setIsProfileDropdownOpen(false); // Close dropdown
    navigate("/Home");
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
const ViewProfile = () => {
  navigate("/Profile"); // Navigate to Profile page
  setIsProfileDropdownOpen(false); // Close the dropdown
}
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000} // Auto close toasts after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    <div className={`app-container-with-sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {user && isSidebarOpen && (
        <Sidebar
          onNewGeneration={handleNewGenerationSession}
          onLoadHistory={handleLoadHistoryItem} // Pass the new handler to Sidebar
        />
      )}
      <div className={`main-content-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="app-header">
          <div className="header-left-section">
            {user && ( /* Show toggle button only if user is logged in and sidebar is relevant */
              <button onClick={toggleSidebar} className="sidebar-toggle-button">
                ☰ {/* Hamburger Icon, replace with SVG if desired */}
              </button>
            )}
            <Link to="/Home" className="brand-link" style={{ marginLeft: user ? '1rem' : '0' }}>
              {/* Add margin to brand link if toggle button is present */}
              <h1>Social Media</h1>
            </Link>
          </div>
          <nav>
            {user ? (
              <div className="profile-menu-widget-container" ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="profile-menu-trigger-button header-profile-trigger" /* Added header-profile-trigger for specific styling */
                  aria-expanded={isProfileDropdownOpen}
                  aria-controls="header-profile-options-menu"
                  title={user.name || "User Profile"} // Tooltip for hover
                >
                  {/* Display first letter of user's name or a default icon/letter */}
                  <span className="profile-icon-initials">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'P'}
                  </span>
                  <span className={`dropdown-arrow ${isProfileDropdownOpen ? 'open' : ''}`}></span> {/* Arrow will be styled via CSS */}
                </button>
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown-menu-on-page header-profile-dropdown" id="header-profile-options-menu" role="menu">
                    <div className="dropdown-item user-greeting-item" role="menuitem">
                      Signed in as in teh <br />
                      <strong>{user.name}</strong>
                      <button onClick={ViewProfile}>View Profile Page</button>
                    </div>
                    {/* <Link to="/" className="dropdown-item" role="menuitem" onClick={() => setIsProfileDropdownOpen(false)}>View Profile Page</Link> */}
                    <button onClick={handleLogout} className="dropdown-item logout-item" role="menuitem">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/SignUp">
                  <button>SignUp</button>
                </Link>
                <Link to="/Signin">
                  <button>Signin</button>
                </Link>
              </>
            )}
          </nav>
        </header>
        <main className="app-main-content">
          <Outlet context={{ 
            selectedHistoryItem, 
            clearSelectedHistory: () => setSelectedHistoryItem(null),
            newSessionKey // Pass the new session key
          }} />
        </main>
      </div>
    </div>
    </>
  );
}
