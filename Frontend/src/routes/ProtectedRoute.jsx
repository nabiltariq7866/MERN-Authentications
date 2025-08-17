import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { token, loadingAuth } = useAuth();


  if (loadingAuth) return null; // or a loader/spinner while checking auth

  if (!token) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
