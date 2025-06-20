import { Link } from "react-router-dom"; // Import Link for navigation
import { userAuth } from "./AuthContext"; // Import userAuth to check login status
import GeneareteContent from "./GeneareteContent";

export default function Home() {
  const { user } = userAuth(); // Get user status
  // Add more routes and components as needed to create a fully functional social media app.
  return (<>
      {!user ? (
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Meet Your AI Content Co-pilot</h1>
            <p className="hero-subtitle">
              Unlock your creative potential with our AI-powered content generation platform.
              Effortlessly craft compelling tweets, brainstorm innovative ideas, and produce engaging text for any purpose.
              Let our intelligent assistant be your partner in creation.
            </p>
            {/* The "Try Now" button in the hero section will always lead to Signin if the hero is shown */}
            <Link to="/Signin" className="hero-cta-link">
              <button className="hero-cta-button">Try Now</button>
            </Link>
          </div>
          {/* Optional: You could add a visual element here like an image or SVG */}
          {/* <div className="hero-visual">
            <img src="/path-to-your-hero-image.svg" alt="AI assistant illustration" />
          </div> */}
        </section>
      ) : (
        <>
          {/* Optionally, you could have a different, smaller welcome message here for logged-in users */}
          {/* <div className="welcome-message-loggedin">
            <h2>Welcome back, {user.name}!</h2>
            <p>Ready to generate some amazing content?</p>
          </div> */}
          <GeneareteContent />
        </>
      )}
    </>);
}
