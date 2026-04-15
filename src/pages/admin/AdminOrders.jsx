import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api";

const STATUS_COLORS = {
  Ordered:   "bg-amber-50 text-amber-600 border-amber-200",
  Packed:    "bg-blue-50 text-blue-600 border-blue-200",
  Shipped:   "bg-purple-50 text-purple-600 border-purple-200",
  Delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Cancelled: "bg-red-50 text-red-500 border-red-200",
  Confirmed: "bg-amazon-section text-amazon-accent border-amazon-border",
  Pending:   "bg-amber-50 text-amber-600 border-amber-200",
};

const STATUS_PERCENT = {
  Ordered: "20%", Pending: "20%", Confirmed: "40%",
  Packed: "50%", Shipped: "75%", Delivered: "100%", Cancelled: "100%"
};

const STATUS_BAR_COLOR = {
  Ordered: "bg-amber-400", Packed: "bg-blue-500", Shipped: "bg-purple-500",
  Delivered: "bg-emerald-500", Cancelled: "bg-red-400",
  Confirmed: "bg-amazon-accent", Pending: "bg-amber-400",
};

const STAGES = ["Ordered", "Packed", "Shipped", "Delivered"];

const PAYMENT_ICONS = { razorpay: "💳", cod: "💵", wallet: "👛", online: "🌐" };

