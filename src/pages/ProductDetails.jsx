import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { FaCheck, FaShoppingCart } from "react-icons/fa";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import ViewerCount from "../components/ViewerCount";
import PriceAlertButton from "../components/PriceAlertButton";
import ComparisonButton from "../components/ComparisonButton";
import ReviewSystem from "../components/ReviewSystem";
import { imgUrl, API_BASE_URL } from "../utils/imageUrl";

function ProductImage({ product }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = imgUrl(product.image);

  if (!imageUrl || imgError) {
    return (
      <div className="text-amazon-accent text-center relative z-10">
        <div className="w-32 h-32 bg-amazon-border rounded-lg flex items-center justify-center mb-2 mx-auto">
          <span className="text-4xl">📦</span>
        </div>
        <p className="text-sm">No image available</p>
      </div>
    );
  }

  return (
    <motion.img
      src={imageUrl}
      alt={product.name}
      whileHover={{ scale: 1.06, rotate: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="max-h-80 max-w-full object-contain drop-shadow-xl relative z-10"
      onError={() => setImgError(true)}
    />
  );
}

function StarRow({ rating, max = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, type: "spring" }}
          className={i < Math.round(rating) ? "text-amazon-accent" : "text-amazon-text-secondary"}>
          ★
        </motion.span>
      ))}
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { incrementCart } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState(false);
  const imgRef    = useRef(null);
  const infoRef   = useRef(null);
  const breadRef  = useRef(null);

  const fetchReviews = async () => {
    try { const r = await API.get(`/reviews/${id}`); setReviews(r.data); }
    catch (e) { console.error(e); }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log('Starting product load for ID:', id);
    const load = async () => {
      try {
        console.log('Making API calls...');
        const [pRes, rRes] = await Promise.all([
          API.get(`/products/${id}`),
          API.get(`/reviews/${id}`)
        ]);
        console.log('API responses:', { product: pRes.data, reviews: rRes.data });
        setProduct(pRes.data);
        setReviews(rRes.data);
        addToRecentlyViewed(pRes.data);
        // Record browsing event for authenticated users
        if (user) {
          const token = localStorage.getItem("token");
          fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/recommendations/browse`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ productId: id })
          }).catch(() => {});
        }
      } catch (e) { 
        console.error('Error loading product:', e); 
        console.error('Error details:', e.response);
      }
    };
    load();
  }, [id]);

  // GSAP entrance after product loads
  useEffect(() => {
    if (!product) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(breadRef.current,
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );
      gsap.fromTo(imgRef.current,
        { x: -40, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 0.6, delay: 0.1, ease: "power3.out" }
      );
      gsap.fromTo(infoRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, delay: 0.15, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, [product]);

  useEffect(() => {
    if (product?.category) {
      API.get(`/products?category=${encodeURIComponent(product.category)}`)
        .then(r => {
          const data = Array.isArray(r.data) ? r.data : r.data.products || [];
          setRelated(data.filter(p => p._id !== id).slice(0, 10));
        }).catch(() => {});
    }
  }, [product?.category, id]);

  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { navigate("/login"); return; }
    try {
      await API.post("/cart", { productId: id, userId: user._id });
      incrementCart(1);
      setAdded(true);
      setToast(true);
      setTimeout(() => setAdded(false), 2500);
      setTimeout(() => setToast(false), 3500);
    } catch { alert("Error adding to cart"); }
  };

  const toggleWishlist = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { alert("Please login first"); return; }
    setWishlistLoading(true);
    try {
      await API.post("/wishlist", { productId: id, userId: user._id });
      setWishlisted(true);
      setTimeout(() => setWishlisted(false), 2500);
    } catch { alert("Error adding to wishlist"); }
    finally { setWishlistLoading(false); }
  };

  const submitReview = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { alert("Please login to review"); return; }
    try {
      await API.post("/reviews", { productId: id, userId: user._id, rating: Number(rating), comment });
      setComment("");
      fetchReviews();
    } catch { alert("Error submitting review"); }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (!product) return (
    <div className="min-h-screen bg-amazon-section flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="w-10 h-10 border-4 border-amazon-border border-t-amazon-accent rounded-full"
      />
    </div>
  );

  return (
    <>
    <div className="min-h-screen bg-amazon-section py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* BREADCRUMB */}
        <div ref={breadRef} className="flex items-center gap-2 text-xs text-amazon-accent">
          <button onClick={() => navigate("/home")}
            className="hover:text-amazon-accent transition font-medium">Home</button>
          <span className="text-amazon-text-secondary">/</span>
          <span className="text-amazon-accent">{product.category || 'Products'}</span>
          <span className="text-amazon-text-secondary">/</span>
          <span className="text-amazon-text font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* MAIN PRODUCT CARD */}
        <div className="bg-white border border-amazon-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex flex-wrap gap-0">

            {/* IMAGE PANEL */}
            <div ref={imgRef}
              className="w-full md:w-2/5 bg-amazon-section flex items-center justify-center p-8 min-h-[380px] relative">
              {/* subtle radial glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.04)_0%,_transparent_70%)]" />
              <ProductImage product={product} />
            </div>

            {/* INFO PANEL */}
            <div ref={infoRef} className="flex-1 p-8 flex flex-col justify-between min-w-[280px]">
              <div>
                {/* CATEGORY BADGE */}
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block text-xs font-bold bg-amazon-section text-amazon-accent border border-amazon-border/50 px-3 py-1 rounded-full">
                  {product.category || 'General'}
                </motion.span>

                {/* VIEWER COUNT */}
                <ViewerCount productId={id} />

                <h1 className="text-3xl font-extrabold text-amazon-text mt-4 mb-2 leading-tight">
                  {product.name}
                </h1>

                {/* RATING */}
                {avgRating && (
                  <div className="flex items-center gap-2 mb-4">
                    <StarRow rating={avgRating} />
                    <span className="text-amazon-accent font-bold text-sm">{avgRating}</span>
                    <span className="text-amazon-accent text-xs">({reviews.length} reviews)</span>
                  </div>
                )}

                {/* PRICE */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex items-baseline gap-3 mb-5">
                  <span className="text-4xl font-extrabold text-amazon-price">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {product.discount}% OFF
                    </span>
                  )}
                </motion.div>

                {/* DESCRIPTION */}
                <p className="text-amazon-accent text-sm leading-relaxed mb-6">{product.description}</p>

                {/* STOCK */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2 mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-emerald-500" : "bg-red-400"}`}
                  />
                  <span className={`text-xs font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {product.stock === 0
                      ? "Out of Stock"
                      : product.stock <= 10
                      ? `Only ${product.stock} left!`
                      : `In Stock (${product.stock} available)`}
                  </span>
                </motion.div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 flex-wrap">
                <motion.button
                  onClick={addToCart}
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  animate={added ? { backgroundColor: "#10b981" } : {}}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                    ${added
                      ? "bg-emerald-500 text-white shadow-emerald-500/20"
                      : "bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text shadow-black/10"}`}>
                  {added ? "✅ Added to Cart!" : "🛒 Add to Cart"}
                </motion.button>

                <motion.button
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  animate={wishlisted ? { backgroundColor: "#fef2f2" } : {}}
                  className={`px-6 py-3.5 rounded-xl font-bold text-sm transition border border-amazon-border
                    ${wishlisted ? "bg-red-50 text-red-500 border-red-200" : "bg-amazon-section text-amazon-accent hover:bg-amazon-border"}`}>
                  {wishlisted ? "❤️ Wishlisted!" : "♡ Wishlist"}
                </motion.button>
              </div>

              {/* NEW FEATURE BUTTONS */}
              <div className="flex gap-3 flex-wrap mt-3">
                <PriceAlertButton
                  productId={product._id}
                  currentPrice={product.price}
                  productName={product.name}
                />
                <ComparisonButton
                  productId={product._id}
                  productName={product.name}
                  productImage={product.image}
                  productPrice={product.price}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ENHANCED REVIEW SYSTEM */}
        <ReviewSystem productId={id} />

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-amazon-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-amazon-text mb-5 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-amazon-accent inline-block" />
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {related.map((p, i) => (
                <motion.div key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}>
                  <Link to={`/product/${p._id}`}
                    className="bg-amazon-section border border-amazon-border rounded-xl p-3 hover:border-amazon-accent transition-all group block">
                    <div className="w-full h-40 flex items-center justify-center mb-3 bg-white rounded-lg overflow-hidden border border-amazon-border">
                      <img
                        src={imgUrl(p.image)}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <p className="text-xs font-semibold text-amazon-text line-clamp-2 mb-1">{p.name}</p>
                    <p className="text-sm font-bold text-amazon-price">₹{p.price.toLocaleString()}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>

    {/* CART TOAST */}
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 min-w-[280px] max-w-[340px]">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <FaCheck size={12} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white">Added to Cart!</p>
            <p className="text-xs text-white/60 truncate">{product?.name}</p>
          </div>
          <button
            onClick={() => { setToast(false); navigate("/cart"); }}
            className="flex-shrink-0 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text text-xs font-bold px-3 py-1.5 rounded-xl transition-all">
            Go to Cart
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  );
}
