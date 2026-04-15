import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaUserCircle, FaShoppingCart, FaSearch, FaShieldAlt, FaBell, FaBalanceScale, FaGift, FaStore, FaBars, FaTimes } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [term, setTerm] = useState("");
  const [focused, setFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); setMenuOpen(false); };
  const handleSearch = (e) => {
    e.preventDefault();
    const q = term.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
    else navigate("/home");
    setMenuOpen(false);
  };
  const isActive = (path) => location.pathname === path;
  const linkCls = (path) => `flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl transition-all
    ${isActive(path) ? "text-amazon-accent border-b-2 border-amazon-accent" : "text-white hover:text-amazon-accent hover:bg-white/5"}`;

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50">
      <div className="bg-amazon-header border-b border-white/10 shadow-lg">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-[62px] flex items-center gap-3">

          {/* LOGO */}
          <div onClick={() => navigate(user?.role === "admin" ? "/admin" : "/home")}
            className="flex items-center gap-1.5 cursor-pointer flex-shrink-0 group">
            <div className="w-7 h-7 rounded-lg bg-amazon-accent flex items-center justify-center shadow-lg shrink-0">
              <HiSparkles className="text-amazon-text text-sm" />
            </div>
            <div className="flex items-baseline whitespace-nowrap">
              <span className="text-xl font-black text-white tracking-tight">One</span>
              <span className="text-xl font-black text-amazon-accent tracking-tight">Cart</span>
              <span className="text-xs font-semibold text-white/40 ml-0.5 hidden sm:inline">.com</span>
            </div>
          </div>

          {/* SEARCH — hidden on mobile, shown md+ */}
          {user?.role !== "admin" && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 min-w-0">
              <div className={`relative flex items-center w-full transition-all duration-200 ${focused ? "scale-[1.01]" : ""}`}>
                <FaSearch className={`absolute left-3.5 text-xs transition-colors ${focused ? "text-amazon-accent" : "text-amazon-text/40"}`} />
                <input
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Search products, brands..."
                  className={`w-full bg-white/90 border text-amazon-text placeholder-amazon-text/40 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none transition-all
                    ${focused ? "border-amazon-accent ring-2 ring-amazon-accent/30 bg-white" : "border-white/50 hover:border-white/80"}`}
                />
              </div>
            </form>
          )}

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-1 flex-shrink-0">
            {user?.role !== "admin" && (
              <>
                <Link to="/home" className={linkCls("/home")}>Home</Link>
                <Link to="/mood-shop" className={linkCls("/mood-shop")}>🛍️ Mood</Link>
                <Link to="/price-alerts" className={linkCls("/price-alerts")}><FaBell size={12} /><span className="hidden lg:inline">Alerts</span></Link>
                <Link to="/comparison" className={linkCls("/comparison")}><FaBalanceScale size={12} /><span className="hidden lg:inline">Compare</span></Link>
                <Link to="/rewards" className={linkCls("/rewards")}><FaGift size={12} /><span className="hidden lg:inline">Rewards</span></Link>
                <Link to="/cart" className={linkCls("/cart")}>
                  <span className="relative">
                    <FaShoppingCart size={13} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </span>
                  Cart
                </Link>
                {user?.role === "seller" && (
                  <Link to="/seller/dashboard" className={linkCls("/seller/dashboard")}><FaStore size={13} /><span className="hidden lg:inline">Seller Hub</span></Link>
                )}
              </>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-xl text-amazon-accent hover:bg-white/5 transition-all border border-amazon-accent/30">
                <FaShieldAlt size={12} /> Admin
              </Link>
            )}
            {user && <div className="w-px h-5 bg-white/20 mx-1" />}
            {!user && (
              <>
                <Link to="/login" className="text-sm font-medium text-white hover:text-amazon-accent px-3 py-2 rounded-xl hover:bg-white/5 transition-all">Login</Link>
                <Link to="/register" className="text-sm font-bold bg-amazon-accent text-amazon-text px-4 py-2 rounded-xl hover:bg-amazon-accent-hover transition-all shadow-lg">Register</Link>
              </>
            )}
            {user && (
              <>
                <NotificationBell />
                <Link to="/profile" className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/5 transition-all group">
                  <div className="w-8 h-8 rounded-xl bg-amazon-accent flex items-center justify-center text-amazon-text font-bold text-sm shadow-md">
                    {user.name?.charAt(0).toUpperCase() || <FaUserCircle />}
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-amazon-accent hidden lg:block max-w-[80px] truncate">
                    {user.name?.split(" ")[0]}
                  </span>
                </Link>
                <button onClick={handleLogout}
                  className="text-sm font-semibold text-white hover:text-red-300 px-3 py-2 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-400/20 transition-all">
                  Logout
                </button>
              </>
            )}
          </div>

          {/* MOBILE RIGHT — cart + hamburger */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            {user && <NotificationBell />}
            {user?.role !== "admin" && (
              <Link to="/cart" className="relative text-white hover:text-amazon-accent p-2">
                <FaShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setMenuOpen(o => !o)} className="text-white p-2">
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

        </div>

        {/* MOBILE SEARCH */}
        {user?.role !== "admin" && (
          <div className="md:hidden px-4 pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center">
                <FaSearch className="absolute left-3.5 text-xs text-amazon-text/40" />
                <input
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  placeholder="Search products, brands..."
                  className="w-full bg-white/90 border border-white/50 text-amazon-text placeholder-amazon-text/40 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-amazon-accent"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-amazon-header border-b border-white/10 shadow-xl px-4 py-4 flex flex-col gap-1">
            {user?.role !== "admin" && (
              <>
                <Link to="/home" onClick={() => setMenuOpen(false)} className={linkCls("/home")}>🏠 Home</Link>
                <Link to="/mood-shop" onClick={() => setMenuOpen(false)} className={linkCls("/mood-shop")}>🛍️ Mood Shop</Link>
                <Link to="/price-alerts" onClick={() => setMenuOpen(false)} className={linkCls("/price-alerts")}><FaBell size={12} /> Alerts</Link>
                <Link to="/comparison" onClick={() => setMenuOpen(false)} className={linkCls("/comparison")}><FaBalanceScale size={12} /> Compare</Link>
                <Link to="/rewards" onClick={() => setMenuOpen(false)} className={linkCls("/rewards")}><FaGift size={12} /> Rewards</Link>
                {user?.role === "seller" && (
                  <Link to="/seller/dashboard" onClick={() => setMenuOpen(false)} className={linkCls("/seller/dashboard")}><FaStore size={13} /> Seller Hub</Link>
                )}
              </>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl text-amazon-accent border border-amazon-accent/30">
                <FaShieldAlt size={12} /> Admin Panel
              </Link>
            )}
            <div className="border-t border-white/10 mt-2 pt-2">
              {!user ? (
                <div className="flex gap-2">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm font-medium text-white border border-white/20 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm font-bold bg-amazon-accent text-amazon-text px-4 py-2.5 rounded-xl hover:bg-amazon-accent-hover transition-all">Register</Link>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amazon-accent flex items-center justify-center text-amazon-text font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase() || <FaUserCircle />}
                    </div>
                    <span className="text-sm font-medium text-white">{user.name?.split(" ")[0]}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-sm font-semibold text-red-300 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-all">Logout</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
