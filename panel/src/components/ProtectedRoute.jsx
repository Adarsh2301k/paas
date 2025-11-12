import { Navigate } from "react-router-dom";
import { useProviderAuth } from "../context/ProviderAuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useProviderAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
