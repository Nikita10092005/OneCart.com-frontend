import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCreditCard, FaMobileAlt, FaTshirt, FaShoppingCart, FaTag,
  FaUserCheck, FaFlag, FaMoneyBillWave, FaStar, FaFileAlt,
  FaIdCard, FaTruck, FaGift, FaShieldAlt, FaChevronDown,
  FaChevronUp, FaCheckCircle, FaTimesCircle, FaArrowRight,
} from "react-icons/fa";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const TIERS = [
  {
    id: "basic",
    name: "OneCart Basic",
    color: "from-gray-700 to-gray-900",
    accent: "text-amber-400",
    limit: "₹1,00,000",
    joining: "₹0",
    annual: "₹499 (waived on ₹1L spend)",
    cashback: [
      { cat: "Electronics", rate: "3%" },
      { cat: "Fashion", rate: "2%" },
      { cat: "All Others", rate: "1%" },
    ],
    perks: ["Free delivery for 1 month", "Priority customer support", "Exclusive sale early access"],
  },
  {
    id: "premium",
    name: "OneCart Premium",
    color: "from-amber-600 to-yellow-500",
    accent: "text-white",
    limit: "₹5,00,000",
    joining: "₹999",
    annual: "₹1,999 (waived on ₹3L spend)",
    cashback: [
      { cat: "Electronics", rate: "5%" },
      { cat: "Fashion", rate: "3%" },
      { cat: "All Others", rate: "2%" },
    ],
    perks: [
      "Free delivery for 3 months",
      "₹500 welcome bonus",
      "Lounge access at 50+ airports",
      "Dedicated relationship manager",
      "Exclusive premium sale access",
    ],
    recommended: true,
  },
];

const ELIGIBILITY = [
  { icon: <FaUserCheck />, label: "Age 21+" },
  { icon: <FaFlag />, label: "Indian resident" },
  { icon: <FaMoneyBillWave />, label: "Monthly income ₹25,000+" },
  { icon: <FaStar />, label: "Good credit score (700+)" },
];

const STEPS = [
  { step: "01", title: "Fill Application", desc: "Complete the online form with your personal and financial details.", icon: <FaFileAlt /> },
  { step: "02", title: "KYC Verification", desc: "Submit Aadhaar, PAN, and income proof for quick digital verification.", icon: <FaIdCard /> },
  { step: "03", title: "Card Delivered", desc: "Once approved, your card arrives at your doorstep within 7 working days.", icon: <FaTruck /> },
];

const FAQS = [
  { q: "How is cashback credited?", a: "Cashback is credited to your OneCart Wallet within 48 hours of a successful transaction. You can use it on your next purchase." },
  { q: "What is the credit limit?", a: "Basic card starts at ₹1,00,000 and Premium at ₹5,00,000. Limits may be increased based on your spending history and income." },
  { q: "Can I use it on other platforms?", a: "Yes, the OneCart Business Card works on all platforms and merchants that accept Visa/Mastercard. Cashback applies only on OneCart purchases." },
  { q: "How long does approval take?", a: "Most applications are reviewed within 2 business days. You'll receive an email and in-app notification once a decision is made." },
  { q: "Is there a joining fee?", a: "Basic card has zero joining fee. Premium card has a ₹999 joining fee, which is offset by the ₹500 welcome bonus and first-month free delivery." },
  { q: "Can I upgrade from Basic to Premium?", a: "Yes, you can upgrade anytime from your account settings. The upgrade is instant and your new card will be dispatched within 7 days." },
];

