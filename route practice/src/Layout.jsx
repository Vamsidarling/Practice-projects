import { Outlet, Link, useNavigate } from "react-router-dom";
import { userAuth } from "./AuthContext";

// Home import is not used directly in Layout's JSX, can be removed
// import Home from "./Home";
export default function Layout() {
  const { user, logout } = userAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/Home");
  };

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          borderBottom: "1px solid #eee",
          marginBottom: "20px",
        }}
      >
        <div>
          {/* 
            The <navigate> tag was incorrect. Use <Link> from react-router-dom.
            To make it look like text, style the Link component itself.
          */}
          <Link to="/Home" style={{ textDecoration: 'none', color: 'inherit' }}>
            {/* <button>Home</button> */}
            {/* 'navistyle' was a typo, it should be 'style'. */}
            <h1 style={{ margin: 0, fontSize: "1.5em" }}>Social Media</h1>
          </Link>
        </div>
        <nav>
          {/* style={{ display: 'flex', alignItems: 'center' }} */}
          {/* <Link to="/Home" style={{ marginRight: '15px' }}>
                        <button>Home</button>
                    </Link> */}
          {user ? (
            <>
              <span style={{ marginRight: "15px" }}>Welcome, {user.name}</span>
              <button onClick={handleLogout} style={{ padding: "5px 10px" }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/SignUp" style={{ marginRight: "10px" }}>
                <button>SignUp</button>
              </Link>
              <Link to="/Signin">
                <button>Signin</button>
              </Link>
            </>
          )}
        </nav>
      </header>
      <main style={{ padding: "0 20px" }}>
        {" "}
        {/* Added padding to main content area */}
        <Outlet />
      </main>
    </>
  );
}
