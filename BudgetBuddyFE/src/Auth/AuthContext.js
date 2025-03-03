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
      try {
        const parsedUser = JSON.parse(user);
        console.log("User loaded from localStorage:", parsedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Login function that preserves the original login response
  const login = (userData) => {
    console.log("Original login response:", userData);
    
    // IMPORTANT: Store the original response directly without modification
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentUser(userData);
    
    // Double-check what was stored
    console.log("User stored in localStorage:", JSON.parse(localStorage.getItem("user")));
    
    // Redirect based on roles or isAdmin flag
    if (userData.isAdmin === true || 
        (userData.roles && userData.roles.includes("ROLE_ADMIN"))) {
      console.log("Redirecting to admin dashboard");
      navigate("/dashboard");
    } else if (userData.roles && userData.roles.includes("ROLE_HOD")) {
      console.log("Redirecting to HOD dashboard");
      navigate("/dashboard");
    } else {
      console.log("Redirecting to home page");
      navigate("/");
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
  };

  // Check if user is admin - check both isAdmin flag and roles array
  const isAdmin = () => {
    console.log("Checking isAdmin. Current user:", currentUser);
    const result = currentUser?.isAdmin === true || 
                   (currentUser?.roles && 
                    Array.isArray(currentUser.roles) && 
                    currentUser.roles.includes("ROLE_ADMIN"));
    console.log("isAdmin result:", result);
    return result;
  };

  // Check if user is HOD
  const isHOD = () => {
    return currentUser?.roles && 
           Array.isArray(currentUser.roles) && 
           currentUser.roles.includes("ROLE_HOD");
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

export default AuthContext;