// ── Visual Card Mockup ────────────────────────────────────────────────────────
function CardMockup({ tier }) {
  const t = TIERS.find((x) => x.id === tier) || TIERS[0];
  return (
    <motion.div
      key={tier}
      initial={{ opacity: 0, rotateY: -15 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative w-80 h-48 rounded-2xl bg-gradient-to-br ${t.color} p-6 shadow-2xl select-none mx-auto`}
      style={{ perspective: "1000px" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-white/60 text-xs uppercase tracking-widest">OneCart</p>
          <p className={`font-extrabold text-sm ${t.accent}`}>{t.name}</p>
        </div>
        <FaCreditCard className="text-white/40 text-3xl" />
      </div>
      <p className="text-white/80 text-lg font-mono tracking-widest mb-4">•••• •••• •••• 4242</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-wide">Card Holder</p>
          <p className="text-white text-sm font-semibold">YOUR NAME</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-xs uppercase tracking-wide">Expires</p>
          <p className="text-white text-sm font-semibold">12/28</p>
        </div>
      </div>
      {/* shine effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
    </motion.div>
  );
}

// ── Cashback Calculator ───────────────────────────────────────────────────────
function CashbackCalculator() {
  const [spend, setSpend] = useState(20000);
  const [tier, setTier] = useState("premium");
  const rates = tier === "premium" ? { electronics: 0.05, fashion: 0.03, others: 0.02 } : { electronics: 0.03, fashion: 0.02, others: 0.01 };
  const split = { electronics: spend * 0.3, fashion: spend * 0.25, others: spend * 0.45 };
  const total = Math.round(split.electronics * rates.electronics + split.fashion * rates.fashion + split.others * rates.others);
  const annual = total * 12;

  return (
    <div className="bg-white rounded-2xl border border-amazon-border p-6 shadow-sm">
      <h3 className="text-base font-extrabold text-amazon-text mb-1">Cashback Calculator</h3>
      <p className="text-xs text-amazon-text-secondary mb-5">See how much you can earn every month</p>
      <div className="flex gap-2 mb-5">
        {TIERS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTier(t.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${tier === t.id ? "bg-amazon-accent text-white" : "bg-amazon-section text-amazon-text-secondary hover:bg-amazon-border"}`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-amazon-text-secondary">Monthly spend</span>
          <span className="text-sm font-bold text-amazon-text">₹{spend.toLocaleString("en-IN")}</span>
        </div>
        <input
          type="range" min={5000} max={200000} step={1000}
          value={spend} onChange={(e) => setSpend(Number(e.target.value))}
          className="w-full accent-amazon-accent"
        />
        <div className="flex justify-between text-xs text-amazon-text-secondary mt-1">
          <span>₹5,000</span><span>₹2,00,000</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Electronics (30%)", amount: Math.round(split.electronics * rates.electronics), color: "text-blue-500" },
          { label: "Fashion (25%)", amount: Math.round(split.fashion * rates.fashion), color: "text-purple-500" },
          { label: "Others (45%)", amount: Math.round(split.others * rates.others), color: "text-emerald-500" },
        ].map((item) => (
          <div key={item.label} className="bg-amazon-section rounded-xl p-3 text-center">
            <p className={`text-base font-extrabold ${item.color}`}>₹{item.amount.toLocaleString("en-IN")}</p>
            <p className="text-xs text-amazon-text-secondary mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-amazon-accent/10 border border-amazon-accent/20 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-amazon-text-secondary">Monthly cashback</p>
          <p className="text-2xl font-extrabold text-amazon-accent">₹{total.toLocaleString("en-IN")}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-amazon-text-secondary">Annual savings</p>
          <p className="text-lg font-extrabold text-emerald-600">₹{annual.toLocaleString("en-IN")}</p>
        </div>
      </div>
    </div>
  );
}

// ── Application Form ──────────────────────────────────────────────────────────
function ApplicationForm({ selectedTier, onClose, onSuccess }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", pan: "", monthlyIncome: "", cardTier: selectedTier || "basic" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Must be 10 digits";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan.toUpperCase())) e.pan = "Invalid PAN format";
    if (!form.monthlyIncome || Number(form.monthlyIncome) < 25000) e.monthlyIncome = "Minimum ₹25,000 required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError(null);
    try {
      await API.post("/card-application", { ...form, pan: form.pan.toUpperCase() });
      onSuccess();
    } catch (err) {
      setApiError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (name, placeholder, type = "text", extra = {}) => (
    <div>
      <input
        type={type} placeholder={placeholder} value={form[name]}
        onChange={(e) => { setForm((p) => ({ ...p, [name]: e.target.value })); setErrors((p) => ({ ...p, [name]: undefined })); }}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/40 ${errors[name] ? "border-red-400 bg-red-50" : "border-amazon-border"}`}
        {...extra}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-amazon-border">
          <div>
            <h2 className="text-lg font-extrabold text-amazon-text">Card Application</h2>
            <p className="text-xs text-amazon-text-secondary mt-0.5">Fill in your details to apply</p>
          </div>
          <button onClick={onClose} className="text-amazon-text-secondary hover:text-amazon-text"><FaTimesCircle className="text-xl" /></button>
        </div>
        {apiError && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{apiError}</div>
        )}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-2 mb-2">
            {TIERS.map((t) => (
              <button key={t.id} type="button" onClick={() => setForm((p) => ({ ...p, cardTier: t.id }))}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors ${form.cardTier === t.id ? "bg-amazon-accent text-white border-amazon-accent" : "border-amazon-border text-amazon-text-secondary hover:border-amazon-accent"}`}>
                {t.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field("name", "Full name")}
            {field("email", "Email address", "email")}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field("phone", "Phone (10 digits)", "text", { maxLength: 10 })}
            {field("pan", "PAN number", "text", { maxLength: 10, className: `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/40 uppercase ${errors.pan ? "border-red-400 bg-red-50" : "border-amazon-border"}` })}
          </div>
          {field("monthlyIncome", "Monthly income (₹)", "number")}
          <button type="submit" disabled={loading}
            className="w-full bg-amazon-accent hover:bg-amazon-accent/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            {loading ? <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Submitting…</> : <><FaArrowRight />Submit Application</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BusinessCard() {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState("premium");
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [myApp, setMyApp] = useState(null);

  useEffect(() => {
    if (!user) return;
    API.get("/card-application/my").then((r) => setMyApp(r.data)).catch(() => {});
  }, [user]);

  const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 4000); };
  const handleSuccess = () => {
    setShowForm(false);
    setMyApp({ status: "pending" });
    showToast("success", "Application submitted! We'll review it within 2 business days.");
  };

  const tier = TIERS.find((t) => t.id === selectedTier);

  const ctaBlock = () => {
    if (!user) return (
      <button onClick={() => setShowForm(true)} className="bg-amazon-accent hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
        Apply Now <FaArrowRight />
      </button>
    );
    if (myApp?.status === "pending") return (
      <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-6 py-3 rounded-xl">
        <FaCheckCircle /> Application under review
      </div>
    );
    if (myApp?.status === "approved") return (
      <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-6 py-3 rounded-xl">
        <FaCheckCircle /> Your card has been approved!
      </div>
    );
    if (myApp?.status === "rejected") return (
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-3 rounded-xl">
          <FaTimesCircle /> Application rejected: {myApp.rejectionReason || "Please contact support."}
        </div>
      </div>
    );
    return (
      <button onClick={() => setShowForm(true)} className="bg-amazon-accent hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
        Apply Now <FaArrowRight />
      </button>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-amazon-section">

        {/* HERO */}
        <div className="bg-amazon-header text-white py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #f90 0%, transparent 50%)" }} />
          <div className="max-w-5xl mx-auto relative flex flex-col md:flex-row items-center gap-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <FaCreditCard className="text-amazon-accent text-xl" />
                <span className="text-amazon-accent text-xs font-bold uppercase tracking-widest border border-amazon-accent/30 px-3 py-1 rounded-full">OneCart Payment</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                OneCart <span className="text-amazon-accent">Business Card</span>
              </h1>
              <p className="text-white/70 text-base max-w-md leading-relaxed mb-6">
                Earn up to 5% cashback on every purchase. Zero annual fee first year. Delivered in 7 days.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                {ctaBlock()}
                <div className="flex gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1"><FaShieldAlt className="text-amazon-accent" /> Secure</span>
                  <span className="flex items-center gap-1"><FaGift className="text-amazon-accent" /> ₹500 Welcome Bonus</span>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="shrink-0">
              <CardMockup tier={selectedTier} />
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

          {/* CARD COMPARISON */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-8">
              <p className="text-amazon-accent text-xs font-bold uppercase tracking-widest mb-2">Choose Your Card</p>
              <h2 className="text-2xl font-extrabold text-amazon-text">Compare Card Tiers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TIERS.map((t) => (
                <motion.div
                  key={t.id}
                  onClick={() => setSelectedTier(t.id)}
                  whileHover={{ scale: 1.01 }}
                  className={`relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all shadow-sm ${selectedTier === t.id ? "border-amazon-accent shadow-md" : "border-amazon-border hover:border-amazon-accent/40"}`}
                >
                  {t.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amazon-accent text-white text-xs font-bold px-4 py-1 rounded-full">
                      Recommended
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-4`}>
                    <FaCreditCard className="text-white text-lg" />
                  </div>
                  <h3 className="text-base font-extrabold text-amazon-text mb-1">{t.name}</h3>
                  <p className="text-xs text-amazon-text-secondary mb-4">Credit limit up to {t.limit}</p>
                  <div className="space-y-2 mb-4">
                    {t.cashback.map((c) => (
                      <div key={c.cat} className="flex justify-between text-sm">
                        <span className="text-amazon-text-secondary">{c.cat}</span>
                        <span className="font-bold text-amazon-accent">{c.rate} cashback</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-amazon-border pt-4 space-y-1">
                    {t.perks.map((p) => (
                      <div key={p} className="flex items-center gap-2 text-xs text-amazon-text">
                        <FaCheckCircle className="text-emerald-500 shrink-0" /> {p}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-amazon-text-secondary">
                    <span>Joining: <span className="font-semibold text-amazon-text">{t.joining}</span></span>
                    <span>Annual: <span className="font-semibold text-amazon-text">{t.annual}</span></span>
                  </div>
                  {selectedTier === t.id && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-amazon-accent flex items-center justify-center">
                      <FaCheckCircle className="text-white text-xs" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CASHBACK CALCULATOR */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-8">
              <p className="text-amazon-accent text-xs font-bold uppercase tracking-widest mb-2">Estimate Your Earnings</p>
              <h2 className="text-2xl font-extrabold text-amazon-text">Cashback Calculator</h2>
            </div>
            <CashbackCalculator />
          </motion.section>

          {/* WELCOME BENEFITS */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-8">
              <p className="text-amazon-accent text-xs font-bold uppercase tracking-widest mb-2">First-Time Perks</p>
              <h2 className="text-2xl font-extrabold text-amazon-text">Welcome Benefits</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <FaGift />, title: "₹500 Welcome Bonus", desc: "Credited to your OneCart Wallet on first transaction. Premium card only.", color: "bg-amber-50 border-amber-100 text-amber-500" },
                { icon: <FaTruck />, title: "Free Delivery — 3 Months", desc: "Unlimited free delivery on all orders for your first 3 months. Premium card only.", color: "bg-blue-50 border-blue-100 text-blue-500" },
                { icon: <FaStar />, title: "Exclusive Sale Access", desc: "Get early access to all OneCart sales — 24 hours before everyone else.", color: "bg-purple-50 border-purple-100 text-purple-500" },
              ].map((b, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 text-lg ${b.color}`}>{b.icon}</div>
                  <h3 className="text-sm font-bold text-amazon-text mb-2">{b.title}</h3>
                  <p className="text-xs text-amazon-text-secondary leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ELIGIBILITY + HOW TO APPLY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 rounded-full bg-amazon-accent" />
                <h2 className="text-xl font-extrabold text-amazon-text">Eligibility</h2>
              </div>
              <div className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm space-y-3">
                {ELIGIBILITY.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-amazon-section">
                    <div className="w-8 h-8 rounded-lg bg-amazon-accent/10 flex items-center justify-center text-amazon-accent">{item.icon}</div>
                    <span className="text-sm font-medium text-amazon-text">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.section>
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 rounded-full bg-amazon-accent" />
                <h2 className="text-xl font-extrabold text-amazon-text">How to Apply</h2>
              </div>
              <div className="space-y-3">
                {STEPS.map((step, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-amazon-border p-4 shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amazon-accent/10 border border-amazon-accent/20 flex items-center justify-center text-amazon-accent shrink-0">{step.icon}</div>
                    <div>
                      <div className="text-xs font-bold text-amazon-accent mb-0.5">Step {step.step}</div>
                      <h3 className="text-sm font-bold text-amazon-text mb-1">{step.title}</h3>
                      <p className="text-xs text-amazon-text-secondary leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* FAQ */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-8">
              <p className="text-amazon-accent text-xs font-bold uppercase tracking-widest mb-2">Got Questions?</p>
              <h2 className="text-2xl font-extrabold text-amazon-text">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-3 max-w-3xl mx-auto">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-amazon-border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-amazon-text">{faq.q}</span>
                    {openFaq === i ? <FaChevronUp className="text-amazon-accent shrink-0" /> : <FaChevronDown className="text-amazon-text-secondary shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <p className="px-5 pb-4 text-sm text-amazon-text-secondary leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.section>

          {/* BOTTOM CTA */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-amazon-header rounded-2xl p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #f90 0%, transparent 50%)" }} />
              <div className="relative">
                <h2 className="text-2xl font-extrabold text-white mb-3">Ready to apply?</h2>
                <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">Join thousands of OneCart cardholders earning cashback every day.</p>
                {ctaBlock()}
              </div>
            </div>
          </motion.section>

        </div>
      </div>

      {showForm && <ApplicationForm selectedTier={selectedTier} onClose={() => setShowForm(false)} onSuccess={handleSuccess} />}

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg ${toast.type === "success" ? "bg-emerald-600" : "bg-red-500"}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
