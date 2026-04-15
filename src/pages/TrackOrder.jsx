import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { imgUrl } from "../utils/imageUrl";
import {
  Package, Truck, Home, ClipboardList, Check, Search,
  MapPin, Phone, CreditCard, Calendar, ChevronDown, ChevronUp,
  Clock, RefreshCw, AlertCircle
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STAGES = [
  { name: "Ordered",   icon: ClipboardList, label: "Order Placed",   desc: "Your order has been confirmed" },
  { name: "Packed",    icon: Package,       label: "Packed",          desc: "Items are being prepared" },
  { name: "Shipped",   icon: Truck,         label: "Shipped",         desc: "Order is on the way" },
  { name: "Delivered", icon: Home,          label: "Delivered",       desc: "Order delivered successfully" },
];

const STATUS_CONFIG = {
  Ordered:   { color: "text-amazon-accent",   bg: "bg-amazon-section",   border: "border-amazon-border",  dot: "bg-amazon-accent" },
  Packed:    { color: "text-blue-600",         bg: "bg-blue-50",          border: "border-blue-200",        dot: "bg-blue-500" },
  Shipped:   { color: "text-orange-600",       bg: "bg-orange-50",        border: "border-orange-200",      dot: "bg-orange-500" },
  Delivered: { color: "text-emerald-700",      bg: "bg-emerald-50",       border: "border-emerald-200",     dot: "bg-emerald-500" },
  Cancelled: { color: "text-red-500",          bg: "bg-red-50",           border: "border-red-200",         dot: "bg-red-400" },
};

function TrackingProgress({ status, trackingStages = [] }) {
  const currentIndex = STAGES.findIndex(s => s.name === status);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const isCancelled = status === "Cancelled";

  const stageTimestamps = {};
  trackingStages.forEach(({ stage, timestamp }) => {
    stageTimestamps[stage] = timestamp;
  });

  const fmt = (ts) => {
    if (!ts) return null;
    return new Date(ts).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  if (isCancelled) return (
    <div className="flex items-center gap-3 py-4 px-5 bg-red-50 border border-red-200 rounded-2xl">
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
        <AlertCircle size={20} className="text-red-500" />
      </div>
      <div>
        <p className="font-bold text-red-600">Order Cancelled</p>
        <p className="text-xs text-red-400 mt-0.5">This order has been cancelled</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Progress Steps */}
      <div className="relative">
        {/* Background track */}
        <div className="absolute top-5 left-5 right-5 h-1 bg-amazon-border rounded-full" />
        {/* Active track */}
        <motion.div
          className="absolute top-5 left-5 h-1 bg-amazon-accent rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: safeIndex === 0
              ? "0%"
              : `calc(${(safeIndex / (STAGES.length - 1)) * 100}% - 40px)`
          }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />

        <div className="flex justify-between relative z-10">
          {STAGES.map((stage, i) => {
            const done = i < safeIndex;
            const current = i === safeIndex;
            const pending = i > safeIndex;
            const Icon = stage.icon;
            const ts = stageTimestamps[stage.name];

            return (
              <div key={stage.name} className="flex flex-col items-center gap-2 flex-1">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-all
                    ${done    ? "bg-amazon-accent border-amazon-accent text-amazon-text"
                    : current ? "bg-amazon-accent border-amazon-accent text-amazon-text ring-4 ring-amazon-accent/25"
                    :           "bg-white border-amazon-border text-amazon-text-secondary"}`}
                >
                  {done ? <Check size={18} strokeWidth={3} /> : <Icon size={16} strokeWidth={current ? 2.5 : 1.5} />}
                </motion.div>

                <div className="text-center">
                  <p className={`text-xs font-bold ${done || current ? "text-amazon-text" : "text-amazon-text-secondary"}`}>
                    {stage.label}
                  </p>
                  {ts && (
                    <p className="text-[10px] text-amazon-text-secondary mt-0.5 leading-tight">{fmt(ts)}</p>
                  )}
                  {current && !ts && (
                    <span className="inline-block mt-1 text-[10px] bg-amazon-accent text-amazon-text px-1.5 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current status banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-3 bg-amazon-section border border-amazon-border rounded-xl px-4 py-3"
      >
        <div className="w-2 h-2 rounded-full bg-amazon-accent animate-pulse flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-amazon-text">{STAGES[safeIndex]?.desc}</p>
          {trackingStages.length > 0 && (
            <p className="text-xs text-amazon-text-secondary mt-0.5">
              Last updated: {fmt(trackingStages[trackingStages.length - 1]?.timestamp)}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function OrderCard({ order, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Ordered;
  const total = order.totalAmount || 0;
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-amazon-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-amazon-section/30 transition"
        onClick={() => setOpen(!open)}
      >
        {/* Product thumbnails */}
        <div className="flex -space-x-2 flex-shrink-0">
          {order.products?.slice(0, 3).map((item, j) => (
            <div key={j} className="w-12 h-12 rounded-xl bg-amazon-section border-2 border-white overflow-hidden flex-shrink-0">
              <img
                src={item.productId?.image ? imgUrl(item.productId.image) : null}
                alt=""
                className="w-full h-full object-contain p-1"
                onError={e => { e.target.style.display = "none"; }}
              />
            </div>
          ))}
          {order.products?.length > 3 && (
            <div className="w-12 h-12 rounded-xl bg-amazon-section border-2 border-white flex items-center justify-center text-xs font-bold text-amazon-text-secondary flex-shrink-0">
              +{order.products.length - 3}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-sm font-black text-amazon-text">#{order._id.slice(-8).toUpperCase()}</p>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-amazon-text-secondary flex-wrap">
            <span className="flex items-center gap-1"><Calendar size={11} />{date}</span>
            <span className="flex items-center gap-1"><CreditCard size={11} />{order.payment}</span>
            <span>{order.products?.length} item{order.products?.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Price + toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <p className="text-base font-extrabold text-amazon-price">₹{total.toLocaleString()}</p>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} className="text-amazon-text-secondary" />
          </motion.div>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-amazon-border"
          >
            <div className="px-5 py-5 space-y-5">

              {/* Tracking progress */}
              <div>
                <p className="text-xs font-black text-amazon-text-secondary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Truck size={12} /> Tracking Status
                </p>
                <TrackingProgress status={order.status} trackingStages={order.trackingStages || []} />
              </div>

              {/* Delivery info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-amazon-section border border-amazon-border rounded-xl p-3">
                  <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <ClipboardList size={10} /> Name
                  </p>
                  <p className="text-sm font-semibold text-amazon-text">{order.name || "—"}</p>
                </div>
                <div className="bg-amazon-section border border-amazon-border rounded-xl p-3">
                  <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Phone size={10} /> Phone
                  </p>
                  <p className="text-sm font-semibold text-amazon-text">{order.phone || "—"}</p>
                </div>
                <div className="bg-amazon-section border border-amazon-border rounded-xl p-3 sm:col-span-1">
                  <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <MapPin size={10} /> Address
                  </p>
                  <p className="text-sm font-semibold text-amazon-text leading-snug">{order.address || "—"}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-black text-amazon-text-secondary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Package size={12} /> Items Ordered
                </p>
                <div className="space-y-2">
                  {order.products?.map((item, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: j * 0.05 }}
                      className="flex items-center gap-3 bg-amazon-section border border-amazon-border rounded-xl p-3"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white border border-amazon-border flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={item.productId?.image ? imgUrl(item.productId.image) : null}
                          alt={item.productId?.name}
                          className="w-full h-full object-contain p-1"
                          onError={e => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-amazon-text truncate">{item.productId?.name || "Product"}</p>
                        <p className="text-xs text-amazon-text-secondary mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-amazon-price flex-shrink-0">
                        ₹{((item.productId?.price || 0) * item.quantity).toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              <div className="bg-amazon-section border border-amazon-border rounded-xl p-4">
                <div className="flex justify-between text-sm text-amazon-text mb-2">
                  <span>Subtotal</span>
                  <span>₹{(total - 49).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-amazon-text mb-3">
                  <span>Delivery</span>
                  <span>₹49</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-amazon-text border-t border-amazon-border pt-3">
                  <span>Total Paid</span>
                  <span className="text-amazon-price">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Timeline */}
              {order.trackingStages?.length > 0 && (
                <div>
                  <p className="text-xs font-black text-amazon-text-secondary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Clock size={12} /> Activity Timeline
                  </p>
                  <div className="space-y-2">
                    {[...order.trackingStages].reverse().map((s, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                        <div>
                          <p className="text-sm font-semibold text-amazon-text">Order {s.stage}</p>
                          <p className="text-xs text-amazon-text-secondary">
                            {new Date(s.timestamp).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                              hour: "2-digit", minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TrackOrder() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [filter, setFilter] = useState("all");

  // Auto-load user's orders
  useEffect(() => {
    if (!user) { setLoadingOrders(false); return; }
    API.get("/orders")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        const unique = Array.from(new Map(data.map(o => [o._id, o])).values());
        setOrders(unique);
      })
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, [user]);

  const handleSearch = async () => {
    const cleanId = searchId.trim().replace(/^#/, "");
    if (!cleanId) return;
    setSearching(true);
    setSearchError("");
    setSearchResult(null);
    try {
      const token = localStorage.getItem("token");
      // Search by partial ID — find in user's orders list first
      const matchedOrder = orders.find(o =>
        o._id.toString().toUpperCase().endsWith(cleanId.toUpperCase()) ||
        o._id.toString().toUpperCase() === cleanId.toUpperCase()
      );

      if (matchedOrder) {
        setSearchResult(matchedOrder);
        return;
      }

      // Fallback: try full ID track endpoint
      const res = await fetch(`${API_URL}/api/orders/${cleanId}/track`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Not found");
      const trackData = await res.json();
      const orderRes = await API.get(`/orders/${cleanId}`);
      setSearchResult({ ...orderRes.data, ...trackData });
    } catch {
      setSearchError("Order not found. Please check the Order ID and try again.");
    } finally {
      setSearching(false);
    }
  };

  const filteredOrders = filter === "all"
    ? orders
    : orders.filter(o => o.status === filter);

  const statusCounts = {
    all: orders.length,
    Ordered: orders.filter(o => o.status === "Ordered").length,
    Shipped: orders.filter(o => o.status === "Shipped").length,
    Delivered: orders.filter(o => o.status === "Delivered").length,
  };

  return (
    <div className="min-h-screen bg-amazon-section py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 rounded-full bg-amazon-accent" />
            <h1 className="text-2xl font-extrabold text-amazon-text">Track Your Orders</h1>
          </div>
          <p className="text-sm text-amazon-text-secondary ml-4">
            Real-time tracking for all your OneCart orders
          </p>
        </motion.div>

        {/* Search by Order ID */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-amazon-border rounded-2xl p-5 shadow-sm"
        >
          <p className="text-xs font-black text-amazon-text-secondary uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Search size={12} /> Search by Order ID
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. #A1B2C3D4)"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="flex-1 border border-amazon-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent placeholder-amazon-text-secondary text-amazon-text"
            />
            <motion.button
              onClick={handleSearch}
              disabled={searching || !searchId.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text disabled:opacity-50 px-6 py-3 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 flex-shrink-0"
            >
              {searching
                ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                    className="w-4 h-4 border-2 border-amazon-text border-t-transparent rounded-full" />
                : <Search size={15} />
              }
              {searching ? "Searching..." : "Track"}
            </motion.button>
          </div>

          {searchError && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
              <AlertCircle size={15} /> {searchError}
            </motion.div>
          )}

          {searchResult && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
              <OrderCard order={searchResult} defaultOpen={true} />
            </motion.div>
          )}
        </motion.div>

        {/* My Orders */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <p className="text-xs font-black text-amazon-text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <Package size={12} /> My Recent Orders
            </p>
            <button
              onClick={() => { setLoadingOrders(true); API.get("/orders").then(r => setOrders(r.data)).finally(() => setLoadingOrders(false)); }}
              className="flex items-center gap-1.5 text-xs text-amazon-accent hover:text-amazon-accent-hover font-semibold transition"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>

          {/* Filter tabs */}
          {orders.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {[
                { key: "all",       label: "All Orders",  count: statusCounts.all },
                { key: "Ordered",   label: "Processing",  count: statusCounts.Ordered },
                { key: "Shipped",   label: "Shipped",     count: statusCounts.Shipped },
                { key: "Delivered", label: "Delivered",   count: statusCounts.Delivered },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                    ${filter === tab.key
                      ? "bg-amazon-accent text-amazon-text border-amazon-accent"
                      : "bg-white text-amazon-text-secondary border-amazon-border hover:border-amazon-accent hover:text-amazon-accent"}`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black
                      ${filter === tab.key ? "bg-amazon-text/20" : "bg-amazon-section"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {loadingOrders ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="w-10 h-10 border-4 border-amazon-border border-t-amazon-accent rounded-full" />
              <p className="text-sm text-amazon-text-secondary">Loading your orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white border border-amazon-border rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-amazon-section rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package size={28} className="text-amazon-text-secondary" />
              </div>
              <h3 className="text-base font-bold text-amazon-text mb-1">
                {filter === "all" ? "No orders yet" : `No ${filter.toLowerCase()} orders`}
              </h3>
              <p className="text-sm text-amazon-text-secondary">
                {filter === "all"
                  ? "Your orders will appear here once you place them"
                  : "Try a different filter to see your orders"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order, i) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <OrderCard order={order} defaultOpen={i === 0 && filteredOrders.length === 1} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Help section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-amazon-header rounded-2xl p-5 text-white"
        >
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amazon-accent flex items-center justify-center text-amazon-text text-xs font-black">?</span>
            Need Help?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: "📦", title: "Order not received?", desc: "Contact us if your order is delayed beyond expected delivery" },
              { icon: "🔄", title: "Want to return?", desc: "Initiate a return from your Orders page within 7 days of delivery" },
              { icon: "💬", title: "Have a question?", desc: "Chat with our support team for instant help" },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-3 border border-white/10">
                <p className="text-base mb-1">{item.icon}</p>
                <p className="text-xs font-bold text-white mb-1">{item.title}</p>
                <p className="text-xs text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
