import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function RecentlyViewed() {
  const { recentlyViewed, clearRecentlyViewed, removeFromRecentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-amazon-border rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-amazon-accent" />
          <h2 className="text-lg font-bold text-amazon-text">👁 Recently Viewed</h2>
        </div>
        <button
          onClick={clearRecentlyViewed}
          className="text-xs text-amazon-accent hover:text-red-500 transition font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 pt-3 scrollbar-hide">
        {recentlyViewed.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="relative group flex-shrink-0"
          >
            {/* REMOVE BUTTON — outside the Link, positioned with overflow visible */}
            <button
              onClick={(e) => {
                e.preventDefault();
                removeFromRecentlyViewed(product._id);
              }}
              className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>

            <Link
              to={`/product/${product._id}`}
              className="block w-36 bg-amazon-section border border-amazon-border rounded-xl p-3 hover:border-amazon-border transition-all"
            >
              <div className="w-full h-28 flex items-center justify-center mb-2 bg-white rounded-lg overflow-hidden border border-amazon-border">
                {product.image ? (
                  <img
                    src={product.image.startsWith("http") ? product.image : `${API_URL.replace(/\/api$/, "")}/uploads/${product.image}`}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
                  />
                ) : null}
                <span className="text-3xl" style={{ display: product.image ? "none" : "block" }}>📦</span>
              </div>
              <p className="text-xs font-semibold text-amazon-text line-clamp-2 mb-1">{product.name}</p>
              <p className="text-sm font-bold text-amazon-accent">₹{product.price?.toLocaleString()}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
