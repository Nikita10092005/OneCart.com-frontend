import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHandshake, FaLaptop, FaTshirt, FaHome, FaBook,
  FaUserPlus, FaLink, FaMoneyBillWave, FaCalendarAlt,
  FaWallet, FaUniversity, FaArrowRight, FaCheckCircle,
  FaStar, FaChartLine, FaUsers, FaGlobe, FaCopy,
  FaInstagram, FaYoutube, FaBlog,
} from "react-icons/fa";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const COMMISSIONS = [
  { category: "Electronics", rate: "4%", icon: <FaLaptop />, color: "bg-blue-50 border-blue-100 text-blue-500", monthly: "₹4,000", on: "₹1L spend" },
  { category: "Fashion", rate: "8%", icon: <FaTshirt />, color: "bg-pink-50 border-pink-100 text-pink-500", monthly: "₹8,000", on: "₹1L spend" },
  { category: "Home & Kitchen", rate: "6%", icon: <FaHome />, color: "bg-amber-50 border-amber-100 text-amber-500", monthly: "₹6,000", on: "₹1L spend" },
  { category: "Books", rate: "10%", icon: <FaBook />, color: "bg-emerald-50 border-emerald-100 text-emerald-500", monthly: "₹10,000", on: "₹1L spend" },
];

const JOIN_STEPS = [
  { title: "Sign Up Free", desc: "Create your affiliate account with basic details. Approval takes under 24 hours.", icon: <FaUserPlus />, color: "bg-blue-50 border-blue-100 text-blue-500" },
  { title: "Get Your Link", desc: "Browse the OneCart catalog and generate unique tracking links for any product.", icon: <FaLink />, color: "bg-purple-50 border-purple-100 text-purple-500" },
  { title: "Promote & Earn", desc: "Share on social media, blogs, or YouTube. Earn commission on every sale you drive.", icon: <FaMoneyBillWave />, color: "bg-emerald-50 border-emerald-100 text-emerald-500" },
];

const PAYOUT = [
  { icon: <FaCalendarAlt />, title: "Monthly Payouts", desc: "Commissions processed on the 1st of every month for the previous month's earnings." },
  { icon: <FaWallet />, title: "Min. ₹500 Threshold", desc: "Need at least ₹500 to trigger a payout. Smaller amounts roll over to next month." },
  { icon: <FaUniversity />, title: "Bank Transfer / UPI", desc: "Receive earnings directly via bank transfer or UPI — whichever you prefer." },
];

const PLATFORMS = [
  { icon: <FaInstagram />, label: "Instagram" },
  { icon: <FaYoutube />, label: "YouTube" },
  { icon: <FaBlog />, label: "Blog / Website" },
  { icon: <FaGlobe />, label: "Other" },
];

const STATS = [
  { value: "12,000+", label: "Active Affiliates", icon: <FaUsers />, color: "text-blue-500" },
  { value: "₹2.5Cr+", label: "Paid Out Monthly", icon: <FaMoneyBillWave />, color: "text-emerald-500" },
  { value: "10%", label: "Top Commission Rate", icon: <FaChartLine />, color: "text-amber-500" },
  { value: "24hrs", label: "Approval Time", icon: <FaCheckCircle />, color: "text-purple-500" },
];

const TESTIMONIALS = [
  { name: "Sneha Kapoor", platform: "Instagram — 80K followers", text: "I earn ₹25,000/month just by sharing OneCart links in my fashion reels. Best passive income I've found.", rating: 5 },
  { name: "Rahul Tech", platform: "YouTube — 2L subscribers", text: "Electronics reviews with OneCart affiliate links generate consistent income every month.", rating: 5 },
  { name: "Priya Blogs", platform: "Lifestyle Blog", text: "The dashboard is clean, payouts are on time, and the commission rates are the best in the market.", rating: 5 },
];

