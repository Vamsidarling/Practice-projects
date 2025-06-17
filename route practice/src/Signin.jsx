import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { userAuth } from "./AuthContext";
import { useNavigate ,Link} from "react-router-dom";
import { toast } from 'react-toastify';

export default function Signin() {
  const { login } = userAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailInputRef = useRef(null); // Create a ref for the email input

  useEffect(() => {
    // Focus the email input field when the component mounts
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  async function handleSignin(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/user/signin",
        {
          email,password
        },
        { withCredentials: true }
      );
      login({
        name: email.split("@")[0],
        email: email,
      });
      toast.success("Signed in successfully!");
      navigate("/Home"); // Redirect to home page after successful login
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Sign-in failed. Please check your credentials.";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="auth-form-container"> {/* Optional: for centering or specific page styling */}
      <form onSubmit={handleSignin}>
        <input
          type="email"
          ref={emailInputRef} // Attach the ref here
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign in</button>
      </form>
      <div className="auth-form-link-container">
        <p>Don't have an account?</p>
        <Link to="/Signup">
          <button className="secondary">Signup</button> {/* Example of using secondary button style */}
        </Link>
      </div>
    </div>
  );
}
