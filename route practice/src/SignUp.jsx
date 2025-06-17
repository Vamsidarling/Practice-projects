import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { userAuth } from "./AuthContext";
import { useNavigate,Link } from "react-router-dom";
import { toast } from 'react-toastify';

export default function SignUp() {
    const { login } = userAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const nameInputRef = useRef(null); // Create a ref for the first input (name)

    useEffect(() => {
        // Focus the name input field when the component mounts
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3000/user/signup", {
                name,
                email,
                password,
                fname,
                lname,
                
            }, { withCredentials: true });
            // login({ name, email }); // Consider if user should log in automatically or go to signin page
            toast.success("Sign up successful! Please sign in."); // Inform user to sign in
            navigate("/signin");
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || "Sign-up failed. Please try again.";
            toast.error(errorMessage);
        }
    }

    return (
        <div className="auth-form-container"> {/* Optional: for centering or specific page styling */}

            {/* <h1>Sign  Up</h1> */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    ref={nameInputRef} // Attach the ref here
                    placeholder="Enter your username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Enter your email"
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
                <input
                    type="text"
                    placeholder="Enter your First name"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Enter your last name"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    required
                />
                <button type="submit">SignUp</button>
            </form>
            <div className="auth-form-link-container">
                <p>Already have an account?</p>
                <Link to="/Signin">
                    <button className="secondary">Signin</button> {/* Example of using secondary button style */}
                </Link>
            </div>
        </div>
    );
}