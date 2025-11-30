import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_EMAIL = "mpereirah15@gmail.com";

export default function AdminRoute({ children }) {
  const { user, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Prefer explicit flag from backend; fall back to email-based check
  const allowed = !!(user.isAdmin || (user.email && user.email.toLowerCase() === ADMIN_EMAIL));
  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}
