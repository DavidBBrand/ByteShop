import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  // 1. If Auth is still checking the token, show nothing or a spinner
  if (loading) {
    return <div className="p-20 text-center text-gray-500 text-xl animate-pulse">Verifying Session...</div>;
  }

  // 2. If no token, kick them to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. If they are logged in, show the actual page (children)
  return children;
};

export default ProtectedRoute;