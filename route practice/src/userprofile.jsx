import { userAuth } from "./AuthContext";
import Home from "./Home";
import { Navigate } from "react-router-dom";
export function ProfileWrapper() {
  const { user } = userAuth();

  return (
    <div>
      <>
      </>
      {/* The PrivateRoute component already ensures that 'user' is not null 
             when this component is rendered. So, the conditional check for 'user' was redundant. */}
      {/* 
      TODO: Replace placeholder text with actual profile content */}
      
      <h2>Welcome to your profile, {user.name}!</h2>
      <Navigate to="/Home"  />
    </div>
  );
}
