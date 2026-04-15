import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash, FaCheck, FaGift, FaShieldAlt, FaBolt, FaHeart } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const perks = [
  { icon: <FaGift />,      text: "Exclusive welcome offers on signup" },
  { icon: <FaBolt />,      text: "Flash deals before anyone else" },
  { icon: <FaShieldAlt />, text: "100% secure payments & data" },
  { icon: <FaHeart />,     text: "Save favourites to your wishlist" },
];

/* ── helpers ── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  return Math.min(score, 3);
}

const strengthLabel = ["", "Weak", "Good", "Strong"];
const strengthColor = ["", "#ef4444", "#f59e0b", "#10b981"];
const strengthText  = ["", "text-red-500", "text-amber-500", "text-emerald-600"];

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

export default function Register() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [touched,  setTouched]  = useState({ name: false, email: false, password: false });
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const bannerRef = useRef(null);
  const formRef   = useRef(null);
  const floatRef  = useRef([]);

  const pwStrength = getPasswordStrength(password);

  /* ── field-level validation ── */
  const nameError = touched.name && (
    !name.trim()                        ? "Name is required" :
    name.trim().length < 2              ? "Name must be at least 2 characters" :
    /\d/.test(name)                     ? "Name cannot contain numbers" :
    /[^a-zA-Z\s'.,-]/.test(name)       ? "Name can only contain letters and spaces" :
    null
  );

  const emailError = touched.email && (
    !email.trim()           ? "Email is required" :
    !EMAIL_RE.test(email)   ? "Enter a valid email address" :
    null
  );

  const passwordError = touched.password && (
    !password               ? "Password is required" :
    password.length < 6     ? "Password must be at least 6 characters" :
    /^\d+$/.test(password)  ? "Password cannot be numbers only" :
    /^[a-zA-Z]+$/.test(password) ? "Password must include at least one number or symbol" :
    null
  );

  const isFormValid = !nameError && !emailError && !passwordError &&
    name.trim() && email.trim() && password;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(formRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      );
      gsap.fromTo(bannerRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: "power3.out" }
      );
      floatRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: i % 2 === 0 ? -20 : 16,
          x: i % 2 === 0 ? -12 : 12,
          duration: 3.5 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    });
    return () => ctx.revert();
  }, []);

  /* block numbers in name field */
  const handleNameChange = (e) => {
    const val = e.target.value;
    if (/\d/.test(val.slice(-1))) return; // block digit input live
    setName(val);
  };

  /* block non-numeric chars that shouldn't be in password — allow all but enforce on submit */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegister = async () => {
    setTouched({ name: true, email: true, password: true });
    if (nameError || emailError || passwordError || !name || !email || !password) {
      setError("Please fix the errors above before continuing.");
      return;
    }
    setLoading(true); setError("");
    try {
      await API.post("/auth/register", { name: name.trim(), email: email.trim(), password });
      setSuccess("Account created! Redirecting to login... 🎉");
      setTimeout(() => navigate("/login"), 2200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-amazon-section">

      {/* ── LEFT FORM ── */}
      <div ref={formRef}
        className="flex-1 flex items-center justify-center px-6 py-12 bg-amazon-section order-1 lg:order-none">
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

          <h2 className="text-3xl font-extrabold text-amazon-text mb-1">Create account</h2>
          <p className="text-amazon-text-secondary text-sm mb-8">
            Already have an account?{" "}
            <Link to="/login" className="text-amazon-accent hover:text-amazon-accent-hover font-semibold hover:underline">Sign in</Link>
          </p>

          {/* SUCCESS */}
          {success && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-400 text-green-700 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
              <FaCheck size={12} /> {success}
            </motion.div>
          )}

          {/* GLOBAL ERROR */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-400 text-red-600 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
              ⚠️ {error}
            </motion.div>
          )}

          {/* NAME */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-amazon-text uppercase tracking-widest mb-1.5">Full Name</label>
            <input
              value={name}
              onChange={handleNameChange}
              onBlur={() => setTouched(t => ({ ...t, name: true }))}
              placeholder="Enter your full name"
              autoComplete="off"
              className={`w-full bg-white border text-amazon-text placeholder-amazon-text-secondary text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent transition
                ${nameError ? "border-red-400 bg-red-50" : "border-amazon-border"}`}
            />
            <FieldError msg={nameError} />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-amazon-text uppercase tracking-widest mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              placeholder="you@example.com"
              autoComplete="new-email"
              className={`w-full bg-white border text-amazon-text placeholder-amazon-text-secondary text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent transition
                ${emailError ? "border-red-400 bg-red-50" : "border-amazon-border"}`}
            />
            <FieldError msg={emailError} />
          </div>

          {/* PASSWORD */}
          <div className="mb-2">
            <label className="block text-xs font-bold text-amazon-text uppercase tracking-widest mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                placeholder="Min 6 chars, include a number"
                onKeyDown={e => e.key === "Enter" && handleRegister()}
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

          {/* STRENGTH BAR — fixed: uses width transition not opacity */}
          {password.length > 0 && (
            <div className="mb-5 mt-2">
              <div className="flex gap-1 mb-1.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-1.5 flex-1 rounded-full bg-gray-200 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: i <= pwStrength ? "100%" : "0%" }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      style={{ backgroundColor: i <= pwStrength ? strengthColor[pwStrength] : "transparent" }}
                    />
                  </div>
                ))}
              </div>
              <p className={`text-xs font-semibold ${strengthText[pwStrength]}`}>
                {strengthLabel[pwStrength]}
                {pwStrength === 1 && " — add numbers & uppercase"}
                {pwStrength === 2 && " — add uppercase & symbols to strengthen"}
              </p>
            </div>
          )}

          {/* SUBMIT */}
          <motion.button
            onClick={handleRegister}
            disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold rounded-xl text-sm disabled:opacity-60 shadow-lg shadow-black/10 mb-5 mt-2">
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                    className="w-4 h-4 border-2 border-amazon-text border-t-transparent rounded-full" />
                  Creating account...
                </span>
              : "Create Account →"
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
                  navigate("/home");
                } catch { setError("Google signup failed"); }
              }}
              onError={() => setError("Google signup failed")}
            />
          </div>

          <p className="text-center text-xs text-amazon-text-secondary mt-8">
            By creating an account you agree to our{" "}
            <span className="underline cursor-pointer hover:text-amazon-accent">Terms</span> &{" "}
            <span className="underline cursor-pointer hover:text-amazon-accent">Privacy Policy</span>
          </p>
        </div>
      </div>

      {/* ── RIGHT BANNER ── */}
      <div ref={bannerRef}
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12 order-2"
        style={{ background: "linear-gradient(145deg, #232F3E 0%, #131921 50%, #232F3E 100%)" }}>

        <div ref={el => floatRef.current[0] = el}
          className="absolute top-[-50px] right-[-50px] w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(255,153,0,0.3), transparent)" }} />
        <div ref={el => floatRef.current[1] = el}
          className="absolute bottom-[-60px] left-[-40px] w-96 h-96 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.2), transparent)" }} />
        <div ref={el => floatRef.current[2] = el}
          className="absolute top-[35%] left-[-20px] w-52 h-52 rounded-full opacity-10"
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
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
              Join millions of<br />
              <span className="text-amazon-accent">smart shoppers</span><br />
              today ✨
            </h1>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Create your free account and unlock exclusive deals, fast delivery, and a seamless shopping experience.
            </p>
          </motion.div>

          <div className="space-y-3">
            {perks.map((p, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.1 }}
                className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white text-xs flex-shrink-0">
                  {p.icon}
                </div>
                <span className="text-white/80 text-sm">{p.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
            className="grid grid-cols-3 gap-3">
            {[
              { val: "5L+",  label: "Happy Shoppers" },
              { val: "10K+", label: "Products" },
              { val: "4.8★", label: "Avg Rating" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-3 text-center">
                <p className="text-white font-extrabold text-lg leading-none">{s.val}</p>
                <p className="text-white/60 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="relative z-10 text-white/40 text-xs">© 2026 OneCart.com · All rights reserved</p>
      </div>
    </div>
  );
}