export default function Affiliate() {
  const { user } = useAuth();
  const [myProfile, setMyProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", platform: "", website: "", audience: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    API.get("/affiliate/my").then((r) => setMyProfile(r.data)).catch(() => {});
  }, [user]);

  const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 4000); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.platform.trim()) e.platform = "Required";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await API.post("/affiliate", form);
      setMyProfile(res.data.affiliate);
      setShowForm(false);
      showToast("success", "Welcome aboard! Check your email for next steps within 24 hours.");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (myProfile?.referralCode) {
      navigator.clipboard.writeText(`https://onecart.com?ref=${myProfile.referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Status card for approved affiliates
  const ProfileCard = () => (
    <div className="bg-white rounded-2xl border border-amazon-border p-6 shadow-sm max-w-md mx-auto text-center">
      <div className="w-14 h-14 rounded-full bg-amazon-accent flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-3">
        {myProfile.name?.charAt(0)}
      </div>
      <h3 className="text-base font-extrabold text-amazon-text">{myProfile.name}</h3>
      <p className="text-xs text-amazon-text-secondary mb-4">{myProfile.platform}</p>
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4 ${myProfile.status === "approved" ? "bg-emerald-100 text-emerald-700" : myProfile.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
        {myProfile.status === "approved" ? <FaCheckCircle /> : null}
        {myProfile.status.charAt(0).toUpperCase() + myProfile.status.slice(1)}
      </div>
      {myProfile.status === "approved" && myProfile.referralCode && (
        <div className="bg-amazon-section rounded-xl p-4">
          <p className="text-xs text-amazon-text-secondary mb-2">Your referral link</p>
          <div className="flex items-center gap-2 bg-white border border-amazon-border rounded-xl px-3 py-2">
            <p className="text-xs text-amazon-text font-mono flex-1 truncate">onecart.com?ref={myProfile.referralCode}</p>
            <button onClick={copyCode} className="text-amazon-accent hover:text-amber-600 transition-colors shrink-0">
              {copied ? <FaCheckCircle className="text-emerald-500" /> : <FaCopy />}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-amazon-section">

        {/* HERO */}
        <div className="bg-amazon-header text-white py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 60%, #f90 0%, transparent 50%)" }} />
          <div className="max-w-5xl mx-auto relative">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <FaHandshake className="text-amazon-accent text-xl" />
                <span className="text-amazon-accent text-xs font-bold uppercase tracking-widest border border-amazon-accent/30 px-3 py-1 rounded-full">Affiliate Program</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Earn Money by<br /><span className="text-amazon-accent">Sharing Products</span>
              </h1>
              <p className="text-white/70 text-base max-w-xl leading-relaxed mb-8">
                Join 12,000+ affiliates earning commissions up to 10% on every sale. Free to join. No minimum traffic required.
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                {myProfile ? (
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-sm font-medium px-6 py-3 rounded-xl">
                    <FaCheckCircle /> You're an affiliate — {myProfile.status}
                  </div>
                ) : (
                  <button onClick={() => setShowForm(true)}
                    className="bg-amazon-accent hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
                    Join for Free <FaArrowRight />
                  </button>
                )}
                <div className="flex gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1"><FaCheckCircle className="text-amazon-accent" /> Free to join</span>
                  <span className="flex items-center gap-1"><FaCheckCircle className="text-amazon-accent" /> No minimum traffic</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="bg-white border-b border-amazon-border">
          <div className="max-w-5xl mx-auto px-4 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg ${s.color}`}>{s.icon}</div>
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

          {/* COMMISSION TABLE */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-10">
              <p className="text-amazon-accent text-xs font-bold uppercase tracking-widest mb-2">Earn More</p>
              <h2 className="text-2xl font-extrabold text-amazon-text">Commission Rates by Category</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COMMISSIONS.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm hover:shadow-md hover:border-amazon-accent/30 transition-all flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl border flex items-center justify-center text-2xl shrink-0 ${item.color}`}>{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-sm font-extrabold text-amazon-text">{item.category}</h3>
                    <p className="text-xs text-amazon-text-secondary">Earn {item.monthly} on {item.on}</p>
                  </div>
                  <div className="text-3xl font-extrabold text-amazon-accent">{item.rate}</div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* HOW IT WORKS */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-10">
              <p className="text-amazon-accent text-xs font-bold uppercase tracking-widest mb-2">Simple Process</p>
              <h2 className="text-2xl font-extrabold text-amazon-text">Start earning in 3 steps</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {JOIN_STEPS.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-amazon-border p-6 shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-4 text-xl ${step.color}`}>{step.icon}</div>
                  <div className="text-xs font-bold text-amazon-accent mb-2 uppercase tracking-wide">Step {i + 1}</div>
                  <h3 className="text-sm font-extrabold text-amazon-text mb-2">{step.title}</h3>
                  <p className="text-xs text-amazon-text-secondary leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* PAYOUT INFO */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-8">
              <p className="text-amazon-accent text-xs font-bold uppercase tracking-widest mb-2">Get Paid</p>
              <h2 className="text-2xl font-extrabold text-amazon-text">Payout Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PAYOUT.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-amazon-accent/10 border border-amazon-accent/20 flex items-center justify-center text-amazon-accent text-xl mx-auto mb-3">{item.icon}</div>
                  <h3 className="text-sm font-bold text-amazon-text mb-2">{item.title}</h3>
                  <p className="text-xs text-amazon-text-secondary leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* TESTIMONIALS */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-10">
              <p className="text-amazon-accent text-xs font-bold uppercase tracking-widest mb-2">Real Affiliates</p>
              <h2 className="text-2xl font-extrabold text-amazon-text">What our affiliates say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm">
                  <div className="flex gap-0.5 mb-3">{Array.from({ length: t.rating }).map((_, j) => <FaStar key={j} className="text-amazon-accent text-xs" />)}</div>
                  <p className="text-sm text-amazon-text leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amazon-accent flex items-center justify-center text-white font-bold text-xs">{t.name.charAt(0)}</div>
                    <div>
                      <p className="text-xs font-bold text-amazon-text">{t.name}</p>
                      <p className="text-xs text-amazon-text-secondary">{t.platform}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* PROFILE / SIGN UP */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {myProfile ? (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-extrabold text-amazon-text">Your Affiliate Profile</h2>
                </div>
                <ProfileCard />
              </div>
            ) : (
              <div className="bg-amazon-header rounded-2xl p-10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #f90 0%, transparent 50%)" }} />
                <div className="relative max-w-lg mx-auto">
                  {!showForm ? (
                    <div className="text-center">
                      <h2 className="text-2xl font-extrabold text-white mb-3">Join the Affiliate Program</h2>
                      <p className="text-white/60 text-sm mb-8">Free to join. Start earning in under 24 hours.</p>
                      <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {PLATFORMS.map((p) => (
                          <div key={p.label} className="flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-xs px-3 py-2 rounded-xl">
                            {p.icon} {p.label}
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setShowForm(true)} className="bg-amazon-accent hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
                        Sign Up Free <FaArrowRight />
                      </button>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <h2 className="text-xl font-extrabold text-white mb-6 text-center">Create Affiliate Account</h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input placeholder="Full name *" value={form.name} onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setErrors((p) => ({ ...p, name: undefined })); }}
                              className={`w-full rounded-xl px-4 py-2.5 text-sm bg-white/10 text-white placeholder-white/40 border ${errors.name ? "border-red-400" : "border-white/20"} focus:outline-none focus:border-amazon-accent`} />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                          </div>
                          <div>
                            <input type="email" placeholder="Email address *" value={form.email} onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setErrors((p) => ({ ...p, email: undefined })); }}
                              className={`w-full rounded-xl px-4 py-2.5 text-sm bg-white/10 text-white placeholder-white/40 border ${errors.email ? "border-red-400" : "border-white/20"} focus:outline-none focus:border-amazon-accent`} />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                            className="w-full rounded-xl px-4 py-2.5 text-sm bg-white/10 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:border-amazon-accent" />
                          <div>
                            <input placeholder="Platform (Instagram, YouTube…) *" value={form.platform} onChange={(e) => { setForm((p) => ({ ...p, platform: e.target.value })); setErrors((p) => ({ ...p, platform: undefined })); }}
                              className={`w-full rounded-xl px-4 py-2.5 text-sm bg-white/10 text-white placeholder-white/40 border ${errors.platform ? "border-red-400" : "border-white/20"} focus:outline-none focus:border-amazon-accent`} />
                            {errors.platform && <p className="text-red-400 text-xs mt-1">{errors.platform}</p>}
                          </div>
                        </div>
                        <input placeholder="Website / channel URL (optional)" value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                          className="w-full rounded-xl px-4 py-2.5 text-sm bg-white/10 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:border-amazon-accent" />
                        <input placeholder="Audience size (e.g. 50K followers)" value={form.audience} onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))}
                          className="w-full rounded-xl px-4 py-2.5 text-sm bg-white/10 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:border-amazon-accent" />
                        <div className="flex gap-3">
                          <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-white/20 text-white/70 font-semibold py-3 rounded-xl text-sm hover:bg-white/10 transition-colors">Cancel</button>
                          <button type="submit" disabled={loading} className="flex-1 bg-amazon-accent hover:bg-amber-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                            {loading ? <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Submitting…</> : <><FaArrowRight />Sign Up Free</>}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </motion.section>

        </div>
      </div>

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
