import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Refresh user role from server on every app load
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!stored?._id || !token) return;

    axios.get(`${import.meta.env.VITE_API_URL || "https://onecart-backend-production-400c.up.railway.app/api"}/user/profile/${stored._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const fresh = { ...stored, role: res.data.role, name: res.data.name };
      localStorage.setItem("user", JSON.stringify(fresh));
      setUser(fresh);
    }).catch(() => {});
  }, []);

  // ✅ LOGIN
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem(`chat_${userData._id}`, JSON.stringify([]));
    setUser(userData);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("chatMessages");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;