import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Import useState and useEffect
import { userAuth } from "./AuthContext";

// import Home from "./Home";
export default function Layout() {
  const { user, logout } = userAuth();
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Optional: Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('app-theme');
    return savedTheme || 'dark'; // Default to dark if no preference saved
  });

  const handleLogout = () => {
    logout();
    navigate("/Home");
  };

  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${currentTheme}-theme`);
    localStorage.setItem('app-theme', currentTheme); // Optional: Save preference
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <header className="app-header">
        <div>
          {/* 
            The <navigate> tag was incorrect. Use <Link> from react-router-dom.
            To make it look like text, style the Link component itself.
          */}
          <Link to="/Home" className="brand-link">
            {/* <button>Home</button> */}
            {/* 'navistyle' was a typo, it should be 'style'. */}
            <h1>Social Media</h1>
          </Link>
        </div>
        <nav>
          <button onClick={toggleTheme} className="theme-toggle">
            Switch to {currentTheme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
          {/* <Link to="/Home" style={{ marginRight: '15px' }}>
                        <button>Home</button>
                    </Link> */}
          {user ? (
            <>
              <span className="user-greeting">Welcome, {user.name}</span>
              <button onClick={handleLogout}>
                Logout
              </button>
            </>
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
        <Outlet />
      </main>
    </>
  );
}
