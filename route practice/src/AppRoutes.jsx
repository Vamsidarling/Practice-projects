import SignUp from "./SignUp";
import Signin from "./Signin";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import { ProfileWrapper } from "./userprofile";
import { userAuth } from "./AuthContext";
import Home from "./Home";
import { HashRouter as Router } from "react-router-dom";
<Router basename="/Practice-projects"></Router>
// import Sidebar from "./SideBar";
// import GeneareteContent from "./GeneareteContent";
function PrivateRoute({ children }) {
  const { user } = userAuth();
  return user ? children : <Navigate to="/Home" />;
}

export default function AppComponent() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <PrivateRoute>
              <ProfileWrapper />
            </PrivateRoute>
          }
        />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Home" element={<Home />} />
        <Route
          path="/Profile"
          element={
            <PrivateRoute>
              <ProfileWrapper />
            </PrivateRoute>
          }
        />
        {/* <Route path="/sliderBar" element={<Sidebar />} /> */}
        <Route path="*" element={<Navigate to="/Home" />} />
      </Route>
    </Routes>
  );
}
