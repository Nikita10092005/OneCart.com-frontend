import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { HiSparkles } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import {
  FaBell, FaBalanceScale, FaGift, FaShieldAlt,
  FaTruck, FaHeadset, FaUndo, FaStar,
  FaArrowRight, FaStore, FaMobileAlt, FaLock,
  FaUsers, FaBoxOpen, FaPercent, FaCheckCircle, FaFire
} from "react-icons/fa";

const stats = [
  { value: "2M+", label: "Happy Shoppers", IconComp: FaUsers },
  { value: "500K+", label: "Products Listed", IconComp: FaBoxOpen },
  { value: "70%", label: "Max Discount", IconComp: FaPercent },
  { value: "4.9", label: "Avg Rating", IconComp: FaStar },
];

const trustFeatures = [
  { IconComp: FaTruck, title: "Free Delivery", desc: "On orders above ₹499. Same-day in select cities.", badge: "Popular" },
  { IconComp: FaUndo, title: "Easy Returns", desc: "7-day hassle-free returns. No questions asked.", badge: null },
  { IconComp: FaLock, title: "Secure Payments", desc: "256-bit SSL. UPI, cards & wallets accepted.", badge: null },
  { IconComp: FaHeadset, title: "24/7 Support", desc: "Live chat, email & phone — always available.", badge: "24/7" },
];

const categories = [
  { emoji: "📱", label: "Electronics",   count: "12K+ items", iconBg: "linear-gradient(135deg,#3b82f6,#4f46e5)" },
  { emoji: "👗", label: "Women",         count: "8K+ items",  iconBg: "linear-gradient(135deg,#f472b6,#e11d48)" },
  { emoji: "👔", label: "Men",           count: "6K+ items",  iconBg: "linear-gradient(135deg,#64748b,#334155)" },
  { emoji: "🧒", label: "Kids",          count: "4K+ items",  iconBg: "linear-gradient(135deg,#facc15,#f97316)" },
  { emoji: "🏠", label: "Home & Living", count: "9K+ items",  iconBg: "linear-gradient(135deg,#22c55e,#065f46)" },
  { emoji: "💄", label: "Beauty",        count: "5K+ items",  iconBg: "linear-gradient(135deg,#fb7185,#db2777)" },
  { emoji: "📚", label: "Books",         count: "20K+ items", iconBg: "linear-gradient(135deg,#fbbf24,#ea580c)" },
];

const highlights = [
  { IconComp: FaBell,         title: "Price Drop Alerts",  desc: "Set your target price and get instant notifications the moment a product hits your budget.", iconBg: "linear-gradient(135deg,#fb923c,#f59e0b)", cardBg: "#fff7ed", cardBorder: "#fed7aa" },
  { IconComp: FaBalanceScale, title: "Smart Compare",      desc: "Compare specs, prices and reviews side-by-side to always make the smartest choice.",         iconBg: "linear-gradient(135deg,#60a5fa,#6366f1)", cardBg: "#eff6ff", cardBorder: "#bfdbfe" },
  { IconComp: FaGift,         title: "Rewards & Points",   desc: "Earn OneCoins on every purchase. Redeem for discounts, free shipping and exclusive perks.",    iconBg: "linear-gradient(135deg,#c084fc,#ec4899)", cardBg: "#faf5ff", cardBorder: "#e9d5ff" },
  { IconComp: FaStore,        title: "Sell on OneCart",    desc: "Join 50,000+ sellers. Easy onboarding, powerful analytics dashboard, instant payouts.",        iconBg: "linear-gradient(135deg,#4ade80,#10b981)", cardBg: "#f0fdf4", cardBorder: "#bbf7d0" },
  { IconComp: FaMobileAlt,    title: "Mood Shopping",      desc: "Tell us your vibe — we'll curate a personalised collection tailored just for you.",             iconBg: "linear-gradient(135deg,#fb7185,#ec4899)", cardBg: "#fff1f2", cardBorder: "#fecdd3" },
  { IconComp: FaShieldAlt,    title: "Buyer Protection",   desc: "100% purchase protection on every single order. Shop with absolute zero risk.",                 iconBg: "linear-gradient(135deg,#2dd4bf,#06b6d4)", cardBg: "#f0fdfa", cardBorder: "#99f6e4" },
];

