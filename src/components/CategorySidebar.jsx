import { BASE_URL } from '../services/config';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaLaptop, FaMale, FaFemale, FaChild, FaChevronRight, FaFire, FaBolt, FaTag, FaStar, FaEye, FaHeadset, FaQuestionCircle, FaBox, FaComments, FaCouch, FaSpa, FaBook } from "react-icons/fa";

function CategorySidebar({ setCategory, onOpenChat }) {
  const [open, setOpen] = useState(null);
  const [active, setActive] = useState("all");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentlyViewed] = useState(() => {
    try {return JSON.parse(localStorage.getItem('recently_viewed_products') || '[]').slice(0,3);} catch {return [];}
  });
  const categories = [
    { name: "Electronics",   icon: <FaLaptop />,  sub: ["Mobiles", "Laptops", "Headphones", "Smart Watches", "Gaming Accessories"], count: 156 },
    { name: "Men",           icon: <FaMale />,    sub: ["Kurtas", "Blazers", "Shirts", "T-Shirts", "Jeans", "Lowers", "Accessories", "Footwear"], count: 243 },
    { name: "Women",         icon: <FaFemale />,  sub: ["Kurtis", "Sarees", "Western Wear", "Jewellery", "Accessories", "Footwear"], count: 312 },
    { name: "Kids",          icon: <FaChild />,   sub: ["Clothing", "Toys", "Accessories", "Footwear"], count: 89 },
    { name: "Home & Living", icon: <FaCouch />,   sub: ["Furniture", "Decor", "Kitchen", "Bedding", "Storage"], count: 210 },
    { name: "Beauty",        icon: <FaSpa />,     sub: ["Skincare", "Makeup", "Haircare", "Fragrance", "Personal Care"], count: 175 },
    { name: "Books",         icon: <FaBook />,    sub: ["Fiction", "Academic", "Exams", "Self-Help", "Children"], count: 320 },
  ];

  const quickLinks = [
    { label: "Best Sellers", icon: <FaFire />,  cls: "text-red-500 bg-red-50 border-red-200", route: "/home" },
    { label: "Flash Deals",  icon: <FaBolt />,  cls: "text-amazon-accent bg-amazon-section border-amazon-border", route: "/mood-shop" },
    { label: "Offers",       icon: <FaTag />,   cls: "text-emerald-600 bg-emerald-50 border-emerald-200", route: "/wishlist" },
    { label: "Top Rated",    icon: <FaStar />,  cls: "text-amber-500 bg-amber-50 border-amber-200", route: "/orders" },
  ];

  const handleQuickLink = (route) => {
    navigate(route);
  };

  const handleMain = (name) => {
    setOpen(open === name ? null : name);
    setActive(name);
    setCategory(name);
  };

  const handleSub = (e, catName, sub) => {
    e.stopPropagation();
    const key = `${catName}|${sub}`;
    setActive(key);
    setCategory(key);
  };

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "G";
  const displayName = user?.name || "Guest";

  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white border border-amazon-border rounded-2xl overflow-hidden pb-4 shadow-sm">

      {/* USER GREETING */}
      <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-amazon-accent/15 to-amazon-text-secondary/10 border-b border-amazon-border">
        <motion.div whileHover={{ scale: 1.08 }}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-amazon-accent to-amazon-text-secondary flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-md">
          {initials}
        </motion.div>
        <div>
          <p className="text-xs text-amazon-accent leading-none mb-1">Welcome back</p>
          <p className="text-sm font-bold text-amazon-text">{displayName}</p>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-bold text-amazon-text uppercase tracking-widest mb-3">Quick Links</p>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((q, i) => (
            <motion.div key={q.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleQuickLink(q.route)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer ${q.cls}`}>
              {q.icon} {q.label}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="h-px bg-amazon-border mx-4 my-3" />

      {/* RECENTLY VIEWED */}
      {recentlyViewed.length > 0 && (
        <div className="px-4 pb-3">
          <p className="text-xs font-bold text-amazon-text uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <FaEye className="text-amazon-accent" /> Recently Viewed
          </p>
          <div className="space-y-2">
            {recentlyViewed.map((product, i) => (
              <motion.div 
                key={product._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 3 }}
                onClick={() => navigate(`/product/${product._id}`)}
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-amazon-section/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amazon-section flex items-center justify-center flex-shrink-0 border border-amazon-border">
                  {product.image ? (
                    <img 
                      src={product.image.startsWith('http') ? product.image : `${BASE_URL}/uploads/${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-xs text-amazon-accent">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-amazon-text truncate">{product.name}</p>
                  <p className="text-xs text-amazon-accent font-bold">₹{product.price?.toLocaleString('en-IN')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="h-px bg-amazon-border mx-4 my-3" />

      {/* ALL PRODUCTS */}
      <div className="px-3">
        <motion.div whileHover={{ x: 3 }}
          onClick={() => { setActive("all"); setCategory("all"); }}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-semibold transition-all mb-1
            ${active === "all" ? "bg-amazon-section text-amazon-accent font-bold border border-amazon-border" : "text-amazon-accent hover:bg-amazon-section/60 hover:text-amazon-accent"}`}>
          <span className="text-base">🛍</span> All Products
        </motion.div>
      </div>

      {/* CATEGORIES */}
      <div className="px-3">
        <p className="text-xs font-bold text-amazon-text uppercase tracking-widest px-3 mb-2 mt-1 flex items-center gap-1.5">
          <FaFire className="text-red-500 text-xs" /> Trending Categories
        </p>
        {categories.map((cat, idx) => {
          const isOpen = open === cat.name;
          const isActive = active === cat.name;
          return (
            <motion.div key={cat.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}>
              <motion.div whileHover={{ x: 3 }}
                onClick={() => handleMain(cat.name)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-1
                  ${isActive ? "bg-amazon-section text-amazon-accent font-bold border border-amazon-border" : "text-amazon-accent hover:bg-amazon-section/60 hover:text-amazon-accent"}`}>
                <div className="flex items-center gap-2.5">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs
                    ${isActive ? "bg-amazon-accent text-amazon-text" : "bg-amazon-section text-amazon-accent"}`}>
                    {cat.icon}
                  </span>
                  <span className="text-sm font-semibold">{cat.name}</span>
                  <span className="text-xs text-amazon-text-secondary bg-amazon-section/60 px-1.5 py-0.5 rounded-full font-medium">
                    {cat.count}
                  </span>
                </div>
                <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}
                  className="text-xs text-amazon-text-secondary">
                  <FaChevronRight />
                </motion.span>
              </motion.div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden pl-4 pb-1">
                    {cat.sub.map((sub) => {
                      const key = `${cat.name}|${sub}`;
                      const isSub = active === key;
                      return (
                        <motion.div key={sub} whileHover={{ x: 4 }}
                          onClick={(e) => handleSub(e, cat.name, sub)}
                          className={`text-xs py-2 px-3 rounded-r-xl cursor-pointer transition-all mb-0.5 border-l-2
                            ${isSub ? "bg-amazon-section border-amazon-accent text-amazon-accent font-bold" : "text-amazon-accent border-amazon-border hover:text-amazon-accent hover:bg-amazon-section/50"}`}>
                          {sub}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="h-px bg-amazon-border mx-4 my-3" />

      {/* SUPPORT LINKS */}
      <div className="px-4 pb-4">
        <p className="text-xs font-bold text-amazon-text uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <FaHeadset className="text-amazon-accent" /> Support
        </p>
        <div className="space-y-2">
          <motion.div
            whileHover={{ x: 3 }}
            onClick={() => navigate("/track")}
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-amazon-section/50 transition-colors">
            <FaBox className="text-amazon-accent" />
            <span className="text-xs font-medium text-amazon-text">Track Order</span>
          </motion.div>
          <motion.div
            whileHover={{ x: 3 }}
            onClick={() => navigate("/faq")}
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-amazon-section/50 transition-colors">
            <FaQuestionCircle className="text-amazon-accent" />
            <span className="text-xs font-medium text-amazon-text">Help & FAQ</span>
          </motion.div>
          <motion.div
            whileHover={{ x: 3 }}
            onClick={() => navigate("/contact")}
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-amazon-section/50 transition-colors">
            <FaHeadset className="text-amazon-accent" />
            <span className="text-xs font-medium text-amazon-text">Contact Support</span>
          </motion.div>
          <motion.div
            whileHover={{ x: 3 }}
            onClick={() => onOpenChat && onOpenChat()}
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer bg-gradient-to-r from-amazon-accent/10 to-amazon-text-secondary/10 hover:from-amazon-accent/20 hover:to-amazon-text-secondary/20 border border-amazon-border transition-all mt-1">
            <FaComments className="text-amazon-accent" />
            <span className="text-xs font-semibold text-amazon-accent">Live Chat</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default CategorySidebar;
