import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const fetchCartCount = useCallback(() => {
    if (!user) return Promise.resolve();
    return API.get("/cart").then(res => {
      const items = Array.isArray(res.data) ? res.data : res.data.items || [];
      setCartCount(items.reduce((sum, i) => sum + (i.quantity || 1), 0));
    }).catch(() => setCartCount(0));
  }, [user]);

  useEffect(() => { fetchCartCount(); }, [fetchCartCount]);

  const incrementCart = (qty = 1) => setCartCount(c => c + qty);

  return (
    <CartContext.Provider value={{ cartCount: user ? cartCount : 0, fetchCartCount, incrementCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
