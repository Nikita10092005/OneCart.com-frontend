import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import API from "../services/api";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [toast, setToast] = useState(false);
  const [adding, setAdding] = useState(false);
  const { incrementCart } = useCart();

  const addToCart = async (e) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { navigate("/login"); return; }
    if (adding) return;
    setAdding(true);
    try {
      await API.post("/cart", { productId: product._id, userId: user._id });
      incrementCart(1);
      setToast(true);
      setTimeout(() => setToast(false), 3500);
    } catch {
      alert("Error adding to cart");
    } finally {
      setAdding(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const imageUrl = product.image
    ? (product.image.startsWith("http") ? product.image : `${API_URL}/uploads/${product.image}`)
    : null;

  return (
    <>
      <motion.div
        onClick={() => navigate(`/product/${product._id}`)}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(0,0,0,0.12)" }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="bg-white border border-amazon-border rounded-2xl p-2.5 sm:p-3 cursor-pointer flex flex-col justify-between w-full group relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-amazon-border/0 via-amazon-border/5 to-amazon-border/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

        {/* IMAGE */}
        <div className="w-full h-[120px] sm:h-[140px] rounded-xl bg-amazon-section flex items-center justify-center overflow-hidden mb-2">
          {imgError || !imageUrl ? (
            <div className="flex flex-col items-center text-amazon-text-secondary">
              <span className="text-3xl sm:text-4xl">📦</span>
              <span className="text-xs mt-1">No Image</span>
            </div>
          ) : (
            <motion.img
              src={imageUrl}
              alt={product.name}
              onError={() => setImgError(true)}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.35 }}
              className="w-full h-full object-contain p-2"
            />
          )}
        </div>

        {/* INFO */}
        <div className="flex-1 px-0.5">
          <h4 className="text-xs sm:text-sm font-semibold text-amazon-text leading-snug line-clamp-2 mb-1">{product.name}</h4>
          <p className="text-sm sm:text-base font-bold text-amazon-price">₹{product.price.toLocaleString()}</p>
          <p className="text-xs text-amazon-accent mt-0.5">⭐ {product.rating || 4.2}</p>
        </div>

        {/* BUTTON */}
        <motion.button
          onClick={addToCart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          disabled={adding}
          className={`mt-2 w-full py-1.5 sm:py-2 rounded-xl text-amazon-text text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all
            ${adding ? "bg-amazon-accent/70 cursor-not-allowed" : "bg-amazon-accent hover:bg-amazon-accent-hover"}`}>
          {adding ? "Adding…" : <><FaShoppingCart size={11} /> Add to Cart</>}
        </motion.button>
      </motion.div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 min-w-[280px] max-w-[340px]">
            {/* icon */}
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <FaCheck size={12} />
            </div>
            {/* text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white">Added to Cart!</p>
              <p className="text-xs text-white/60 truncate">{product.name}</p>
            </div>
            {/* go to cart */}
            <button
              onClick={(e) => { e.stopPropagation(); setToast(false); navigate("/cart"); }}
              className="flex-shrink-0 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text text-xs font-bold px-3 py-1.5 rounded-xl transition-all">
              Go to Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ProductCard;
