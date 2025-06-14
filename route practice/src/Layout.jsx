import { Outlet, Link, useNavigate } from "react-router-dom";
import { userAuth } from "./AuthContext";

export default function Layout() {
  const { user, logout } = userAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/Home");
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
          {/* Navigation links can go here */}
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
