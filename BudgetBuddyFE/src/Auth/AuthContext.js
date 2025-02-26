import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create Authentication Context
const AuthContext = createContext(null);

// Create Authentication Provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for logged in user when component mounts
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentUser(userData);
    
    // Redirect based on role
    if (userData.role === "admin") {
      navigate("/dashboard");
    } else if (userData.role === "hod") {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
  };

  // Check user role
  const isAdmin = () => {
    return currentUser?.role === "admin";
  };

  const isHOD = () => {
    return currentUser?.role === "hod";
  };

  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    isHOD,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};