function exportCSV(orders) {
  const rows = [["Order ID", "Customer", "Email", "Phone", "Amount", "Status", "Payment", "Date", "Items"]];
  orders.forEach(o => rows.push([
    o._id, o.userId?.name || o.name || "—", o.userId?.email || "—",
    o.phone || "—", o.totalAmount, o.status, o.payment || "—",
    new Date(o.createdAt).toLocaleDateString(), o.products?.length || 0
  ]));
  const csv = rows.map(r => r.join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "orders.csv";
  a.click();
}

function StatCard({ label, value, sub, color = "text-amazon-accent", bg = "bg-amazon-section" }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} className={`${bg} border border-amazon-border rounded-2xl px-5 py-4 min-w-[120px]`}>
      <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-amazon-accent mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function TrackingTimeline({ stages = [], status }) {
  const completed = stages.map(s => s.stage);
  return (
    <div className="flex items-center gap-1 mt-3">
      {STAGES.map((stage, i) => {
        const done = completed.includes(stage) || (status === "Delivered");
        const active = stage === status;
        return (
          <div key={stage} className="flex items-center gap-1 flex-1">
            <div className={`flex flex-col items-center flex-1`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border-2 transition-all
                ${done ? "bg-emerald-500 border-emerald-500 text-white" : active ? "bg-amazon-accent border-amazon-accent text-white" : "bg-white border-amazon-border text-amazon-text-secondary"}`}>
                {done ? "✓" : i + 1}
              </div>
              <span className="text-[9px] text-amazon-accent mt-0.5 text-center leading-tight">{stage}</span>
            </div>
            {i < STAGES.length - 1 && (
              <div className={`h-0.5 flex-1 mb-3 rounded ${done ? "bg-emerald-400" : "bg-amazon-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, onUpdate, expanded, onToggle }) {
  const statusColor = STATUS_COLORS[order.status] || STATUS_COLORS.Ordered;
  const barColor = STATUS_BAR_COLOR[order.status] || "bg-amazon-accent";
  const percent = STATUS_PERCENT[order.status] || "20%";
  const date = new Date(order.createdAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(0,0,0,0.08)" }}
      className="bg-white border border-amazon-border rounded-2xl overflow-hidden transition-all"
    >
      {/* Main row */}
      <div
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 cursor-pointer"
        onClick={onToggle}
      >
        {/* Avatar + ID + User */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-amazon-section border border-amazon-border flex items-center justify-center text-lg shrink-0">
            🛒
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-[9px] font-black text-amazon-text-secondary uppercase tracking-widest">Order ID</span>
              <span className="font-mono text-xs font-bold text-amazon-accent bg-amazon-section px-2 py-0.5 rounded-lg">
                {order._id.slice(-8).toUpperCase()}
              </span>
              <span className="text-[9px] text-amazon-text-secondary">{date.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}</span>
            </div>
            <p className="text-sm font-black text-amazon-text truncate">{order.userId?.name || order.name || "Anonymous"}</p>
            <p className="text-xs text-amazon-accent truncate">{order.userId?.email || "—"}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-1 max-w-[220px] w-full space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black text-amazon-text-secondary uppercase tracking-widest">Fulfillment</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>{order.status}</span>
          </div>
          <div className="h-1.5 w-full bg-amazon-section rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: percent }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`h-full ${barColor} rounded-full`}
            />
          </div>
        </div>

        {/* Meta chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] bg-amazon-section border border-amazon-border px-2 py-1 rounded-lg font-medium text-amazon-text-secondary">
            {PAYMENT_ICONS[order.payment?.toLowerCase()] || "💳"} {order.payment || "—"}
          </span>
          <span className="text-[10px] bg-amazon-section border border-amazon-border px-2 py-1 rounded-lg font-medium text-amazon-text-secondary">
            📦 {order.products?.length || 0} item{order.products?.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Amount + Status select */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-[9px] font-black text-amazon-text-secondary uppercase tracking-widest block">Total</span>
            <span className="text-xl font-black text-amazon-accent">₹{order.totalAmount?.toLocaleString()}</span>
          </div>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <select
              value={order.status}
              onChange={e => onUpdate(order._id, e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 bg-amazon-accent text-white rounded-xl text-[11px] font-black uppercase tracking-widest cursor-pointer hover:bg-amazon-accent-hover transition-all focus:outline-none focus:ring-2 focus:ring-amazon-accent/40 shadow-sm"
            >
              {["Ordered","Packed","Shipped","Delivered","Cancelled"].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="text-amazon-accent text-sm">▼</motion.div>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-amazon-section"
          >
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5 bg-amazon-section/30">
              {/* Shipping info */}
              <div>
                <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-2">Shipping Info</p>
                <div className="space-y-1 text-sm text-amazon-text">
                  <p>📞 {order.phone || "—"}</p>
                  <p>📍 {order.address || "—"}</p>
                  <p>💳 Payment: <span className="font-semibold">{order.payment || "—"}</span></p>
                  {order.paymentId && <p className="text-xs text-amazon-accent font-mono">ID: {order.paymentId}</p>}
                </div>
              </div>

              {/* Products */}
              <div>
                <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-2">Products ({order.products?.length})</p>
                <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                  {order.products?.map((p, i) => (
                    <div key={i} className="flex justify-between text-xs bg-white border border-amazon-border rounded-lg px-3 py-1.5">
                      <span className="text-amazon-text font-medium truncate max-w-[140px]">
                        {p.productId?.name || `Product #${i + 1}`}
                      </span>
                      <span className="text-amazon-accent font-bold shrink-0 ml-2">×{p.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking timeline */}
              <div>
                <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-2">Tracking Timeline</p>
                <TrackingTimeline stages={order.trackingStages || []} status={order.status} />
                {order.trackingStages?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {order.trackingStages.map((s, i) => (
                      <p key={i} className="text-[10px] text-amazon-accent">
                        ✓ {s.stage} — {new Date(s.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await API.get("/admin/orders");
      setOrders(res.data);
      setLoading(false);
    })();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/admin/orders/${id}`, { status });
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
  };

  const statusCounts = useMemo(() => {
    const counts = { All: orders.length };
    orders.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return counts;
  }, [orders]);

  const totalRevenue = useMemo(() => orders.reduce((a, b) => a + (b.totalAmount || 0), 0), [orders]);
  const avgOrder = orders.length ? (totalRevenue / orders.length).toFixed(0) : 0;
  const deliveredCount = statusCounts["Delivered"] || 0;
  const pendingCount = (statusCounts["Ordered"] || 0) + (statusCounts["Packed"] || 0);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (filterStatus !== "All") list = list.filter(o => o.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o._id.toLowerCase().includes(q) ||
        (o.userId?.name || o.name || "").toLowerCase().includes(q) ||
        (o.userId?.email || "").toLowerCase().includes(q) ||
        (o.phone || "").includes(q)
      );
    }
    if (sortBy === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "oldest") list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "highest") list.sort((a, b) => b.totalAmount - a.totalAmount);
    else if (sortBy === "lowest") list.sort((a, b) => a.totalAmount - b.totalAmount);
    return list;
  }, [orders, filterStatus, search, sortBy]);

  if (loading) return (
    <div className="flex h-60 items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="w-10 h-10 border-4 border-amazon-border border-t-amazon-accent rounded-full" />
    </div>
  );

  const allStatuses = ["All", "Ordered", "Packed", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-amazon-section">
        <div>
          <h2 className="text-3xl font-black text-amazon-text">Order Management<span className="text-amazon-accent">.</span></h2>
          <p className="text-amazon-accent text-sm mt-0.5">Real-time logistics and transaction flow</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 bg-amazon-section border border-amazon-border text-amazon-text text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-amazon-border transition-all"
        >
          ⬇ Export CSV
        </motion.button>
      </div>

      {/* STATS */}
      <div className="flex flex-wrap gap-3">
        <StatCard label="Total Orders" value={orders.length} bg="bg-white" />
        <StatCard label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} bg="bg-amazon-accent" color="text-white" />
        <StatCard label="Avg Order" value={`₹${Number(avgOrder).toLocaleString()}`} bg="bg-white" />
        <StatCard label="Delivered" value={deliveredCount} sub={`${orders.length ? ((deliveredCount/orders.length)*100).toFixed(0) : 0}% success rate`} bg="bg-white" color="text-emerald-600" />
        <StatCard label="Pending" value={pendingCount} sub="Ordered + Packed" bg="bg-white" color="text-amber-500" />
        <StatCard label="Cancelled" value={statusCounts["Cancelled"] || 0} bg="bg-white" color="text-red-500" />
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amazon-accent text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, order ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-amazon-border rounded-xl text-sm text-amazon-text placeholder-amazon-text-secondary focus:outline-none focus:ring-2 focus:ring-amazon-accent/30"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-white border border-amazon-border text-amazon-text text-sm font-medium px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amazon-accent/30"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {allStatuses.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                filterStatus === s
                  ? "bg-amazon-accent text-white border-amazon-accent"
                  : "bg-white text-amazon-text-secondary border-amazon-border hover:border-amazon-accent"
              }`}
            >
              {s} {statusCounts[s] !== undefined ? `(${statusCounts[s]})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS COUNT */}
      <p className="text-xs text-amazon-accent font-medium">
        Showing {filtered.length} of {orders.length} orders
      </p>

      {/* ORDER LIST */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-amazon-accent">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-bold text-amazon-text">No orders found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            filtered.map((order, i) => (
              <motion.div key={order._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <OrderCard
                  order={order}
                  onUpdate={updateStatus}
                  expanded={expandedId === order._id}
                  onToggle={() => setExpandedId(expandedId === order._id ? null : order._id)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminOrders;
