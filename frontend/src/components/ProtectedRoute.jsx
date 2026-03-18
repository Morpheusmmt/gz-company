import { Navigate } from "react-router-dom";
import api from "../services/api";
import { hasPermission, isAdmin } from "../utils/permissionsHelper";

export default function ProtectedRoute({ children, requiredPermission }) {
  const isAuthenticated = api.auth.isAuthenticated();
  const user = api.auth.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (requiredPermission) {
    if (isAdmin(user)) {
      return children;
    }

    if (!hasPermission(user, requiredPermission)) {
      console.warn(`Usuário ${user?.email} tentou acessar uma rota sem permissão: ${requiredPermission}`);
      setTimeout(() => {
        alert("Você não tem permissão para acessar esta página.");
      }, 100);
      
      return <Navigate to="/menu" replace />;
    }
  }

  return children;
}