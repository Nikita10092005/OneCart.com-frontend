import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { imgUrl } from "../utils/imageUrl";
import ProductCard from "../components/ProductCard";

/* ── helpers ── */
const inputCls = "w-full bg-amazon-section/40 border border-amazon-border rounded-xl px-4 py-3 text-sm font-medium text-amazon-text focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent focus:bg-white transition-all placeholder:text-amazon-text-secondary";

const STATUS_COLORS = {
  Delivered:  "bg-emerald-50 text-emerald-600 border-emerald-200",
  Confirmed:  "bg-amazon-section text-amazon-accent border-amazon-border",
  Shipped:    "bg-purple-50 text-purple-600 border-purple-200",
  Packed:     "bg-blue-50 text-blue-600 border-blue-200",
  Ordered:    "bg-amber-50 text-amber-600 border-amber-200",
  Pending:    "bg-amber-50 text-amber-600 border-amber-200",
  Cancelled:  "bg-red-50 text-red-500 border-red-200",
};

const TIER_CONFIG = {
  bronze:   { color: "text-amber-700",   bg: "bg-amber-50 border-amber-200",   bar: "bg-amber-400",   icon: "🥉", next: "silver",   threshold: 500  },
  silver:   { color: "text-gray-500",    bg: "bg-gray-100 border-gray-200",    bar: "bg-gray-400",    icon: "🥈", next: "gold",     threshold: 2000 },
  gold:     { color: "text-yellow-600",  bg: "bg-yellow-50 border-yellow-200", bar: "bg-yellow-400",  icon: "🥇", next: "platinum", threshold: 5000 },
  platinum: { color: "text-blue-600",    bg: "bg-blue-50 border-blue-200",     bar: "bg-blue-500",    icon: "💎", next: null,       threshold: null },
};

const TIER_THRESHOLDS = { bronze: 0, silver: 500, gold: 2000, platinum: 5000 };

