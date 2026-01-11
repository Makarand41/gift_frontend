import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  // While checking session
  if (loading) {
    return null; // or a loader later
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but NOT admin
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // Admin allowed
  return children;
}
