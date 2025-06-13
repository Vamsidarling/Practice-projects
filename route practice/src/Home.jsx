import { Link } from "react-router-dom";
import { userAuth } from "./AuthContext";

export default function Home() {
    const {user } = userAuth();
   // Add more routes and components as needed to create a fully functional social media app.
  return (
    <div>
      <>
      <nav>
        <h1>Social Media</h1>
        <Link to="/Home">Home</Link>
        {user ? ( <span>Welcome {user.name}</span> | <button onClick={logout}>Logout</button> ) : (
         <><Link to="/SignUp">
                          <button>SignUp</button>
                      </Link><Link to="/Signin">
                              <button>Signin</button>
                          </Link></>)}
        </nav>
      </>
    </div>   
  )
}
