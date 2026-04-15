import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { imgUrl } from "../utils/imageUrl";
import { Heart, ShoppingCart, Trash2, ArrowRight, Star } from "lucide-react";

function Wishlist() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    API.get(`/wishlist/${user._id}`)
      .then(res => setWishlist(res.data.filter(i => i.productId)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const removeFromWishlist = async (itemId) => {
    setRemovingId(itemId);
    try {
      await API.delete(`/wishlist/${itemId}`);
      setWishlist(prev => prev.filter(i => i._id !== itemId));
    } catch { alert("Failed to remove item"); }
    finally { setRemovingId(null); }
  };

  const addToCart = async (item) => {
    setAddingId(item._id);
    try {
      await API.post("/cart", { productId: item.productId._id, userId: user._id });
      setAddedIds(prev => new Set([...prev, item._id]));
      setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(item._id); return n; }), 2000);
    } catch { alert("Failed to add to cart"); }
    finally { setAddingId(null); }
  };

  // Not logged in
  if (!user) return (
    <div className="min-h-screen bg-amazon-section flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-amazon-border rounded-2xl p-10 text-center shadow-sm max-w-sm w-full">
        <div className="w-16 h-16 bg-amazon-section rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart size={28} className="text-amazon-accent" />
        </div>
        <h2 className="text-lg font-bold text-amazon-text mb-2">Sign in to view your Wishlist</h2>
        <p className="text-sm text-amazon-text-secondary mb-6">Save your favourite items and shop them anytime.</p>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/login")}
          className="w-full py-3 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold rounded-xl text-sm shadow-lg">
          Sign In
        </motion.button>
      </motion.div>
    </div>
  );

  // Loading
  if (loading) return (
    <div className="min-h-screen bg-amazon-section flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="w-10 h-10 border-4 border-amazon-border border-t-amazon-accent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-amazon-section py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-1 h-7 rounded-full bg-amazon-accent" />
              <div>
                <h1 className="text-2xl font-extrabold text-amazon-text flex items-center gap-2">
                  My Wishlist
                  {wishlist.length > 0 && (
                    <span className="text-sm font-semibold bg-amazon-accent/15 text-amazon-accent border border-amazon-border/40 px-2.5 py-0.5 rounded-full">
                      {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
                    </span>
                  )}
                </h1>
                <p className="text-xs text-amazon-text-secondary mt-0.5">Items you've saved for later</p>
              </div>
            </div>
            {wishlist.length > 0 && (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/home")}
                className="flex items-center gap-2 text-xs font-bold text-amazon-accent border border-amazon-border px-4 py-2 rounded-xl hover:bg-amazon-section transition">
                Continue Shopping <ArrowRight size={13} />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Empty state */}
        {wishlist.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-amazon-border rounded-2xl p-16 text-center shadow-sm">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="w-20 h-20 bg-amazon-section rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Heart size={36} className="text-amazon-accent" />
            </motion.div>
            <h2 className="text-xl font-bold text-amazon-text mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-amazon-text-secondary mb-8 max-w-xs mx-auto">
              Browse our products and tap the heart icon to save items you love.
            </p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/home")}
              className="px-8 py-3 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold rounded-xl text-sm shadow-lg shadow-black/10">
              Explore Products
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {wishlist.map((item, i) => {
                const p = item.productId;
                const isAdded = addedIds.has(item._id);
                return (
                  <motion.div key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
                    className="bg-white border border-amazon-border rounded-2xl overflow-hidden shadow-sm group relative flex flex-col"
                  >
                    {/* Remove button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromWishlist(item._id)}
                      disabled={removingId === item._id}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 border border-amazon-border flex items-center justify-center shadow-sm hover:bg-red-50 hover:border-red-200 transition"
                    >
                      {removingId === item._id
                        ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                            className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full" />
                        : <Trash2 size={13} className="text-amazon-text-secondary group-hover:text-red-400 transition" />
                      }
                    </motion.button>

                    {/* Product image */}
                    <div
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="w-full h-44 bg-amazon-section flex items-center justify-center overflow-hidden cursor-pointer border-b border-amazon-border"
                    >
                      {p.image ? (
                        <motion.img
                          src={imgUrl(p.image)}
                          alt={p.name}
                          whileHover={{ scale: 1.06 }}
                          transition={{ duration: 0.3 }}
                          className="w-full h-full object-contain p-3"
                          onError={e => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <span className="text-4xl">📦</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <div
                        onClick={() => navigate(`/product/${p._id}`)}
                        className="cursor-pointer flex-1"
                      >
                        <p className="text-xs text-amazon-accent font-semibold mb-1">{p.category || "Product"}</p>
                        <h3 className="text-sm font-semibold text-amazon-text line-clamp-2 mb-2 leading-snug">{p.name}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={11} className={s <= Math.round(p.rating || 4) ? "text-amazon-accent fill-amazon-accent" : "text-amazon-border"} />
                          ))}
                          <span className="text-xs text-amazon-text-secondary ml-1">{p.rating || 4.2}</span>
                        </div>
                        <p className="text-lg font-extrabold text-amazon-price">₹{p.price?.toLocaleString()}</p>
                        {p.stock === 0 && (
                          <p className="text-xs text-red-500 font-semibold mt-1">Out of Stock</p>
                        )}
                        {p.stock > 0 && p.stock <= 5 && (
                          <p className="text-xs text-orange-500 font-semibold mt-1">Only {p.stock} left!</p>
                        )}
                      </div>

                      {/* Add to cart */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => addToCart(item)}
                        disabled={addingId === item._id || p.stock === 0}
                        animate={isAdded ? { backgroundColor: "#10b981" } : {}}
                        className={`mt-3 w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50
                          ${isAdded
                            ? "bg-emerald-500 text-white"
                            : "bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text shadow-black/10"}`}
                      >
                        {addingId === item._id
                          ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                              className="w-3.5 h-3.5 border-2 border-amazon-text border-t-transparent rounded-full" />
                          : isAdded
                          ? <><span>✓</span> Added to Cart</>
                          : <><ShoppingCart size={13} /> Add to Cart</>
                        }
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Bottom CTA */}
        {wishlist.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-8 bg-amazon-header rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
            <div>
              <p className="font-bold text-base mb-0.5">Ready to checkout?</p>
              <p className="text-white/60 text-sm">Add your wishlist items to cart and place your order.</p>
            </div>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/cart")}
              className="bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold px-7 py-3 rounded-xl text-sm shadow-lg flex items-center gap-2 flex-shrink-0">
              <ShoppingCart size={15} /> Go to Cart
            </motion.button>
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default Wishlist;
