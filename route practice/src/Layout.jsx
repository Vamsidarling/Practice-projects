import { Outlet, Link, useNavigate } from "react-router-dom";
import { userAuth } from "./AuthContext";
import Home from "./Home";

export default function Layout() {
    const { user, logout } = userAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/Home');
    }

    return (
        <>
            <header>
                {user ? (
                    <div>
                        <span style={{ marginRight: '10px' }}>Welcome, {user.name}</span>
                        <button onClick={handleLogout} style={{ padding: '5px 10px' }}>Logout</button>
                    </div>
                ) : (
                    <>
                        {/* <Link to="SignUp">
                            <button>SignUp</button>
                        </Link>
                        <span>This is in the header</span>
                        <Link to="Signin">
                            <button>Signin</button>
                        </Link> */}
                    </>
                )}
            </header>
            
            <Outlet />
        </>
    );
}