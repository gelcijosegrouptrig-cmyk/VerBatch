// VerbaTech — RoleGuard (Route Protection by Role)
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleGuard({ children, allowed }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowed && !allowed.includes(user.role)) {
    // redireciona para o dashboard correto de cada role
    if (user.role === "admin")       return <Navigate to="/admin" replace />;
    if (user.role === "master")      return <Navigate to="/" replace />;
    if (user.role === "funcionario") return <Navigate to="/func" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}
