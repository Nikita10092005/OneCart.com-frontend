import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash, FaLeaf, FaShoppingBag, FaTruck, FaStar } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FieldError({ msg }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-red-500 text-xs mt-1 font-medium"
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

const features = [
  { icon: <FaShoppingBag />, text: "10,000+ products across all categories" },
  { icon: <FaTruck />,       text: "Fast delivery to your doorstep" },
  { icon: <FaStar />,        text: "Trusted by 5 lakh+ happy shoppers" },
  { icon: <FaLeaf />,        text: "Eco-friendly packaging on every order" },
];

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [touched, setTouched]   = useState({ email: false, password: false });
  const { login } = useAuth();
  const navigate  = useNavigate();

  const bannerRef = useRef(null);
  const formRef   = useRef(null);
  const floatRef  = useRef([]);

  /* ── field-level validation ──
     Login only checks that fields are filled + email format is valid.
     No password format rules — existing users may have any password. */
  const emailError = touched.email && (
    !email.trim()         ? "Email is required" :
    !EMAIL_RE.test(email) ? "Enter a valid email address (e.g. you@example.com)" :
    null
  );

  const passwordError = touched.password && (
    !password ? "Password is required" : null
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      // banner slides in from left
      gsap.fromTo(bannerRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      );
      // form slides in from right
      gsap.fromTo(formRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: "power3.out" }
      );
      // floating blobs
      floatRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: i % 2 === 0 ? -18 : 18,
          x: i % 2 === 0 ? 10 : -10,
          duration: 3 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    });
    return () => ctx.revert();
  }, []);

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    if (!email.trim() || !EMAIL_RE.test(email)) { setError("Please enter a valid email address"); return; }
    if (!password) { setError("Please enter your password"); return; }
    setLoading(true); setError("");
    try {
      const res = await API.post("/auth/login", { email: email.trim(), password });
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === "admin" ? "/admin" : "/home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-amazon-section">

      {/* ── LEFT BANNER ── */}
      <div ref={bannerRef}
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(145deg, #131921 0%, #232F3E 40%, #131921 100%)" }}>

        {/* decorative blobs */}
        <div ref={el => floatRef.current[0] = el}
          className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(255,153,0,0.3), transparent)" }} />
        <div ref={el => floatRef.current[1] = el}
          className="absolute bottom-[-80px] right-[-40px] w-96 h-96 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.2), transparent)" }} />
        <div ref={el => floatRef.current[2] = el}
          className="absolute top-[40%] right-[-30px] w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff, transparent)" }} />

        {/* LOGO */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
            <HiSparkles className="text-white text-base" />
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-black text-white">One</span>
            <span className="text-2xl font-black text-amazon-accent">Cart</span>
            <span className="text-xs font-semibold text-white/50 ml-0.5">.com</span>
          </div>
        </div>

        {/* HERO TEXT */}
        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
              Welcome back to<br />
              <span className="text-amazon-accent">your favourite</span><br />
              shopping space 🛍
            </h1>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Sign in to access your orders, wishlist, and exclusive deals curated just for you.
            </p>
          </motion.div>

          {/* FEATURE LIST */}
          <div className="space-y-3">
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.1 }}
                className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white text-xs flex-shrink-0">
                  {f.icon}
                </div>
                <span className="text-white/80 text-sm">{f.text}</span>
              </motion.div>
            ))}
          </div>

          {/* TESTIMONIAL CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 max-w-xs">
            <p className="text-white/90 text-sm italic mb-3">
              "OneCart has the best deals and fastest delivery. I shop here every week!"
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amazon-accent flex items-center justify-center text-amazon-text font-bold text-xs">P</div>
              <div>
                <p className="text-white text-xs font-bold">Priya S.</p>
                <p className="text-white/50 text-xs">Verified Customer</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => <span key={i} className="text-amber-300 text-xs">★</span>)}
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM TAG */}
        <p className="relative z-10 text-white/40 text-xs">© 2026 OneCart.com · All rights reserved</p>
      </div>

      {/* ── RIGHT FORM ── */}
      <div ref={formRef}
        className="flex-1 flex items-center justify-center px-6 py-12 bg-amazon-section">
        <div className="w-full max-w-md bg-white border border-amazon-border shadow-md rounded-2xl px-8 py-10">

          {/* mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-xl bg-amazon-accent flex items-center justify-center">
              <HiSparkles className="text-amazon-text text-sm" />
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-black text-amazon-text">One</span>
              <span className="text-2xl font-black text-amazon-accent">Cart</span>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-amazon-text mb-1">Sign in</h2>
          <p className="text-amazon-text-secondary text-sm mb-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-amazon-accent hover:text-amazon-accent-hover font-semibold hover:underline">Create one free</Link>
          </p>

          {/* ERROR */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-500 text-red-600 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
              ⚠️ {error}
            </motion.div>
          )}

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-amazon-text uppercase tracking-widest mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              placeholder="you@example.com"
              className={`w-full bg-white border text-amazon-text placeholder-amazon-text-secondary text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent transition
                ${emailError ? "border-red-400 bg-red-50" : "border-amazon-border"}`}
            />
            <FieldError msg={emailError} />
          </div>

          {/* PASSWORD */}
          <div className="mb-7">
            <label className="block text-xs font-bold text-amazon-text uppercase tracking-widest mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                placeholder="Your password"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                className={`w-full bg-white border text-amazon-text placeholder-amazon-text-secondary text-sm rounded-xl px-4 py-3.5 pr-11 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent transition
                  ${passwordError ? "border-red-400 bg-red-50" : "border-amazon-border"}`}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amazon-text-secondary hover:text-amazon-text transition">
                {showPw ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>
            <FieldError msg={passwordError} />
          </div>

          {/* SUBMIT */}
          <motion.button onClick={handleLogin} disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold rounded-xl text-sm disabled:opacity-60 shadow-lg shadow-black/10 mb-5">
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                    className="w-4 h-4 border-2 border-amazon-text border-t-transparent rounded-full" />
                  Signing in...
                </span>
              : "Sign In →"
            }
          </motion.button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-amazon-border" />
            <span className="text-xs text-amazon-text-secondary font-medium">or continue with</span>
            <div className="flex-1 h-px bg-amazon-border" />
          </div>

          {/* GOOGLE */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async cr => {
                try {
                  const res = await API.post("/auth/google", { token: cr.credential });
                  login(res.data.user, res.data.token);
                  navigate(res.data.user.role === "admin" ? "/admin" : "/home");
                } catch { setError("Google login failed"); }
              }}
              onError={() => setError("Google login failed")}
            />
          </div>

          <p className="text-center text-xs text-amazon-text-secondary mt-8">
            By signing in you agree to our{" "}
            <span className="underline cursor-pointer hover:text-amazon-accent">Terms</span> &{" "}
            <span className="underline cursor-pointer hover:text-amazon-accent">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
