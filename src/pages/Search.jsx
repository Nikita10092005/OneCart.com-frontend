import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { FaSearch, FaTimes } from "react-icons/fa";
import ImageSearchUpload from "../components/ImageSearchUpload";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get("q") || "";
  const categoryParam = params.get("category") || "";
  const [term, setTerm] = useState(q);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!(q || categoryParam));
  const [imageResults, setImageResults] = useState([]);
  const [showImageSearch, setShowImageSearch] = useState(false);

  useEffect(() => { setTerm(q); }, [q]);

  useEffect(() => {
    // Category browse mode
    if (categoryParam && !q) {
      setLoading(true);
      setSearched(true);
      API.get(`/products?main=${encodeURIComponent(categoryParam)}`)
        .then(res => setProducts(Array.isArray(res.data) ? res.data : res.data.products || []))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
      return;
    }
    // Text search mode
    if (!q.trim()) { setProducts([]); setSearched(false); return; }
    setLoading(true); setSearched(true);
    API.get(`/products?search=${encodeURIComponent(q.trim())}`)
      .then(res => setProducts(Array.isArray(res.data) ? res.data : res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [q, categoryParam]);

  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = term.trim();
      if (trimmed && trimmed !== q) setParams({ q: trimmed });
      else if (!trimmed && q) setParams({});
    }, 400);
    return () => clearTimeout(t);
  }, [term]);

  const clear = () => { setTerm(""); setParams({}); setProducts([]); setSearched(false); };
  const quickSearch = (s) => { setTerm(s); setParams({ q: s }); };

  const handleImageResults = (products) => {
    setImageResults(products);
  };

  return (
    <div className="min-h-screen bg-amazon-section py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* SEARCH BAR */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-amazon-text-secondary text-sm" />
            <input value={term} onChange={e => setTerm(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && term.trim()) setParams({ q: term.trim() }); }}
              placeholder="Search products, brands, categories..."
              autoFocus
              className="w-full bg-white border border-amazon-border text-amazon-text placeholder-amazon-text-secondary text-base rounded-2xl pl-11 pr-12 py-4 focus:outline-none focus:border-amazon-accent focus:ring-2 focus:ring-amazon-accent/30 transition shadow-sm" />
            {term && (
              <motion.button onClick={clear} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-amazon-text-secondary hover:text-amazon-accent transition">
                <FaTimes size={14} />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* IMAGE SEARCH TOGGLE */}
        <div className="flex justify-center mt-3">
          <button
            onClick={() => { setShowImageSearch(s => !s); setImageResults([]); }}
            className="text-xs text-amazon-accent border border-amazon-border px-4 py-1.5 rounded-full hover:bg-amazon-section transition font-semibold flex items-center gap-1.5"
          >
            📸 {showImageSearch ? "Hide Image Search" : "Search by Image"}
          </button>
        </div>
        {showImageSearch && (
          <div className="max-w-2xl mx-auto mt-4">
            <ImageSearchUpload onResults={handleImageResults} />
          </div>
        )}

        {/* RESULTS HEADER */}
        {searched && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amazon-accent to-amazon-text-secondary" />
              <h2 className="text-lg font-bold text-amazon-text">
                {categoryParam && !q
                  ? <><span className="text-amazon-accent">{categoryParam}</span> — All Products</>
                  : <>Results for <span className="text-amazon-accent">"{q}"</span></>
                }
              </h2>
            </div>
            <span className="text-xs text-amazon-accent font-medium">
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </span>
          </motion.div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-10 h-10 border-4 border-amazon-border border-t-amazon-accent rounded-full mb-4" />
            <p className="text-amazon-accent text-sm">Searching...</p>
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && searched && products.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-lg font-bold text-amazon-text mb-2">No results for "{q}"</h3>
            <p className="text-amazon-accent text-sm mb-6">Try different keywords or browse categories</p>
            <motion.button onClick={() => navigate("/home")}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold rounded-xl text-sm shadow-lg shadow-black/10">
              Browse All Products
            </motion.button>
          </motion.div>
        )}

        {/* EMPTY STATE */}
        {!loading && !searched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-5xl mb-4">🛍</p>
            <p className="text-amazon-accent font-medium">Start typing to search products</p>
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {["iPhone", "Laptop", "Saree", "Sneakers", "Watch", "Kids Toys"].map((s, i) => (
                <motion.button key={s}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  onClick={() => quickSearch(s)}
                  className="text-xs bg-white border border-amazon-border text-amazon-accent hover:text-amazon-accent hover:border-amazon-border px-3 py-1.5 rounded-full transition shadow-sm">
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* RESULTS GRID */}
        <AnimatePresence>
          {!loading && products.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((p, i) => (
                <motion.div key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* IMAGE SEARCH RESULTS */}
        {imageResults.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amazon-accent to-amazon-text-secondary" />
              <h2 className="text-lg font-bold text-amazon-text">📸 Similar Products</h2>
              <span className="text-xs text-amazon-accent font-medium">{imageResults.length} found</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {imageResults.map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        {showImageSearch && imageResults.length === 0 && !loading && (
          <p className="text-center text-sm text-amazon-accent mt-4">No similar products found. Try a different image.</p>
        )}
      </div>
    </div>
  );
}