const testimonials = [
  { name: "Priya Sharma",  role: "Fashion Blogger",      rating: 5, text: "OneCart's price alerts saved me ₹3,000 on a laptop I'd been eyeing for months. The UI is so clean and fast.",                                    avatar: "P", avatarBg: "linear-gradient(135deg,#f472b6,#e11d48)" },
  { name: "Rahul Mehta",   role: "Tech Enthusiast",       rating: 5, text: "Delivery was faster than expected and the return process was completely painless. Best shopping experience I've had.",                              avatar: "R", avatarBg: "linear-gradient(135deg,#60a5fa,#4f46e5)" },
  { name: "Ananya Kapoor", role: "Lifestyle Creator",     rating: 4, text: "The Mood Shop feature is genuinely brilliant. It's like having a personal stylist who knows exactly what I want.",                                 avatar: "A", avatarBg: "linear-gradient(135deg,#c084fc,#ec4899)" },
  { name: "Vikram Nair",   role: "Small Business Owner",  rating: 5, text: "Selling on OneCart was super easy. The seller dashboard is powerful and payouts are always on time.",                                              avatar: "V", avatarBg: "linear-gradient(135deg,#4ade80,#10b981)" },
];

const howItWorks = [
  { step: "01", title: "Create Your Account", desc: "Sign up in under 30 seconds. No credit card required to get started.", IconComp: FaUsers },
  { step: "02", title: "Browse & Discover", desc: "Explore millions of products across every category with smart filters.", IconComp: FaBoxOpen },
  { step: "03", title: "Shop & Save", desc: "Add to cart, apply coupons, and checkout securely in one click.", IconComp: FaGift },
  { step: "04", title: "Track & Enjoy", desc: "Real-time order tracking from warehouse to your doorstep.", IconComp: FaTruck },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }),
};

