import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MOODS = [
  {
    key: "Casual",
    icon: "😎",
    label: "Casual",
    desc: "Everyday comfort & style",
    bg: "from-blue-500 to-indigo-600",
    ring: "ring-blue-400",
    badge: "bg-blue-100 text-blue-700",
    shadow: "shadow-blue-200",
  },
  {
    key: "Party",
    icon: "🎉",
    label: "Party",
    desc: "Stand out & celebrate",
    bg: "from-pink-500 to-purple-600",
    ring: "ring-pink-400",
    badge: "bg-pink-100 text-pink-700",
    shadow: "shadow-pink-200",
  },
  {
    key: "Fitness",
    icon: "🏋️",
    label: "Fitness",
    desc: "Gear up & perform",
    bg: "from-green-500 to-emerald-600",
    ring: "ring-green-400",
    badge: "bg-green-100 text-green-700",
    shadow: "shadow-green-200",
  },
];

export default function MoodShop() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products/mood/${mood}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amazon-section py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-extrabold text-amazon-text mb-2">Mood-Based Shopping</h1>
          <p className="text-amazon-accent text-sm">Pick your vibe and discover products that match</p>
        </motion.div>

        {/* Mood Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {MOODS.map((mood, i) => {
            const isSelected = selectedMood === mood.key;
            return (
              <motion.button
                key={mood.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleMoodSelect(mood.key)}
                className={`relative rounded-2xl p-6 text-white bg-gradient-to-br ${mood.bg} shadow-lg ${mood.shadow} transition-all duration-200
                  ${isSelected ? `ring-4 ${mood.ring} ring-offset-2` : "ring-0"}`}
              >
                <div className="text-5xl mb-3">{mood.icon}</div>
                <div className="text-xl font-bold mb-1">{mood.label}</div>
                <div className="text-sm opacity-80">{mood.desc}</div>
                {isSelected && (
                  <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full ${mood.badge}`}>
                    Selected
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {selectedMood && (
            <motion.div
              key={selectedMood}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {/* Section heading */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amazon-accent to-amazon-text-secondary" />
                <h2 className="text-lg font-bold text-amazon-text">
                  {selectedMood} picks
                </h2>
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-10 h-10 border-4 border-amazon-text-secondary border-t-amazon-accent rounded-full mb-4"
                  />
                  <p className="text-amazon-accent text-sm">Loading...</p>
                </div>
              )}

              {/* No products */}
              {!loading && products.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <p className="text-5xl mb-4">🛍️</p>
                  <p className="text-amazon-text font-semibold text-base mb-1">
                    No products found for this mood
                  </p>
                  <p className="text-amazon-accent text-sm">Try a different mood or check back later</p>
                </motion.div>
              )}

              {/* Products */}
              {!loading && products.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product, i) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-200"
                    >
                      <div className="aspect-square overflow-hidden bg-gray-50">
                        <img
                          src={
                            product.image?.startsWith("http")
                              ? product.image
                              : `${API_URL}/uploads/${product.image}`
                          }
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.src = "https://placehold.co/300x300?text=No+Image"; }}
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-amazon-text font-semibold text-sm line-clamp-2 mb-1">
                          {product.name}
                        </p>
                        <p className="text-amazon-price font-bold text-sm">
                          ₹{product.price?.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
