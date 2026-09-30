import { createContext, useState, useContext, useEffect } from "react";
import API from "../services/api";

const readUser = () => {try {return JSON.parse(localStorage.getItem('user')) || null;} catch {localStorage.removeItem('user');return null;}};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(
    readUser
  );

  // Refresh user role from server on every app load
  useEffect(() => {
    const stored = readUser();
    const token = localStorage.getItem("token");
    if (!stored?._id || !token) return;

    API.get(`/user/profile/${stored._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const fresh = { ...stored, role: res.data.role, name: res.data.name };
      localStorage.setItem("user", JSON.stringify(fresh));
      setUser(fresh);
    }).catch(error => {
      if ([401,403].includes(error.response?.status)) {localStorage.removeItem('user');localStorage.removeItem('token');setUser(null);}
    });
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