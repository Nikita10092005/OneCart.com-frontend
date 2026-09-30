import { API_URL } from '../services/config';
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaFilter, FaTimes } from "react-icons/fa";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import HeroBanner from "../components/HeroBanner";
import CategorySidebar from "../components/CategorySidebar";
import PriceFilter from "../components/PriceFilter";
import { imgUrl } from "../utils/imageUrl";
import RecentlyViewed from "../components/RecentlyViewed";
import PointsWidget from "../components/PointsWidget";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

gsap.registerPlugin(ScrollTrigger);

function SectionHeader({ title, count, onSeeAll }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between mb-4 mt-6 sm:mt-8">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amazon-accent to-amazon-text-secondary" />
        <h2 className="text-base sm:text-lg font-bold text-amazon-text tracking-tight">{title}</h2>
      </div>
      {count !== undefined
        ? <span className="text-xs text-amazon-accent font-medium">{count} items</span>
        : <motion.button whileHover={{ scale: 1.05 }} onClick={onSeeAll}
            className="text-xs text-amazon-accent border border-amazon-border/50 px-3 py-1.5 rounded-full hover:bg-amazon-section transition font-semibold">
            See all
          </motion.button>
      }
    </motion.div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);

  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams,setSearchParams] = useSearchParams();
  const category = searchParams.get('main') || 'all';
  const setCategory = value => setSearchParams(value === 'all' ? {} : {main:value});
  const quickPicksRef = useRef(null);
  const promoBannerRef = useRef(null);
  const { user } = useAuth();
  const [personalizedProducts, setPersonalizedProducts] = useState([]);
  const [isPersonalized, setIsPersonalized] = useState(false);


  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u?.role === "admin") navigate("/admin");
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "/products";
        if (category !== "all") {
          if (category.includes("|")) {
            const [p, s] = category.split("|");
            url = `/products?main=${encodeURIComponent(p)}&sub=${encodeURIComponent(s)}`;
          } else {
            url = `/products?main=${encodeURIComponent(category)}`;
          }
        }
        const res = await API.get(url);
        setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
      } catch (e) { console.error(e); }
    };
    fetchProducts();
  }, [category]);

  useEffect(() => {
    if (!promoBannerRef.current) return;
    gsap.fromTo(promoBannerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: promoBannerRef.current, start: "top 85%" } }
    );
  }, []);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/recommendations/home`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { setPersonalizedProducts(data.products || []); setIsPersonalized(data.personalized || false); })
      .catch(() => {});
  }, [user]);

  const filtered = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

  const sidebarContent = (
    <>
      <PointsWidget />
      <div className="mt-4">
        <CategorySidebar
          setCategory={(c) => { setCategory(c); setSidebarOpen(false); }}
          onOpenChat={() => window.dispatchEvent(new CustomEvent("openChat"))}
        />
      </div>
      <PriceFilter priceRange={priceRange} setPriceRange={setPriceRange} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="mt-4 rounded-2xl overflow-hidden bg-gradient-to-br from-amazon-accent via-orange-500 to-amazon-subheader p-4 shadow-lg relative">
        <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">LIVE</div>
        <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1">Today's Deal</p>
        <p className="text-white font-extrabold text-base leading-tight mb-1">⚡ Up to 70% Off</p>
        <p className="text-white/75 text-xs mb-3">Electronics & Fashion</p>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setCategory("Electronics"); setSidebarOpen(false); }}
          className="w-full py-2 bg-white text-amazon-accent font-bold rounded-xl text-xs shadow-md hover:bg-amazon-section transition">
          Shop Now →
        </motion.button>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-4 bg-white border border-amazon-border rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-bold text-amazon-accent uppercase tracking-widest mb-3">Customer Rating</p>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(r => (
            <motion.button key={r} whileHover={{ x: 3 }}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg hover:bg-amazon-section transition group">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-sm ${s <= r ? "text-amazon-accent" : "text-amazon-text-secondary"}`}>★</span>
                ))}
              </div>
              <span className="text-xs text-amazon-accent font-medium group-hover:text-amazon-text">& above</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="mt-4 bg-white border border-amazon-border rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-bold text-amazon-accent uppercase tracking-widest mb-3">Why OneCart?</p>
        <div className="space-y-3">
          {[
            { icon: "🚚", title: "Free Delivery", sub: "On orders above ₹499" },
            { icon: "↩️", title: "Easy Returns", sub: "7-day return policy" },
            { icon: "🔒", title: "Secure Payments", sub: "256-bit SSL encryption" },
            { icon: "🎧", title: "24/7 Support", sub: "Always here to help" },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-3">
              <span className="text-xl w-8 text-center flex-shrink-0">{b.icon}</span>
              <div>
                <p className="text-xs font-bold text-amazon-text">{b.title}</p>
                <p className="text-[10px] text-amazon-accent">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );

  return (
    <div className="min-h-screen bg-amazon-section">
      <HeroBanner />

      {/* QUICK PICKS */}
      <motion.div ref={quickPicksRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="flex gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 overflow-x-auto scrollbar-hide">
        {products.slice(0, 12).map((p, i) => (
          <motion.div key={p._id}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            whileHover={{ y: -3, scale: 1.03 }}
            onClick={() => navigate(`/product/${p._id}`)}
            className="flex items-center gap-2 bg-white border border-amazon-border rounded-full px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer flex-shrink-0 hover:shadow-md transition-all group">
            <img src={imgUrl(p.image)}
              alt={p.name} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover bg-amazon-section" />
            <span className="text-xs font-medium text-amazon-text group-hover:text-amazon-accent whitespace-nowrap">
              {p.name.length > 16 ? p.name.slice(0, 16) + "…" : p.name}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* MOBILE FILTER BUTTON */}
      <div className="lg:hidden px-3 sm:px-6 mb-3">
        <button onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 bg-white border border-amazon-border text-amazon-text text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:border-amazon-accent transition-all">
          <FaFilter size={12} className="text-amazon-accent" /> Filters & Categories
        </button>
      </div>

      {/* MOBILE SIDEBAR DRAWER */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-[300px] bg-amazon-section z-50 overflow-y-auto p-4 lg:hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-amazon-text text-base">Filters & Categories</h2>
                <button onClick={() => setSidebarOpen(false)} className="text-amazon-text hover:text-red-500 transition">
                  <FaTimes size={18} />
                </button>
              </div>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex gap-0 px-3 sm:px-6 pb-8 sm:pb-12">

        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block w-64 flex-shrink-0 pr-5 border-r border-amazon-border">
          {sidebarContent}
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0 lg:pl-7">

          {/* PROMO BANNER */}
          <div ref={promoBannerRef}
            className="mt-4 sm:mt-6 rounded-2xl overflow-hidden relative bg-amazon-accent p-4 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-black/10">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle at 10% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)" }} />
            <div className="relative z-10">
              <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full border border-white/30 inline-block mb-2">LIMITED TIME</span>
              <h3 className="text-lg sm:text-2xl font-extrabold text-white mb-1">⚡ Flash Sale — Up to 70% Off</h3>
              <p className="text-amazon-section text-xs sm:text-sm">Electronics, fashion & more. Deals refresh every 24 hours.</p>
            </div>
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setCategory("Electronics"); document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" }); }}
              className="relative z-10 flex-shrink-0 bg-white text-amazon-accent font-bold px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl text-sm shadow-lg w-full sm:w-auto text-center">
              Shop the Sale →
            </motion.button>
          </div>

          {/* CATEGORY CHIPS */}
          <div id="products-section" className="flex gap-2 mt-4 sm:mt-6 flex-wrap">
            {["All", "Electronics", "Men", "Women", "Kids", "Home & Living", "Beauty", "Books"].map((c, i) => (
              <motion.button key={c}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(c === "All" ? "all" : c)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
                  ${(c === "All" && category === "all") || category === c
                    ? "bg-amazon-accent border-amazon-accent text-white shadow-md"
                    : "bg-white border-amazon-border text-amazon-accent hover:border-amazon-accent"}`}>
                {c}
              </motion.button>
            ))}
          </div>

          {/* PERSONALIZED / NEW ARRIVALS */}
          {(() => {
            const recProducts = user && isPersonalized
              ? (category === "all" ? personalizedProducts
                  : personalizedProducts.filter(p =>
                      p.category?.toLowerCase().includes(category.toLowerCase()) ||
                      (p.main && p.main.toLowerCase() === category.toLowerCase())
                    ).length > 0
                    ? personalizedProducts.filter(p =>
                        p.category?.toLowerCase().includes(category.toLowerCase()) ||
                        (p.main && p.main.toLowerCase() === category.toLowerCase())
                      )
                    : filtered.slice(0, 10))
              : filtered.slice(0, 10);
            return recProducts.length > 0 ? (
              <div>
                <SectionHeader
                  title={user && isPersonalized && category === "all" ? "✨ Recommended for you" : `🆕 ${category === "all" ? "New Arrivals" : category + " Picks"}`}
                  onSeeAll={() => category === "all" ? navigate("/search") : navigate(`/search?category=${encodeURIComponent(category)}`)}
                />
                <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
                  {recProducts.map(p => <div key={p._id} className="flex-shrink-0 w-[160px] sm:w-[200px]"><ProductCard product={p} /></div>)}
                </div>
              </div>
            ) : null;
          })()}

          {/* BEST SELLERS */}
          <SectionHeader
            title={`🔥 Best Sellers${category !== "all" ? " — " + category : ""}`}
            onSeeAll={() => category === "all" ? document.getElementById("all-products")?.scrollIntoView({ behavior: "smooth" }) : navigate(`/search?category=${encodeURIComponent(category)}`)}
          />
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {filtered.slice(0, 10).map(p => <div key={p._id} className="flex-shrink-0 w-[160px] sm:w-[200px]"><ProductCard product={p} /></div>)}
          </div>

          <RecentlyViewed />

          {/* TOP DEALS */}
          <SectionHeader
            title={`💥 Top Deals${category !== "all" ? " — " + category : ""}`}
            onSeeAll={() => category === "all" ? document.getElementById("all-products")?.scrollIntoView({ behavior: "smooth" }) : navigate(`/search?category=${encodeURIComponent(category)}`)}
          />
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {filtered.slice(10, 20).map(p => <div key={p._id} className="flex-shrink-0 w-[160px] sm:w-[200px]"><ProductCard product={p} /></div>)}
          </div>

          {/* ALL PRODUCTS GRID */}
          <SectionHeader title="🛍 All Products" count={filtered.length} />
          <div id="all-products" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((p, i) => (
              <motion.div key={p._id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 4) * 0.07, duration: 0.4 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
