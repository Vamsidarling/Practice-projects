import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Attempt to load user data from localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem('user'); // Clear corrupted data
        return null;
      }
    }
    return null;
  });

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData)); // Save user data to localStorage
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user'); // Remove user data from localStorage
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function userAuth() {
  return useContext(AuthContext);
}