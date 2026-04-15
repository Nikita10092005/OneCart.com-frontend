import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SellerRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "seller") return <Navigate to="/home" replace />;
  return children;
}
