import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({children, adminOnly}){

const { user } = useAuth();

if(!user){
return <Navigate to="/login" />;
}

/* ADMIN PROTECTION */

if(adminOnly && user.role !== "admin"){
return <Navigate to="/home" />;
}

return children;

}

export default ProtectedRoute;