// Link and userAuth are no longer needed here if the local nav is removed
// import { Link } from "react-router-dom";
// import { userAuth } from "./AuthContext";
import GeneareteContent from "./GeneareteContent";

export default function Home() {
  // const { user, logout } = userAuth(); // No longer needed if local nav is removed
  // Add more routes and components as needed to create a fully functional social media app.
  return (
    <div>
      {/* The navigation bar previously here is now handled globally by Layout.jsx */}
      <GeneareteContent />
      {/* You can add other Home page specific content below */}
    </div>
  );
}
