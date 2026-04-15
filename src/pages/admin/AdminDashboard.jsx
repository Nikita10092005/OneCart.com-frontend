import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Package, ShoppingCart, Users, TrendingUp, MessageSquare,
  ArrowUpRight, ArrowDownRight, DollarSign, Inbox,
  AlertTriangle, Star, PlusCircle, BarChart3, Store,
  Clock, CheckCircle, XCircle, Zap
} from "lucide-react";

const STATUS_STYLES = {
  Ordered:   { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400" },
  Packed:    { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400" },
  Shipped:   { bg: "bg-purple-50",  text: "text-purple-700",  dot: "bg-purple-400" },
  Delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  Cancelled: { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400" },
};

function KpiCard({ label, value, sub, icon: Icon, iconBg, trend, delay = 0 }) {
  const up = trend >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
            {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-black text-gray-800 leading-none mb-1">{value ?? "—"}</p>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

function SectionHeader({ icon: Icon, title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon size={15} className="text-amazon-accent" />
        <h2 className="text-sm font-black text-gray-700">{title}</h2>
      </div>
      {action && (
        <button onClick={onAction}
          className="flex items-center gap-1 text-xs font-bold text-amazon-accent hover:text-orange-600 transition">
          {action} <ArrowUpRight size={11} />
        </button>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats]         = useState({});
  const [orders, setOrders]       = useState([]);
  const [queries, setQueries]     = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [sR, oR, qR, aR] = await Promise.all([
          API.get("/admin/dashboard"),
          API.get("/admin/orders"),
          API.get("/contact"),
          API.get("/admin/analytics/financial?period=30"),
        ]);
        setStats(sR.data);
        setOrders(Array.isArray(oR.data) ? oR.data.slice(0, 7) : []);
        setQueries(Array.isArray(qR.data) ? qR.data.slice(0, 5) : []);
        setAnalytics(aR.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div className="flex h-80 items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="w-9 h-9 border-4 border-gray-100 border-t-amazon-accent rounded-full" />
    </div>
  );

  const revenue    = stats.revenue || 0;
  const growth     = analytics?.growthComparison?.revenueGrowth ?? 0;
  const openQ      = queries.filter(q => q.status !== "replied" && q.status !== "closed").length;
  const todayOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return (
    <div className="space-y-6">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Good day, Admin 👋</h1>
          <p className="text-sm text-gray-400 mt-0.5">Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> All systems live
          </span>
          <button onClick={() => navigate("/admin/add-product")}
            className="flex items-center gap-1.5 text-xs font-bold bg-amazon-accent hover:bg-orange-500 text-white px-4 py-2 rounded-xl transition shadow-sm">
            <PlusCircle size={13} /> Add Product
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total Revenue"  value={`₹${revenue.toLocaleString()}`}
          icon={DollarSign} iconBg="bg-amazon-accent"
          trend={growth} sub="vs last 30 days" delay={0} />
        <KpiCard label="Total Orders"   value={stats.totalOrders}
          icon={ShoppingCart} iconBg="bg-blue-500"
          sub={`${todayOrders} today`} delay={0.06} />
        <KpiCard label="Customers"      value={stats.totalUsers}
          icon={Users} iconBg="bg-purple-500"
          sub="Registered users" delay={0.12} />
        <KpiCard label="Products"       value={stats.totalProducts}
          icon={Package} iconBg="bg-amber-500"
          sub="In catalogue" delay={0.18} />
      </div>

      {/* ── ALERT BANNER ── */}
      {openQ > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate("/admin/queries")}
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 cursor-pointer hover:bg-amber-100 transition">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
          <p className="text-sm font-bold text-amber-700">
            {openQ} unanswered {openQ === 1 ? "query" : "queries"} waiting for your reply
          </p>
          <ArrowUpRight size={14} className="text-amber-500 ml-auto" />
        </motion.div>
      )}

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Orders — 2 cols */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <SectionHeader icon={ShoppingCart} title="Recent Orders" action="View all" onAction={() => navigate("/admin/orders")} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-100">
                  <th className="text-left text-[10px] font-black text-gray-400 uppercase tracking-wider px-5 py-2.5">Order</th>
                  <th className="text-left text-[10px] font-black text-gray-400 uppercase tracking-wider px-3 py-2.5">Customer</th>
                  <th className="text-left text-[10px] font-black text-gray-400 uppercase tracking-wider px-3 py-2.5">Amount</th>
                  <th className="text-left text-[10px] font-black text-gray-400 uppercase tracking-wider px-3 py-2.5">Status</th>
                  <th className="text-left text-[10px] font-black text-gray-400 uppercase tracking-wider px-3 py-2.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-gray-400 py-10 text-sm">No orders yet</td></tr>
                ) : orders.map((o, i) => {
                  const s = STATUS_STYLES[o.status] || STATUS_STYLES.Ordered;
                  return (
                    <motion.tr key={o._id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.04 }}
                      className="hover:bg-gray-50/60 transition">
                      <td className="px-5 py-3">
                        <span className="font-black text-gray-700 text-xs">#{o._id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-gray-700 text-xs truncate max-w-[120px]">
                          {o.userId?.name || o.name || "Customer"}
                        </p>
                        <p className="text-[10px] text-gray-400">{o.products?.length || 0} item{o.products?.length !== 1 ? "s" : ""}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-black text-gray-800 text-xs">₹{(o.totalAmount || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${s.bg} ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {o.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-[10px] text-gray-400">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="flex flex-col gap-5">

          {/* Revenue Summary */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <SectionHeader icon={TrendingUp} title="Revenue (30d)" action="Analytics" onAction={() => navigate("/admin/analytics")} />
            <div className="space-y-3">
              {[
                { label: "Revenue",    value: `₹${(analytics?.summary?.totalRevenue || 0).toLocaleString()}`, color: "text-amazon-accent" },
                { label: "Orders",     value: analytics?.summary?.totalOrders || 0,                           color: "text-blue-600" },
                { label: "Avg Value",  value: `₹${Math.round(analytics?.summary?.avgOrderValue || 0).toLocaleString()}`, color: "text-purple-600" },
                { label: "Growth",     value: `${growth >= 0 ? "+" : ""}${growth}%`,                         color: growth >= 0 ? "text-emerald-600" : "text-red-500" },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-400 font-medium">{r.label}</span>
                  <span className={`text-sm font-black ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Queries */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1">
            <SectionHeader icon={Inbox} title="Queries" action="View all" onAction={() => navigate("/admin/queries")} />
            {queries.length === 0 ? (
              <p className="text-center text-gray-400 py-6 text-xs">No queries yet</p>
            ) : (
              <div className="space-y-2">
                {queries.map((q, i) => (
                  <motion.div key={q._id}
                    initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                    onClick={() => navigate("/admin/queries")}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition">
                    <div className="w-7 h-7 rounded-full bg-amazon-accent flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
                      {q.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-700 truncate">{q.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{q.message}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                      q.status === "replied" ? "bg-emerald-100 text-emerald-700" :
                      q.status === "closed"  ? "bg-gray-100 text-gray-500" :
                      "bg-amber-100 text-amber-700"
                    }`}>{q.status || "open"}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="bg-[#0F1923] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,153,0,0.12), transparent)", transform: "translate(30%,-30%)" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={15} className="text-amazon-accent" />
            <h2 className="text-sm font-black text-white">Quick Actions</h2>
          </div>
          <p className="text-xs text-white/40 mb-5">Jump to any section instantly</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: "Products",    path: "/admin/products",    icon: Package },
              { label: "Add Product", path: "/admin/add-product", icon: PlusCircle },
              { label: "Orders",      path: "/admin/orders",      icon: ShoppingCart },
              { label: "Messages",    path: "/admin/messages",    icon: MessageSquare },
              { label: "Analytics",   path: "/admin/analytics",   icon: BarChart3 },
              { label: "Sellers",     path: "/admin/sellers",     icon: Store },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.button key={a.label}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
                  whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.15)" }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate(a.path)}
                  className="flex flex-col items-center gap-2 bg-white/8 border border-white/10 text-white/70 hover:text-white px-3 py-4 rounded-xl transition-all text-xs font-bold">
                  <Icon size={18} className="text-amazon-accent" />
                  {a.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
