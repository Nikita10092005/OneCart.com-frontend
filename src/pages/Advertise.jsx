import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBullhorn, FaSearch, FaImage, FaEnvelope, FaMousePointer,
  FaEye, FaThumbtack, FaChartLine, FaUsers, FaShoppingBag,
  FaArrowRight, FaCheckCircle, FaTimesCircle, FaStar,
  FaRocket, FaBolt, FaGlobe,
} from "react-icons/fa";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const AD_FORMATS = [
  {
    title: "Sponsored Products",
    desc: "Your products appear at the top of search results when customers look for relevant items. Pay only when clicked.",
    icon: <FaSearch />,
    tag: "Most Popular",
    tagColor: "bg-emerald-100 text-emerald-700",
    color: "bg-blue-50 border-blue-100 text-blue-500",
    cpc: "₹2–₹15 / click",
  },
  {
    title: "Banner Ads",
    desc: "High-visibility placements on the homepage and category pages. Capture customers while they browse.",
    icon: <FaImage />,
    tag: "Brand Awareness",
    tagColor: "bg-purple-100 text-purple-700",
    color: "bg-purple-50 border-purple-100 text-purple-500",
    cpc: "₹500–₹5,000 / day",
  },
  {
    title: "Email Campaigns",
    desc: "Reach targeted customer segments through our curated newsletters sent to 5L+ subscribers.",
    icon: <FaEnvelope />,
    tag: "High ROI",
    tagColor: "bg-amber-100 text-amber-700",
    color: "bg-amber-50 border-amber-100 text-amber-500",
    cpc: "₹0.50 / recipient",
  },
  {
    title: "Push Notifications",
    desc: "Send targeted push notifications to app users who have opted in. Instant reach, high open rates.",
    icon: <FaBolt />,
    tag: "New",
    tagColor: "bg-red-100 text-red-700",
    color: "bg-red-50 border-red-100 text-red-500",
    cpc: "₹0.10 / notification",
  },
];

const PRICING = [
  { title: "CPC", subtitle: "Cost Per Click", desc: "Pay only when a customer clicks your ad. Best for driving product sales.", icon: <FaMousePointer />, tag: "Performance", from: "₹2" },
  { title: "CPM", subtitle: "Cost Per 1,000 Impressions", desc: "Pay per 1,000 views. Great for brand awareness and new launches.", icon: <FaEye />, tag: "Awareness", from: "₹50" },
  { title: "Fixed", subtitle: "Fixed Placement", desc: "Reserve a premium slot for a fixed period. Guaranteed visibility.", icon: <FaThumbtack />, tag: "Premium", from: "₹5,000" },
];

const STATS = [
  { value: "50L+", label: "Monthly Active Users", icon: <FaUsers />, color: "text-blue-500" },
  { value: "2.5x", label: "Avg. ROAS for Sellers", icon: <FaChartLine />, color: "text-emerald-500" },
  { value: "19K+", label: "Pin Codes Reached", icon: <FaGlobe />, color: "text-purple-500" },
  { value: "₹500", label: "Minimum Budget", icon: <FaRocket />, color: "text-amber-500" },
];

const TESTIMONIALS = [
  { name: "Vikram Electronics", text: "Our sales doubled in 3 months using Sponsored Products. The ROI is incredible.", rating: 5 },
  { name: "StyleHub Fashion", text: "Banner ads on the homepage drove massive brand awareness during our sale.", rating: 5 },
  { name: "KitchenPro", text: "Email campaigns gave us a 35% open rate. Best marketing channel we've used.", rating: 5 },
];

const AD_FORMAT_OPTIONS = [
  { value: "sponsored", label: "Sponsored Products" },
  { value: "banner", label: "Banner Ads" },
  { value: "email", label: "Email Campaigns" },
  { value: "all", label: "Not sure — advise me" },
];

