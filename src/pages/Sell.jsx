import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStore, FaUserPlus, FaBoxOpen, FaMoneyBillWave, FaMapMarkerAlt,
  FaGift, FaHeadset, FaCheckCircle, FaTimesCircle, FaExclamationCircle,
  FaBuilding, FaPhone, FaIdCard, FaUsers, FaShoppingBag, FaChartLine,
  FaShieldAlt, FaTruck, FaStar, FaArrowRight,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { applyForSellerWithDetails, getMyApplication } from "../services/api";
import API from "../services/api";

const STEPS = [
  {
    title: "Create Your Account",
    desc: "Register with your business details and GST number. Verification takes less than 24 hours.",
    icon: <FaUserPlus />,
    color: "bg-blue-50 border-blue-100 text-blue-500",
  },
  {
    title: "List Your Products",
    desc: "Upload photos, write descriptions, set prices. Our tools make listing fast and easy.",
    icon: <FaBoxOpen />,
    color: "bg-purple-50 border-purple-100 text-purple-500",
  },
  {
    title: "Start Earning",
    desc: "Receive orders, ship to customers, and get paid directly to your bank account.",
    icon: <FaMoneyBillWave />,
    color: "bg-emerald-50 border-emerald-100 text-emerald-500",
  },
];

const BENEFITS = [
  {
    title: "19,000+ Pin Codes",
    desc: "Reach customers in every corner of India with our extensive delivery network.",
    icon: <FaMapMarkerAlt />,
  },
  {
    title: "Zero Commission — First Month",
    desc: "Keep 100% of your earnings for your entire first month. No hidden fees.",
    icon: <FaGift />,
  },
  {
    title: "Dedicated Seller Support",
    desc: "Our seller success team is available 7 days a week to help you grow.",
    icon: <FaHeadset />,
  },
  {
    title: "Secure & Fast Payments",
    desc: "Payments settled within 7 days of delivery, directly to your bank account.",
    icon: <FaShieldAlt />,
  },
  {
    title: "Logistics Support",
    desc: "Partner with top courier services at discounted rates through OneCart.",
    icon: <FaTruck />,
  },
  {
    title: "Seller Analytics",
    desc: "Track your sales, revenue, and customer insights from your seller dashboard.",
    icon: <FaChartLine />,
  },
];

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    business: "Electronics Trader, Delhi",
    text: "OneCart helped me grow my electronics business 3x in just 6 months. The seller dashboard is incredibly easy to use.",
    rating: 5,
  },
  {
    name: "Priya Mehta",
    business: "Fashion Brand, Mumbai",
    text: "I started with just 10 products. Now I have over 200 listings and ship across India every day.",
    rating: 5,
  },
  {
    name: "Arjun Patel",
    business: "Home Decor, Ahmedabad",
    text: "The zero commission first month gave me the confidence to start. Best decision I made for my business.",
    rating: 5,
  },
];

// ── SellerApplicationModal ────────────────────────────────────────────────────