function Avatar({ name, size = 96, pic }) {
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "U";
  if (pic) return (
    <img src={pic} alt="profile" style={{ width: size, height: size }}
      className="rounded-2xl border-2 border-amazon-border shadow-md object-cover" />
  );
  return (
    <div style={{ width: size, height: size, fontSize: size * 0.35 }}
      className="rounded-2xl border-2 border-amazon-border bg-gradient-to-br from-amazon-accent to-amazon-accent-hover flex items-center justify-center text-white font-black shadow-md">
      {initials}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-widest font-black text-amazon-text-secondary">{label}</label>
      {children}
    </div>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="py-3.5 border-b border-amazon-section last:border-0">
      <p className="text-[10px] uppercase tracking-widest font-black text-amazon-text-secondary mb-1">{label}</p>
      <p className="text-sm font-bold text-amazon-text">
        {value || <span className="text-amazon-text-secondary font-normal italic">Not specified</span>}
      </p>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color = "text-amazon-accent" }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }}
      className="bg-white border border-amazon-border rounded-2xl p-4 text-center shadow-sm">
      <div className="text-2xl mb-1">{icon}</div>
      <p className={`text-xl font-black ${color}`}>{value}</p>
      <p className="text-xs font-bold text-amazon-text mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-amazon-text-secondary mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function TierProgress({ tier, points, totalPointsEarned }) {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.bronze;
  const tierStart = TIER_THRESHOLDS[tier] || 0;
  const tierEnd   = cfg.threshold || totalPointsEarned;
  const progress  = cfg.next
    ? Math.min(100, ((totalPointsEarned - tierStart) / (tierEnd - tierStart)) * 100)
    : 100;

  return (
    <div className="bg-white border border-amazon-border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{cfg.icon}</span>
          <div>
            <p className="text-xs font-black text-amazon-text-secondary uppercase tracking-widest">Loyalty Tier</p>
            <p className={`text-base font-black capitalize ${cfg.color}`}>{tier}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-amazon-text-secondary">Available Points</p>
          <p className="text-xl font-black text-amazon-accent">{points?.toLocaleString() || 0}</p>
        </div>
      </div>
      <div className="h-2 bg-amazon-section rounded-full overflow-hidden mb-2">
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${cfg.bar}`} />
      </div>
      <div className="flex justify-between text-[10px] text-amazon-text-secondary font-medium">
        <span className="capitalize">{tier}</span>
        {cfg.next
          ? <span>{Math.max(0, tierEnd - totalPointsEarned)} pts to <span className="capitalize font-bold">{cfg.next}</span></span>
          : <span className="text-blue-600 font-bold">Max tier reached 🎉</span>
        }
      </div>
    </div>
  );
}

function OrderCard({ order, index }) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_COLORS[order.status] || STATUS_COLORS.Ordered;
  const date = new Date(order.createdAt);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white border border-amazon-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-10 h-10 bg-amazon-section border border-amazon-border rounded-xl flex items-center justify-center text-lg flex-shrink-0">🛒</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-black text-amazon-accent">#{order._id.slice(-8).toUpperCase()}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg}`}>{order.status}</span>
          </div>
          <p className="text-xs text-amazon-text-secondary mt-0.5">
            {date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} · {order.products?.length || 0} item{order.products?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-base font-black text-amazon-accent">₹{order.totalAmount?.toLocaleString()}</p>
          <p className="text-[10px] text-amazon-text-secondary capitalize">{order.payment || "—"}</p>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="text-amazon-text-secondary text-xs flex-shrink-0">▼</motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-5 pb-4 border-t border-amazon-section pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amazon-section/20">
              <div>
                <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-2">Shipping To</p>
                <p className="text-xs text-amazon-text">{order.name || "—"}</p>
                <p className="text-xs text-amazon-text-secondary">{order.phone || "—"}</p>
                <p className="text-xs text-amazon-text-secondary">{order.address || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-2">Items ({order.products?.length})</p>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {order.products?.map((p, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-amazon-text truncate max-w-[160px]">{p.productId?.name || `Item #${i + 1}`}</span>
                      <span className="text-amazon-accent font-bold ml-2">×{p.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [editMode, setEditMode]       = useState(false);
  const [saving, setSaving]           = useState(false);
  const [formData, setFormData]       = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "", gender: "" });
  const [profilePic, setProfilePic]   = useState(null);
  const [picPreview, setPicPreview]   = useState(null);
  const [refresh, setRefresh]         = useState(0);
  const [activeTab, setActiveTab]     = useState("details");
  const [wishlist, setWishlist]       = useState([]);
  const [orders, setOrders]           = useState([]);
  const [rewards, setRewards]         = useState(null);
  const [wallet, setWallet]           = useState(null);
  const [orderFilter, setOrderFilter] = useState("All");

  const headerRef  = useRef(null);
  const sidebarRef = useRef(null);
  const mainRef    = useRef(null);

  useEffect(() => {
    if (!authUser?._id) return;
    const load = async () => {
      try {
        const [pRes, wRes, oRes] = await Promise.all([
          API.get(`/user/profile/${authUser._id}`),
          API.get(`/wishlist/${authUser._id}`),
          API.get(`/orders?userId=${authUser._id}`),
        ]);
        setUserProfile(pRes.data);
        setFormData({
          name: pRes.data.name || "", phone: pRes.data.phone || "",
          address: pRes.data.address || "", city: pRes.data.city || "",
          state: pRes.data.state || "", pincode: pRes.data.pincode || "",
          gender: pRes.data.gender || "",
        });
        if (pRes.data.profilePic) setPicPreview(imgUrl(pRes.data.profilePic));
        setWishlist(wRes.data);
        setOrders(oRes.data);

        // rewards + wallet (non-critical)
        try {
          const [rRes, walRes] = await Promise.all([
            API.get("/rewards"),
            API.get("/wallet/balance"),
          ]);
          setRewards(rRes.data);
          setWallet(walRes.data);
        } catch { /* Optional data could not be loaded. */ }
      } catch (e) { console.error(e); }
    };
    load();
  }, [authUser?._id, refresh]);

  useEffect(() => {
    if (!userProfile) return;
    const ctx = gsap.context(() => {
      if (headerRef.current)
        gsap.fromTo(headerRef.current,  { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
      if (sidebarRef.current)
        gsap.fromTo(sidebarRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, delay: 0.1, ease: "power3.out" });
      if (mainRef.current)
        gsap.fromTo(mainRef.current,    { x: 30,  opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, delay: 0.15, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, [userProfile]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(k => data.append(k, formData[k]));
      if (profilePic) data.append("profilePic", profilePic);
      await API.put(`/user/profile/${authUser._id}`, data);
      setEditMode(false);
      setRefresh(r => r + 1);
    } catch { alert("Update failed."); }
    finally { setSaving(false); }
  };

  if (!userProfile) return (
    <div className="flex items-center justify-center min-h-screen bg-amazon-section">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="w-10 h-10 border-4 border-amazon-border border-t-amazon-accent rounded-full" />
    </div>
  );

  const totalSpent = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const deliveredCount = orders.filter(o => o.status === "Delivered").length;
  const memberSince = new Date(userProfile.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

  const orderStatuses = ["All", ...new Set(orders.map(o => o.status).filter(Boolean))];
  const filteredOrders = orderFilter === "All" ? orders : orders.filter(o => o.status === orderFilter);

  const tabs = [
    { id: "details",  label: "Profile",       icon: "👤" },
    { id: "orders",   label: "Orders",        icon: "📦", badge: orders.length },
    { id: "wishlist", label: "Wishlist",      icon: "❤️",  badge: wishlist.length },
    { id: "rewards",  label: "Rewards",       icon: "🏆" },
  ];

  return (
    <div className="min-h-screen bg-amazon-section antialiased">

      {/* HEADER */}
      <div ref={headerRef} className="border-b border-amazon-border py-4 px-6 sticky top-0 bg-white/90 backdrop-blur-md z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-amazon-text">My Account<span className="text-amazon-accent">.</span></h1>
            <p className="text-xs text-amazon-accent mt-0.5">Member since {memberSince}</p>
          </div>
          <AnimatePresence mode="wait">
            {!editMode ? (
              <motion.button key="edit" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setEditMode(true)}
                className="px-5 py-2.5 bg-amazon-accent hover:bg-amazon-accent-hover text-white text-sm font-black rounded-xl shadow-md">
                ✏️ Edit Profile
              </motion.button>
            ) : (
              <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
                <button onClick={() => setEditMode(false)}
                  className="px-4 py-2.5 border border-amazon-border text-amazon-text text-sm font-bold rounded-xl hover:bg-amazon-section transition">
                  Cancel
                </button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
                  className="px-5 py-2.5 bg-amazon-accent hover:bg-amazon-accent-hover text-white text-sm font-black rounded-xl shadow-md disabled:opacity-60 flex items-center gap-2">
                  {saving && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />}
                  Save Changes
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-65px)]">

        {/* SIDEBAR */}
        <aside ref={sidebarRef} className="lg:col-span-3 border-r border-amazon-border bg-white p-6 space-y-2">

          {/* Avatar block */}
          <div className="flex flex-col items-center text-center pb-6 border-b border-amazon-section mb-4">
            <div className="relative group mb-3">
              <Avatar name={userProfile.name} size={96} pic={picPreview} />
              {editMode && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition-all">
                  <span className="text-white text-[10px] font-black text-center px-2">Change Photo</span>
                  <input type="file" hidden accept="image/*" onChange={e => {
                    const f = e.target.files[0];
                    if (f) {
                      if (picPreview && picPreview.startsWith("blob:")) URL.revokeObjectURL(picPreview);
                      setProfilePic(f);
                      setPicPreview(URL.createObjectURL(f));
                    }
                  }} />
                </label>
              )}
            </div>
            <h3 className="text-base font-black text-amazon-text">{userProfile.name}</h3>
            <p className="text-xs text-amazon-accent mt-0.5 truncate max-w-full">{userProfile.email}</p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              <span className="text-[10px] bg-amazon-section text-amazon-accent border border-amazon-border px-2.5 py-1 rounded-full font-bold">
                ✓ Verified
              </span>
              {rewards?.tier && (
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border capitalize ${TIER_CONFIG[rewards.tier]?.bg} ${TIER_CONFIG[rewards.tier]?.color}`}>
                  {TIER_CONFIG[rewards.tier]?.icon} {rewards.tier}
                </span>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-2 pb-5 border-b border-amazon-section mb-2">
            <div className="bg-amazon-section rounded-xl p-3 text-center border border-amazon-border">
              <p className="text-lg font-black text-amazon-accent">{orders.length}</p>
              <p className="text-[10px] text-amazon-text-secondary font-medium">Orders</p>
            </div>
            <div className="bg-amazon-section rounded-xl p-3 text-center border border-amazon-border">
              <p className="text-lg font-black text-amazon-accent">{wishlist.length}</p>
              <p className="text-[10px] text-amazon-text-secondary font-medium">Wishlist</p>
            </div>
            <div className="bg-amazon-section rounded-xl p-3 text-center border border-amazon-border">
              <p className="text-lg font-black text-amazon-accent">{rewards?.points || 0}</p>
              <p className="text-[10px] text-amazon-text-secondary font-medium">Points</p>
            </div>
            <div className="bg-amazon-section rounded-xl p-3 text-center border border-amazon-border">
              <p className="text-lg font-black text-amazon-accent">₹{(wallet?.balance || 0).toLocaleString()}</p>
              <p className="text-[10px] text-amazon-text-secondary font-medium">Wallet</p>
            </div>
          </div>

          {/* Nav */}
          {tabs.map((tab, i) => (
            <motion.button key={tab.id}
              initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ x: 3 }}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-amazon-section text-amazon-accent border border-amazon-border shadow-sm"
                  : "text-amazon-text-secondary hover:bg-amazon-section/60 hover:text-amazon-accent"
              }`}>
              <span className="text-base">{tab.icon}</span>
              {tab.label}
              {tab.badge > 0 && (
                <span className="ml-auto text-[10px] bg-amazon-accent text-white rounded-full px-2 py-0.5 font-black">{tab.badge}</span>
              )}
            </motion.button>
          ))}
        </aside>

        {/* MAIN */}
        <main ref={mainRef} className="lg:col-span-9 min-w-0 p-4 sm:p-6 lg:p-10">
          <AnimatePresence mode="wait">

            {/* ── PROFILE TAB ── */}
            {activeTab === "details" && (
              <motion.div key="details" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                className="max-w-3xl space-y-5">

                {/* Hero card */}
                <div className="bg-white rounded-2xl border border-amazon-border p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <Avatar name={userProfile.name} size={88} pic={picPreview} />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-black text-amazon-text">{userProfile.name}</h2>
                    <p className="text-sm text-amazon-accent">{userProfile.email}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-amazon-section text-amazon-accent border border-amazon-border px-3 py-1 rounded-full font-bold">✓ Verified</span>
                      <span className="text-xs bg-amazon-section text-amazon-accent border border-amazon-border px-3 py-1 rounded-full font-bold">📦 {orders.length} Orders</span>
                      <span className="text-xs bg-amazon-section text-amazon-accent border border-amazon-border px-3 py-1 rounded-full font-bold">❤️ {wishlist.length} Saved</span>
                      <span className="text-xs bg-amazon-section text-amazon-accent border border-amazon-border px-3 py-1 rounded-full font-bold">🗓 Since {memberSince}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-amazon-text-secondary">Total Spent</p>
                    <p className="text-2xl font-black text-amazon-accent">₹{totalSpent.toLocaleString()}</p>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard icon="📦" label="Total Orders"   value={orders.length}          />
                  <StatCard icon="✅" label="Delivered"      value={deliveredCount}          color="text-emerald-600" />
                  <StatCard icon="🏆" label="Points"         value={rewards?.points || 0}    color="text-amber-600" />
                  <StatCard icon="👛" label="Wallet"         value={`₹${(wallet?.balance || 0).toLocaleString()}`} />
                </div>

                {/* Personal info */}
                <div className="bg-white rounded-2xl border border-amazon-border p-6 shadow-sm">
                  <h3 className="text-sm font-black text-amazon-text flex items-center gap-2 mb-5">
                    <span className="w-1 h-5 rounded-full bg-amazon-accent inline-block" /> Personal Information
                  </h3>
                  {editMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field label="Display Name">
                        <input name="name" value={formData.name} onChange={handleChange} className={inputCls} />
                      </Field>
                      <Field label="Phone Number">
                        <input name="phone" value={formData.phone} onChange={handleChange} className={inputCls} placeholder="+91 98765 43210" />
                      </Field>
                      <Field label="Gender">
                        <select name="gender" value={formData.gender} onChange={handleChange} className={inputCls}>
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </Field>
                      <Field label="City">
                        <input name="city" value={formData.city} onChange={handleChange} className={inputCls} placeholder="Mumbai" />
                      </Field>
                      <Field label="State">
                        <input name="state" value={formData.state} onChange={handleChange} className={inputCls} placeholder="Maharashtra" />
                      </Field>
                      <Field label="Pincode">
                        <input name="pincode" value={formData.pincode} onChange={handleChange} className={inputCls} placeholder="400001" />
                      </Field>
                      <div className="md:col-span-2">
                        <Field label="Street Address">
                          <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="Flat / Building, Street, Area" />
                        </Field>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      <DataRow label="Phone Number"    value={userProfile.phone} />
                      <DataRow label="Gender"          value={userProfile.gender} />
                      <DataRow label="City"            value={userProfile.city} />
                      <DataRow label="State"           value={userProfile.state} />
                      <DataRow label="Pincode"         value={userProfile.pincode} />
                      <DataRow label="Member Since"    value={memberSince} />
                      <div className="md:col-span-2">
                        <DataRow label="Full Address"  value={userProfile.address} />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── ORDERS TAB ── */}
            {activeTab === "orders" && (
              <motion.div key="orders" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xl font-black text-amazon-text">Order History</h3>
                  <div className="flex flex-wrap gap-2">
                    {orderStatuses.map(s => (
                      <button key={s} onClick={() => setOrderFilter(s)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                          orderFilter === s ? "bg-amazon-accent text-white border-amazon-accent" : "bg-white text-amazon-text-secondary border-amazon-border hover:border-amazon-accent"
                        }`}>{s}</button>
                    ))}
                  </div>
                </div>

                {/* Summary strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard icon="🛒" label="Total Orders"  value={orders.length} />
                  <StatCard icon="✅" label="Delivered"     value={deliveredCount} color="text-emerald-600" />
                  <StatCard icon="💰" label="Total Spent"   value={`₹${totalSpent.toLocaleString()}`} />
                  <StatCard icon="📊" label="Avg Order"     value={orders.length ? `₹${Math.round(totalSpent / orders.length).toLocaleString()}` : "—"} />
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-amazon-border rounded-2xl">
                    <span className="text-5xl mb-3">📦</span>
                    <p className="font-bold text-amazon-text">No orders found</p>
                    <p className="text-sm text-amazon-text-secondary mt-1">Try a different filter</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((o, i) => <OrderCard key={o._id} order={o} index={i} />)}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── WISHLIST TAB ── */}
            {activeTab === "wishlist" && (
              <motion.div key="wishlist" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-black text-amazon-text">My Wishlist</h3>
                  <span className="text-sm text-amazon-accent font-bold">{wishlist.length} item{wishlist.length !== 1 ? "s" : ""}</span>
                </div>
                {wishlist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-amazon-border rounded-2xl">
                    <span className="text-5xl mb-3">❤️</span>
                    <p className="font-bold text-amazon-text">Your wishlist is empty</p>
                    <p className="text-sm text-amazon-text-secondary mt-1">Save products you love</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {wishlist.map((item, i) => item.productId && (
                      <motion.div key={item._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="relative">
                        {/* Remove button */}
                        <button
                          onClick={async () => {
                            try {
                              await API.delete(`/wishlist/${item._id}`);
                              setWishlist(prev => prev.filter(w => w._id !== item._id));
                            } catch { alert("Failed to remove"); }
                          }}
                          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white border border-amazon-border shadow flex items-center justify-center text-amazon-text-secondary hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                          title="Remove from wishlist"
                        >
                          ✕
                        </button>
                        <ProductCard product={item.productId} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── REWARDS TAB ── */}
            {activeTab === "rewards" && (
              <motion.div key="rewards" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                className="max-w-2xl space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-amazon-text">Rewards & Loyalty</h3>
                  <button onClick={() => navigate("/rewards")}
                    className="text-xs font-bold text-amazon-accent border border-amazon-accent px-4 py-2 rounded-xl hover:bg-amazon-accent hover:text-white transition">
                    View Full Rewards →
                  </button>
                </div>

                {rewards ? (
                  <>
                    <TierProgress tier={rewards.tier} points={rewards.points} totalPointsEarned={rewards.totalPointsEarned} />

                    <div className="grid grid-cols-2 gap-3">
                      <StatCard icon="⭐" label="Available Points"     value={rewards.points?.toLocaleString()}            color="text-amazon-accent" />
                      <StatCard icon="📈" label="Total Points Earned"  value={rewards.totalPointsEarned?.toLocaleString()} color="text-purple-600" />
                    </div>

                    {/* Tier benefits */}
                    <div className="bg-white border border-amazon-border rounded-2xl p-5 shadow-sm">
                      <h4 className="text-sm font-black text-amazon-text mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 rounded-full bg-amazon-accent inline-block" /> Tier Benefits
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { tier: "bronze",   icon: "🥉", perks: ["1x points on orders", "Birthday bonus"] },
                          { tier: "silver",   icon: "🥈", perks: ["1.5x points", "Free shipping on ₹499+"] },
                          { tier: "gold",     icon: "🥇", perks: ["2x points", "Priority support", "Early access"] },
                          { tier: "platinum", icon: "💎", perks: ["3x points", "Free express delivery", "Dedicated manager"] },
                        ].map(t => (
                          <div key={t.tier} className={`rounded-xl border p-3 ${rewards.tier === t.tier ? "border-amazon-accent bg-amazon-section/50" : "border-amazon-border bg-white opacity-60"}`}>
                            <p className="text-sm font-black text-amazon-text capitalize mb-1">{t.icon} {t.tier}</p>
                            {t.perks.map(p => <p key={p} className="text-[11px] text-amazon-text-secondary">• {p}</p>)}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Wallet */}
                    {wallet !== null && (
                      <div className="bg-white border border-amazon-border rounded-2xl p-5 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-amazon-accent/10 border border-amazon-accent/20 rounded-xl flex items-center justify-center text-2xl">👛</div>
                          <div>
                            <p className="text-xs font-black text-amazon-text-secondary uppercase tracking-widest">OneCart Wallet</p>
                            <p className="text-2xl font-black text-amazon-accent">₹{(wallet.balance || 0).toLocaleString()}</p>
                          </div>
                        </div>
                        <button onClick={() => navigate("/reload-balance")} className="text-xs font-black text-amazon-accent border border-amazon-accent px-4 py-2 rounded-xl hover:bg-amazon-accent hover:text-white transition">
                          Add Money →
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-amazon-border rounded-2xl">
                    <span className="text-5xl mb-3">🏆</span>
                    <p className="font-bold text-amazon-text">Rewards data unavailable</p>
                    <p className="text-sm text-amazon-text-secondary mt-1">Place your first order to start earning points</p>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