export default function Advertise() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [myInquiry, setMyInquiry] = useState(null);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", company: "", phone: "", budget: "", adFormat: "sponsored", goals: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) return;
    API.get("/ad-inquiry/my").then((r) => setMyInquiry(r.data)).catch(() => {});
  }, [user]);

  const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 4000); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.budget || Number(form.budget) < 500) e.budget = "Minimum budget is ₹500";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await API.post("/ad-inquiry", form);
      setMyInquiry({ status: "new" });
      setShowForm(false);
      showToast("success", "Inquiry submitted! Our ads team will contact you within 1 business day.");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ctaButton = () => {
    if (myInquiry) return (
      <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-6 py-3 rounded-xl">
        <FaCheckCircle /> Inquiry received — our team will contact you soon
      </div>
    );
    return (
      <button onClick={() => user ? setShowForm(true) : setShowForm(true)}
        className="bg-amazon-accent hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2">
        Get Started <FaArrowRight />
      </button>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-amazon-section">

        {/* HERO */}
        <div className="bg-amazon-header text-white py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 75% 40%, #f90 0%, transparent 50%)" }} />
          <div className="max-w-5xl mx-auto relative">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <FaBullhorn className="text-amazon-accent text-xl" />
                <span className="text-amazon-accent text-xs font-bold uppercase tracking-widest border border-amazon-accent/30 px-3 py-1 rounded-full">Advertise on OneCart</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Reach Millions of<br /><span className="text-amazon-accent">Ready-to-Buy Customers</span>
              </h1>
              <p className="text-white/70 text-base max-w-xl leading-relaxed mb-8">
                Put your products in front of the right customers at the right moment. Start with as little as ₹500.
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                {ctaButton()}
                <a href="mailto:ads@onecart.com" className="text-white/60 hover:text-white text-sm transition-colors">ads@onecart.com</a>
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

          {/* AD FORMATS */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-10">
              <p className="text-amazon-accent text-xs font-bold uppercase tracking-widest mb-2">Ad Formats</p>
              <h2 className="text-2xl font-extrabold text-amazon-text">Choose how you want to advertise</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {AD_FORMATS.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl border border-amazon-border p-6 shadow-sm hover:shadow-md hover:border-amazon-accent/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl ${f.color}`}>{f.icon}</div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${f.tagColor}`}>{f.tag}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-amazon-text mb-2">{f.title}</h3>
                  <p className="text-xs text-amazon-text-secondary leading-relaxed mb-3">{f.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amazon-accent">
                    <FaRocket className="text-xs" /> Starting from {f.cpc}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* PRICING MODELS */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-10">
              <p className="text-amazon-accent text-xs font-bold uppercase tracking-widest mb-2">Pricing</p>
              <h2 className="text-2xl font-extrabold text-amazon-text">Flexible pricing for every goal</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PRICING.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-amazon-border p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                  <div className="w-12 h-12 rounded-xl bg-amazon-accent/10 border border-amazon-accent/20 flex items-center justify-center text-amazon-accent text-xl mx-auto mb-4">{p.icon}</div>
                  <span className="text-xs font-bold text-amazon-accent bg-amazon-accent/10 px-3 py-1 rounded-full">{p.tag}</span>
                  <h3 className="text-xl font-extrabold text-amazon-text mt-3 mb-0.5">{p.title}</h3>
                  <p className="text-xs text-amazon-text-secondary mb-3">{p.subtitle}</p>
                  <p className="text-xs text-amazon-text-secondary leading-relaxed mb-4">{p.desc}</p>
                  <p className="text-sm font-bold text-amazon-text">From <span className="text-amazon-accent text-lg">{p.from}</span></p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* TESTIMONIALS */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-10">
              <p className="text-amazon-accent text-xs font-bold uppercase tracking-widest mb-2">Success Stories</p>
              <h2 className="text-2xl font-extrabold text-amazon-text">Brands that grew with OneCart Ads</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm">
                  <div className="flex gap-0.5 mb-3">{Array.from({ length: t.rating }).map((_, j) => <FaStar key={j} className="text-amazon-accent text-xs" />)}</div>
                  <p className="text-sm text-amazon-text leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amazon-accent flex items-center justify-center text-white font-bold text-xs">{t.name.charAt(0)}</div>
                    <p className="text-xs font-bold text-amazon-text">{t.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA / FORM */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-amazon-header rounded-2xl p-10 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #f90 0%, transparent 50%)" }} />
              <div className="relative max-w-2xl mx-auto">
                {!showForm ? (
                  <div className="text-center">
                    <h2 className="text-2xl font-extrabold text-white mb-3">Ready to boost your visibility?</h2>
                    <p className="text-white/60 text-sm mb-8">Our ads team will help you choose the right format and budget for your goals.</p>
                    {ctaButton()}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-extrabold text-white">Start Advertising</h2>
                      <button onClick={() => setShowForm(false)} className="text-white/50 hover:text-white"><FaTimesCircle /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input placeholder="Your name / company *" value={form.name} onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setErrors((p) => ({ ...p, name: undefined })); }}
                            className={`w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white/10 text-white placeholder-white/40 border ${errors.name ? "border-red-400" : "border-white/20"} focus:border-amazon-accent`} />
                          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                          <input type="email" placeholder="Business email *" value={form.email} onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setErrors((p) => ({ ...p, email: undefined })); }}
                            className={`w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white/10 text-white placeholder-white/40 border ${errors.email ? "border-red-400" : "border-white/20"} focus:border-amazon-accent`} />
                          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                          className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-amazon-accent" />
                        <div>
                          <input type="number" placeholder="Monthly budget (₹) *" value={form.budget} onChange={(e) => { setForm((p) => ({ ...p, budget: e.target.value })); setErrors((p) => ({ ...p, budget: undefined })); }}
                            className={`w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white/10 text-white placeholder-white/40 border ${errors.budget ? "border-red-400" : "border-white/20"} focus:border-amazon-accent`} />
                          {errors.budget && <p className="text-red-400 text-xs mt-1">{errors.budget}</p>}
                        </div>
                      </div>
                      <select value={form.adFormat} onChange={(e) => setForm((p) => ({ ...p, adFormat: e.target.value }))}
                        className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white/10 text-white border border-white/20 focus:border-amazon-accent">
                        {AD_FORMAT_OPTIONS.map((o) => <option key={o.value} value={o.value} className="text-black">{o.label}</option>)}
                      </select>
                      <textarea placeholder="Tell us about your advertising goals (optional)" value={form.goals} onChange={(e) => setForm((p) => ({ ...p, goals: e.target.value }))} rows={3}
                        className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white/10 text-white placeholder-white/40 border border-white/20 focus:border-amazon-accent resize-none" />
                      <button type="submit" disabled={loading}
                        className="w-full bg-amazon-accent hover:bg-amber-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                        {loading ? <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Sending…</> : <><FaArrowRight />Send Inquiry</>}
                      </button>
                    </form>
                  </motion.div>
                )}
              </div>
            </div>
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