function SellerApplicationModal({ onClose, onSuccess, initialData }) {
  const [form, setForm] = useState({
    businessName: initialData?.businessName || "",
    gstNumber: initialData?.gstNumber || "",
    phoneNumber: initialData?.phoneNumber || "",
    businessAddress: initialData?.businessAddress || "",
    businessType: initialData?.businessType || "Individual",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.businessName.trim()) e.businessName = "Business name is required.";
    if (!form.phoneNumber.trim()) {
      e.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(form.phoneNumber.trim())) {
      e.phoneNumber = "Must be exactly 10 digits.";
    }
    if (!form.businessAddress.trim()) e.businessAddress = "Business address is required.";
    if (form.gstNumber.trim() && !/^[A-Z0-9]{15}$/.test(form.gstNumber.trim())) {
      e.gstNumber = "Must be exactly 15 uppercase alphanumeric characters.";
    }
    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setApiError(null);
    try {
      await applyForSellerWithDetails(form);
      onSuccess();
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-amazon-border">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <FaStore className="text-amazon-accent" />
              <h2 className="text-lg font-extrabold text-amazon-text">Seller Application</h2>
            </div>
            <p className="text-xs text-amazon-text-secondary">Fill in your business details to get started</p>
          </div>
          <button onClick={onClose} className="text-amazon-text-secondary hover:text-amazon-text transition-colors p-1">
            <FaTimesCircle className="text-xl" />
          </button>
        </div>

        {apiError && (
          <div className="mx-6 mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <FaExclamationCircle className="shrink-0" /> {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-amazon-text mb-1 flex items-center gap-1">
              <FaBuilding className="text-amazon-accent text-xs" /> Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="businessName" value={form.businessName} onChange={handleChange}
              placeholder="Your business or brand name"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/40 ${errors.businessName ? "border-red-400 bg-red-50" : "border-amazon-border"}`}
            />
            {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-amazon-text mb-1 flex items-center gap-1">
                <FaPhone className="text-amazon-accent text-xs" /> Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
                placeholder="10-digit number" maxLength={10}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/40 ${errors.phoneNumber ? "border-red-400 bg-red-50" : "border-amazon-border"}`}
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-amazon-text mb-1">
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                name="businessType" value={form.businessType} onChange={handleChange}
                className="w-full border border-amazon-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/40 bg-white"
              >
                <option value="Individual">Individual</option>
                <option value="Registered Business">Registered Business</option>
                <option value="Brand">Brand</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-amazon-text mb-1 flex items-center gap-1">
              <FaIdCard className="text-amazon-accent text-xs" /> GST Number
              <span className="text-amazon-text-secondary font-normal text-xs ml-1">(optional)</span>
            </label>
            <input
              type="text" name="gstNumber" value={form.gstNumber} onChange={handleChange}
              placeholder="15-character GST number"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/40 uppercase ${errors.gstNumber ? "border-red-400 bg-red-50" : "border-amazon-border"}`}
            />
            {errors.gstNumber && <p className="text-red-500 text-xs mt-1">{errors.gstNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-amazon-text mb-1">
              Business Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="businessAddress" value={form.businessAddress} onChange={handleChange}
              placeholder="Full business address" rows={3}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/40 resize-none ${errors.businessAddress ? "border-red-400 bg-red-50" : "border-amazon-border"}`}
            />
            {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress}</p>}
          </div>

          <button
            type="submit" disabled={submitting}
            className="w-full bg-amazon-accent hover:bg-amazon-accent/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? (
              <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Submitting…</>
            ) : <><FaArrowRight /> Submit Application</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Sell page ─────────────────────────────────────────────────────────────────

export default function Sell() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appStatus, setAppStatus] = useState(null);
  const [appRejectionReason, setAppRejectionReason] = useState("");
  const [appDetails, setAppDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(Boolean(user));
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/admin/public/seller-stats")
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user || user.role === "seller") return;
    getMyApplication()
      .then((res) => { setAppStatus(res.data.status); setAppRejectionReason(res.data.rejectionReason || ""); setAppDetails(res.data); })
      .catch((err) => { if (err.response?.status === 404) setAppStatus(null); })
      .finally(() => setStatusLoading(false));
  }, [user]);

  const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 4000); };
  const handleSuccess = () => {
    setModalOpen(false);
    setAppStatus("pending");
    getMyApplication()
      .then((res) => setAppDetails(res.data))
      .catch(() => {});
    showToast("success", "Application submitted! Admin will review it shortly.");
  };

  const hasMissingDetails = appDetails && (!appDetails.businessName || !appDetails.phoneNumber || !appDetails.businessAddress);

  const STATS = [
    { label: "Active Sellers", value: stats ? stats.totalSellers.toLocaleString("en-IN") : "—", icon: <FaUsers />, color: "text-blue-500" },
    { label: "Products Listed", value: stats ? stats.totalProducts.toLocaleString("en-IN") : "—", icon: <FaShoppingBag />, color: "text-purple-500" },
    { label: "Orders Delivered", value: stats ? stats.totalOrders.toLocaleString("en-IN") : "—", icon: <FaChartLine />, color: "text-emerald-500" },
    { label: "Pin Codes Covered", value: "19,000+", icon: <FaMapMarkerAlt />, color: "text-orange-500" },
  ];

  return (
    <>
      <div className="min-h-screen bg-amazon-section">

        {/* HERO */}
        <div className="bg-amazon-header text-white py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #f90 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f90 0%, transparent 40%)" }} />
          <div className="max-w-5xl mx-auto relative">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <FaStore className="text-amazon-accent text-xl" />
                <span className="text-amazon-accent text-xs font-bold uppercase tracking-widest border border-amazon-accent/30 px-3 py-1 rounded-full">Sell on OneCart</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Grow Your Business<br />
                <span className="text-amazon-accent">Across India</span>
              </h1>
              <p className="text-white/70 text-base max-w-xl leading-relaxed mb-8">
                Join thousands of sellers reaching millions of customers. Start selling in minutes — registration is free.
              </p>
              <div className="flex flex-wrap gap-3">
                {user?.role === "seller" ? (
                  <button onClick={() => navigate("/seller/dashboard")} className="bg-amazon-accent hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2">
                    <FaCheckCircle /> Go to Seller Dashboard
                  </button>
                ) : appStatus === "pending" ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-amber-500/20 border border-amber-400/40 text-amber-200 text-sm font-medium px-5 py-3 rounded-xl flex items-center gap-2">
                      <FaExclamationCircle /> Application under review
                    </div>
                    {hasMissingDetails && (
                      <button
                        onClick={() => setModalOpen(true)}
                        className="bg-amazon-accent hover:bg-amber-500 text-white font-bold px-5 py-3 rounded-xl transition-colors flex items-center gap-2 text-sm"
                      >
                        <FaArrowRight /> Complete Your Details
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => user ? setModalOpen(true) : navigate("/login")}
                    className="bg-amazon-accent hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
                  >
                    {user ? "Start Selling Today" : "Login to Apply"} <FaArrowRight />
                  </button>
                )}
                <Link to="/sell-under" className="border border-white/30 hover:border-white/60 text-white/80 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm flex items-center gap-2">
                  Learn about FBO <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* LIVE STATS */}
        <div className="bg-white border-b border-amazon-border">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg ${s.color}`}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-amazon-text leading-none">{s.value}</p>
                    <p className="text-xs text-amazon-text-secondary mt-0.5">{s.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

          {/* HOW IT WORKS */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-10">
              <p className="text-amazon-accent text-xs font-bold uppercase tracking-widest mb-2">Simple Process</p>
              <h2 className="text-2xl font-extrabold text-amazon-text">Start selling in 3 easy steps</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* connector line */}
              <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-amazon-border z-0" />
              {STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="bg-white rounded-2xl border border-amazon-border p-6 shadow-sm hover:shadow-md transition-shadow relative z-10 text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl border ${step.color} flex items-center justify-center mx-auto mb-4 text-xl`}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold text-amazon-accent mb-2 uppercase tracking-wide">Step {i + 1}</div>
                  <h3 className="text-sm font-extrabold text-amazon-text mb-2">{step.title}</h3>
                  <p className="text-xs text-amazon-text-secondary leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* BENEFITS */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-10">
              <p className="text-amazon-accent text-xs font-bold uppercase tracking-widest mb-2">Why OneCart</p>
              <h2 className="text-2xl font-extrabold text-amazon-text">Everything you need to succeed</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {BENEFITS.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm hover:shadow-md hover:border-amazon-accent/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-amazon-accent/10 border border-amazon-accent/20 flex items-center justify-center mb-3 text-amazon-accent">
                    {b.icon}
                  </div>
                  <h3 className="text-sm font-bold text-amazon-text mb-1">{b.title}</h3>
                  <p className="text-xs text-amazon-text-secondary leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* TESTIMONIALS */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-10">
              <p className="text-amazon-accent text-xs font-bold uppercase tracking-widest mb-2">Success Stories</p>
              <h2 className="text-2xl font-extrabold text-amazon-text">Sellers love OneCart</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm"
                >
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <FaStar key={j} className="text-amazon-accent text-xs" />
                    ))}
                  </div>
                  <p className="text-sm text-amazon-text leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amazon-accent flex items-center justify-center text-white font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amazon-text">{t.name}</p>
                      <p className="text-xs text-amazon-text-secondary">{t.business}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA SECTION */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-amazon-header rounded-2xl p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #f90 0%, transparent 50%)" }} />
              <div className="relative">
                <h2 className="text-2xl font-extrabold text-white mb-3">Ready to start selling?</h2>
                <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
                  Registration is free. No monthly fees. Start earning from day one.
                </p>

                {statusLoading ? (
                  <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Checking status…
                  </div>
                ) : user?.role === "seller" ? (
                  <button onClick={() => navigate("/seller/dashboard")} className="bg-amazon-accent hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
                    <FaCheckCircle /> Go to Seller Dashboard
                  </button>
                ) : appStatus === "pending" ? (
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-200 text-sm font-medium px-6 py-3 rounded-xl">
                      <FaExclamationCircle /> Your application is under review. We'll notify you once approved.
                    </div>
                    {hasMissingDetails && (
                      <div>
                        <button onClick={() => setModalOpen(true)} className="bg-amazon-accent hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
                          Complete Your Details <FaArrowRight />
                        </button>
                      </div>
                    )}
                  </div>
                ) : appStatus === "rejected" ? (
                  <div className="space-y-4">
                    <div className="inline-flex items-start gap-2 bg-red-500/20 border border-red-400/30 text-red-200 text-sm px-5 py-3 rounded-xl max-w-md text-left">
                      <FaTimesCircle className="shrink-0 mt-0.5" />
                      <span><span className="font-semibold">Rejected:</span> {appRejectionReason || "No reason provided."}</span>
                    </div>
                    <div>
                      <button onClick={() => setModalOpen(true)} className="bg-amazon-accent hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
                        Re-apply <FaArrowRight />
                      </button>
                    </div>
                  </div>
                ) : user ? (
                  <button onClick={() => setModalOpen(true)} className="bg-amazon-accent hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
                    Apply to Become a Seller <FaArrowRight />
                  </button>
                ) : (
                  <button onClick={() => navigate("/login")} className="bg-amazon-accent hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
                    Login to Apply <FaArrowRight />
                  </button>
                )}
              </div>
            </div>
          </motion.section>

        </div>
      </div>

      {modalOpen && (
        <AnimatePresence>
          <SellerApplicationModal onClose={() => setModalOpen(false)} onSuccess={handleSuccess} initialData={appDetails} />
        </AnimatePresence>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg ${toast.type === "success" ? "bg-emerald-600" : "bg-red-500"}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
