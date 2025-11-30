import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    // Don't redirect while auth state is being resolved; show nothing or a spinner
    return null;
  }

  if (!user) {
    // Redirect to login and preserve attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
