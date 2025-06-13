import { useState } from "react";
import axios from "axios";
import { userAuth } from "./AuthContext";
import { useNavigate ,Link} from "react-router-dom";

export default function Signin() {
  const { login } = userAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      // console.log(res.data);
      navigate("/Details"); // Redirect to home page after successful login
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <form onSubmit={handleSignin}>
        <input
          type="email"
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
         <p>ALready have an account?</p>
            <Link to = "/Signup">
            <button> Signup </button>
            </Link>
    </>
  );
}
