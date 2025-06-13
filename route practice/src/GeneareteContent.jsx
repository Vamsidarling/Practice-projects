import axios from "axios";
import { useState } from "react";
import { userAuth } from "./AuthContext"; // Import userAuth to check user status
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate for redirection and Link for navigation

export default function GeneareteContent() {
  const { user } = userAuth(); // Get the current user from context
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [question, setQuestion] = useState("");

  const Generate = async (e) => {
    e.preventDefault();

    // Safeguard: If for some reason this function is called without a user,
    // (e.g., if UI wasn't updated yet), redirect to signin.
    if (!user) {
      alert("Please sign in to generate content."); // Simple prompt
      // navigate("/Signin"); // Redirect to the sign-in page
      return; // Stop further execution of the Generate function
    }

    try {
      console.log("Attempting to generate content for question:", question);
      const resp = await axios.post(
        "http://localhost:3000/user/GenerateData",
        { question: question },
        { withCredentials: true }
      );
      console.log("API Response:", resp);
      console.log("Generated Data:", resp.data);
      // TODO: Handle the successful response, e.g., display the generated content
      // or navigate to a different page if needed.
      // Example: navigate("/content-display-page");
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Please try again."); // User-friendly error
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Enter your input to generate content"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={Generate}>Generate</button>
    </>
    
  );
}
