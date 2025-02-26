import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Loader } from "lucide-react";

const LoadingSpinner = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ height: "100vh" }}
  >
    <Loader className="animate-spin" size={36} />
  </div>
);

export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children ? children : <Outlet />;
};

// Admin-specific route protection
export const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser || !isAdmin()) {
    return <Navigate to="/login" />;
  }

  return children ? children : <Outlet />;
};

// HOD-specific route protection
export const HODRoute = ({ children }) => {
  const { currentUser, isHOD, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser || !isHOD()) {
    return <Navigate to="/login" />;
  }

  return children ? children : <Outlet />;
};