/* ── TICKER ── */
function Ticker() {
  const items = ["Free delivery above ₹499", "Up to 70% off on Electronics", "New arrivals daily", "Earn rewards on every order", "7-day easy returns", "Secure checkout guaranteed"];
  return (
    <div className="bg-amazon-accent overflow-hidden py-2">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap w-max">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-amazon-text text-xs font-bold flex items-center gap-2">
            <FaFire className="text-amazon-text/60" /> {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── COUNTER ── */
function AnimatedCounter({ value }) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.]/g, "");
    let start = 0;
    const step = num / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start) + suffix);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-amazon-header/95 backdrop-blur-md shadow-xl" : "bg-amazon-header"} border-b border-white/10`}>
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amazon-accent flex items-center justify-center shadow-md">
              <HiSparkles className="text-amazon-text text-sm" />
            </div>
            <span className="text-xl font-black text-white tracking-tight leading-none">
              One<span className="text-amazon-accent">Cart</span>
              <span className="text-[10px] font-semibold text-white/30 ml-0.5">.com</span>
            </span>
          </div>
          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1 text-sm text-white/60">
            {[
              { label: "Features", id: "features" },
              { label: "Categories", id: "categories" },
              { label: "Sell", id: "sell" },
              { label: "About", id: "about" },
            ].map(l => (
              <button key={l.label}
                onClick={() => document.getElementById(l.id)?.scrollIntoView({ behavior: "smooth" })}
                className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-all font-medium text-sm">{l.label}</button>
            ))}
          </div>
          {/* CTA */}
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/login")}
              className="text-sm font-medium text-white/70 hover:text-white px-3.5 py-1.5 rounded-lg hover:bg-white/5 transition-all">
              Sign In
            </button>
            <button onClick={() => navigate("/register")}
              className="text-sm font-bold bg-amazon-accent text-amazon-text px-4 py-2 rounded-lg hover:bg-amazon-accent-hover transition-all shadow-md flex items-center gap-1.5">
              Get Started <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── HERO ── */}
      <section className="bg-amazon-header relative overflow-hidden min-h-[88vh] flex items-center">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-amazon-accent/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-purple-500/8 blur-[100px]" />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-[1280px] mx-auto px-6 py-20 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-amazon-accent/15 border border-amazon-accent/30 text-amazon-accent text-xs font-bold px-4 py-2 rounded-full mb-7">
                <HiSparkles className="text-sm" /> India's Smartest Shopping Platform
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl lg:text-[64px] font-black text-white leading-[1.08] tracking-tight mb-6">
                Everything<br />
                You Need,<br />
                <span className="text-amazon-accent relative inline-block">
                  One Cart Away.
                  <svg className="absolute left-0 w-full" style={{ bottom: "-6px", height: "10px" }} viewBox="0 0 300 10" preserveAspectRatio="none" fill="none">
                    <path d="M0 7 Q75 1 150 7 Q225 13 300 7" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"/>
                  </svg>
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/55 text-lg leading-relaxed max-w-lg mb-10">
                Millions of products. Unbeatable prices. Smart features like price alerts, mood shopping, and rewards — all in one beautifully designed place.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-12">
                <button onClick={() => navigate("/register")}
                  className="group flex items-center justify-center gap-2.5 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold px-8 py-4 rounded-2xl text-base shadow-2xl shadow-amazon-accent/40 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Start Shopping Free
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate("/login")}
                  className="flex items-center justify-center gap-2 border border-white/15 bg-white/5 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-2xl text-base transition-all backdrop-blur-sm">
                  Sign In to Account
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-5">
                {["Free delivery above ₹499", "7-day easy returns", "Secure checkout"].map((t, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-white/40 text-xs font-medium">
                    <FaCheckCircle className="text-amazon-accent/70 text-xs" /> {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — floating cards */}
            <div className="hidden lg:block relative h-[520px]">
              {/* Main card */}
              <motion.div initial={{ opacity: 0, y: 30, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ delay: 0.4, duration: 0.7 }}
                className="absolute top-8 left-8 right-8 bg-amazon-subheader/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-amazon-accent flex items-center justify-center">
                    <HiSparkles className="text-amazon-text text-lg" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">OneCart Dashboard</p>
                    <p className="text-white/40 text-xs">Your smart shopping hub</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Orders Placed", val: "24", color: "text-amazon-accent" },
                    { label: "Points Earned", val: "1,240", color: "text-purple-400" },
                    { label: "Saved via Alerts", val: "₹4,200", color: "text-green-400" },
                    { label: "Wishlist Items", val: "18", color: "text-pink-400" },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl p-3.5 border border-white/5">
                      <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
                      <p className="text-white/40 text-[11px] mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-amazon-accent/10 border border-amazon-accent/20 rounded-2xl p-3 flex items-center gap-3">
                  <FaBell className="text-amazon-accent" />
                  <div>
                    <p className="text-white text-xs font-bold">Price Alert Triggered!</p>
                    <p className="text-white/40 text-[11px]">Sony WH-1000XM5 dropped to ₹18,999</p>
                  </div>
                  <span className="ml-auto text-[10px] bg-amazon-accent text-amazon-text font-bold px-2 py-0.5 rounded-full">NEW</span>
                </div>
              </motion.div>

              {/* Floating badge 1 */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
                className="absolute bottom-16 right-0 bg-white rounded-2xl p-4 shadow-2xl border border-amazon-border flex items-center gap-3 w-52">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-lg">🚚</div>
                <div>
                  <p className="text-amazon-text text-xs font-bold">Out for Delivery</p>
                  <p className="text-amazon-text-secondary text-[11px]">Arriving today by 6 PM</p>
                </div>
              </motion.div>

              {/* Floating badge 2 */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}
                className="absolute bottom-4 left-0 bg-white rounded-2xl p-4 shadow-2xl border border-amazon-border flex items-center gap-3 w-48">
                <div className="w-10 h-10 rounded-xl bg-amazon-accent/10 flex items-center justify-center text-amazon-accent text-lg">⭐</div>
                <div>
                  <p className="text-amazon-text text-xs font-bold">4.9 / 5 Rating</p>
                  <p className="text-amazon-text-secondary text-[11px]">From 2M+ reviews</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-amazon-subheader border-y border-white/5">
        <div className="max-w-[1280px] mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amazon-accent/15 border border-amazon-accent/20 flex items-center justify-center text-amazon-accent text-lg flex-shrink-0">
                <s.IconComp />
              </div>
              <div>
                <p className="text-2xl font-black text-white leading-none">
                  <AnimatedCounter value={s.value} />
                </p>
                <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TRUST FEATURES ── */}
      <section className="bg-white py-14">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trustFeatures.map((f, i) => (
            <motion.div key={f.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="relative flex items-start gap-4 bg-amazon-section rounded-2xl p-5 border border-amazon-border hover:border-amazon-accent/40 hover:shadow-md transition-all group">
              {f.badge && (
                <span className="absolute top-3 right-3 text-[10px] font-black bg-amazon-accent text-amazon-text px-2 py-0.5 rounded-full">{f.badge}</span>
              )}
              <div className="w-11 h-11 rounded-xl bg-amazon-accent/10 flex items-center justify-center text-amazon-accent text-lg flex-shrink-0 group-hover:bg-amazon-accent group-hover:text-white transition-all">
                <f.IconComp />
              </div>
              <div>
                <p className="text-amazon-text font-bold text-sm mb-1">{f.title}</p>
                <p className="text-amazon-text-secondary text-xs leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="categories" className="bg-amazon-section py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-black text-amazon-accent uppercase tracking-widest">Browse</span>
            <h2 className="text-4xl font-black text-amazon-text mt-2 mb-3">Shop by Category</h2>
            <p className="text-amazon-text-secondary text-sm max-w-md mx-auto">From the latest gadgets to everyday essentials — find exactly what you're looking for.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((c, i) => (
              <motion.button key={c.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.05 }} whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/register")}
                className="flex flex-col items-center gap-3 bg-white rounded-2xl p-5 shadow-sm border border-amazon-border hover:border-amazon-accent hover:shadow-lg transition-all group cursor-pointer">
                <div style={{ background: c.iconBg }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  {c.emoji}
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-amazon-text group-hover:text-amazon-accent transition leading-tight">{c.label}</p>
                  <p className="text-[10px] text-amazon-text-secondary mt-0.5">{c.count}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLASH SALE ── */}
      <section className="py-12 px-6">
        <div className="max-w-[1280px] mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-amazon-header p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-white/5">
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-96 h-96 bg-amazon-accent/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-600/15 rounded-full blur-[80px] translate-x-1/4 translate-y-1/4" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center gap-1.5 text-xs font-black bg-red-500 text-white px-3 py-1.5 rounded-full animate-pulse">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" /> LIVE NOW
                </span>
                <span className="text-xs font-bold text-white/50 border border-white/10 px-3 py-1.5 rounded-full">Ends in 24 hours</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                Flash Sale<br /><span className="text-amazon-accent">Up to 70% Off</span>
              </h3>
              <p className="text-white/50 text-base max-w-md">Electronics, fashion, home & more. Thousands of deals refreshed every 24 hours. Don't miss out.</p>
              <div className="flex flex-wrap gap-3 mt-6">
                {["📱 Phones", "💻 Laptops", "👟 Footwear", "🎧 Audio"].map(tag => (
                  <span key={tag} className="text-xs font-semibold bg-white/10 text-white/70 border border-white/10 px-3 py-1.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <div className="relative z-10 flex-shrink-0 text-center">
              <button onClick={() => navigate("/register")}
                className="group flex items-center gap-3 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-black px-10 py-4 rounded-2xl text-base shadow-2xl shadow-amazon-accent/40 transition-all hover:scale-105">
                Shop the Sale <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-white/30 text-xs mt-3">No account needed to browse</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-amazon-section py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-black text-amazon-accent uppercase tracking-widest">Simple Process</span>
            <h2 className="text-4xl font-black text-amazon-text mt-2 mb-3">How OneCart Works</h2>
            <p className="text-amazon-text-secondary text-sm">From sign-up to delivery in four easy steps.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-amazon-accent/30 to-transparent" />
            {howItWorks.map((step, i) => (
              <motion.div key={step.step} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="relative flex flex-col items-center text-center bg-white rounded-3xl p-8 border border-amazon-border shadow-sm hover:shadow-lg hover:border-amazon-accent/30 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-amazon-accent/10 border-2 border-amazon-accent/20 flex items-center justify-center text-amazon-accent text-2xl mb-5 group-hover:bg-amazon-accent group-hover:text-white group-hover:border-amazon-accent transition-all relative z-10">
                  <step.IconComp />
                </div>
                <span className="absolute top-5 right-5 text-5xl font-black text-amazon-section group-hover:text-amazon-accent/10 transition-colors">{step.step}</span>
                <h3 className="text-sm font-bold text-amazon-text mb-2">{step.title}</h3>
                <p className="text-xs text-amazon-text-secondary leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-black text-amazon-accent uppercase tracking-widest">Built for You</span>
            <h2 className="text-4xl font-black text-amazon-text mt-2 mb-3">Why Shoppers Love OneCart</h2>
            <p className="text-amazon-text-secondary text-sm max-w-lg mx-auto">We've packed in features that make every shopping session smarter, faster and more rewarding.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <motion.div key={h.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                whileHover={{ y: -4 }}
                style={{ backgroundColor: h.cardBg, borderColor: h.cardBorder }}
                className="rounded-3xl p-7 border hover:shadow-xl transition-all group cursor-default">
                <div style={{ background: h.iconBg }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <h.IconComp />
                </div>
                <h3 className="text-base font-bold text-amazon-text mb-2">{h.title}</h3>
                <p className="text-sm text-amazon-text-secondary leading-relaxed">{h.desc}</p>
                <button onClick={() => navigate("/register")}
                  className="mt-5 text-xs font-bold text-amazon-accent flex items-center gap-1.5 hover:gap-2.5 transition-all">
                  Learn more <FaArrowRight className="text-[10px]" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="about" className="bg-amazon-section py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-black text-amazon-accent uppercase tracking-widest">Social Proof</span>
            <h2 className="text-4xl font-black text-amazon-text mt-2 mb-3">What Our Shoppers Say</h2>
            <p className="text-amazon-text-secondary text-sm">Trusted by millions. Here's what real customers think.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-6 border border-amazon-border shadow-sm hover:shadow-lg transition-all flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <FaStar key={s} className={`text-sm ${s < t.rating ? "text-amazon-accent" : "text-amazon-border"}`} />
                  ))}
                </div>
                <p className="text-sm text-amazon-text leading-relaxed flex-1 mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-amazon-border">
                  <div style={{ background: t.avatarBg }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amazon-text">{t.name}</p>
                    <p className="text-[11px] text-amazon-text-secondary">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELLER BANNER ── */}
      <section id="sell" className="py-12 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="rounded-3xl bg-amazon-header border border-amazon-accent/20 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-amazon-accent/15 rounded-full blur-[80px]" />
            </div>
            <div className="relative z-10">
              <span className="text-xs font-black text-amazon-accent uppercase tracking-widest bg-amazon-accent/10 border border-amazon-accent/30 px-3 py-1 rounded-full">For Sellers</span>
              <h3 className="text-3xl font-black text-white mt-4 mb-3">Start Selling on OneCart Today</h3>
              <p className="text-white/70 text-sm max-w-lg leading-relaxed">Join over 50,000 sellers already growing their business on OneCart. Easy setup, powerful tools, and instant payouts.</p>
              <div className="flex flex-wrap gap-5 mt-6">
                {["Zero listing fees", "Real-time analytics", "Instant payouts", "Dedicated support"].map(f => (
                  <span key={f} className="flex items-center gap-1.5 text-xs text-white/80 font-semibold">
                    <FaCheckCircle className="text-amazon-accent text-xs flex-shrink-0" /> {f}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={() => navigate(user ? "/sell" : "/login")}
              className="relative z-10 flex-shrink-0 flex items-center gap-2.5 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-black px-8 py-4 rounded-2xl text-sm shadow-xl shadow-amazon-accent/30 transition-all hover:scale-105">
              <FaStore /> Start Selling Free
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-amazon-header py-12 px-6">
        <div className="max-w-[1280px] mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-amazon-accent/10 border border-amazon-accent/20 rounded-2xl px-8 py-7">
            <div>
              <h2 className="text-xl font-black text-white mb-1">Ready to shop smarter?</h2>
              <p className="text-white/50 text-sm">Join 2M+ shoppers — free forever, no card needed.</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={() => navigate("/login")}
                className="px-5 py-2.5 border border-white/20 text-white/70 hover:text-white text-sm font-semibold rounded-xl transition">
                Sign In
              </button>
              <button onClick={() => navigate("/register")}
                className="flex items-center gap-2 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-black px-6 py-2.5 rounded-xl text-sm shadow-lg transition">
                Get Started <FaArrowRight className="text-xs" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-amazon-subheader border-t border-white/5 py-6 px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amazon-accent flex items-center justify-center">
              <HiSparkles className="text-amazon-text text-[10px]" />
            </div>
            <span className="text-white font-black text-sm">One<span className="text-amazon-accent">Cart</span></span>
            <span className="text-white/20 text-xs ml-1">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/35">
            {[["About", "/about"], ["Careers", "/careers"], ["Privacy", "/privacy"], ["Terms", "/conditions"], ["Contact", "/contact"], ["FAQ", "/faq"]].map(([l, p]) => (
              <button key={l} onClick={() => navigate(p)} className="hover:text-amazon-accent transition">{l}</button>
            ))}
          </div>
          <p className="text-white/20 text-xs">India's smartest shopping platform</p>
        </div>
      </footer>

    </div>
  );
}
