import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import API from "../../services/api";
import {
  TrendingUp, Users, Package, DollarSign,
  ArrowUpRight, ArrowDownRight, AlertTriangle, BarChart3
} from "lucide-react";

const PALETTE = ["#FF9900", "#3B82F6", "#8B5CF6", "#10B981", "#EF4444", "#F59E0B"];

const TABS = [
  { id: "sales",     label: "Sales",     icon: TrendingUp },
  { id: "customers", label: "Customers", icon: Users },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "financial", label: "Financial", icon: DollarSign },
];

const PERIODS = [
  { value: "7",  label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
];

/* ── shared tooltip style ── */
const tooltipStyle = {
  contentStyle: { background: "#1e293b", border: "none", borderRadius: 10, fontSize: 12, color: "#f1f5f9" },
  labelStyle:   { color: "#94a3b8", fontWeight: 700 },
  cursor:       { fill: "rgba(255,153,0,0.06)" },
};

/* ── KPI card ── */
function Kpi({ label, value, sub, trend, icon: Icon, accent }) {
  const up = trend >= 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: accent + "20" }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
            {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xl font-black text-gray-800 leading-none mb-0.5">{value ?? "—"}</p>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ── chart card wrapper ── */
function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${className}`}>
      <p className="text-sm font-black text-gray-700 mb-4">{title}</p>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SALES TAB
══════════════════════════════════════════════ */
function SalesTab({ data }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Revenue Trend">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.revenueTrends || []}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#FF9900" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FF9900" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="_id" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} formatter={v => [`₹${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#FF9900" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Best Selling Products">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.bestSellingProducts?.slice(0, 5) || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} formatter={v => [v, "Units Sold"]} />
              <Bar dataKey="totalSold" fill="#FF9900" radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Peak Hours Analysis">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.peakHours || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="_id" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="orders"  stroke="#FF9900" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CUSTOMERS TAB
══════════════════════════════════════════════ */
function CustomersTab({ data }) {
  const demo = data.demographics || {};
  const ltv  = data.lifetimeValue  || {};
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers",  value: demo.totalCustomers  || 0, color: "#FF9900" },
          { label: "Active Customers", value: demo.activeCustomers || 0, color: "#3B82F6" },
          { label: "Avg Lifetime Value", value: `₹${Math.round(ltv.avgLifetimeValue || 0).toLocaleString()}`, color: "#8B5CF6" },
          { label: "Avg Orders / Customer", value: (ltv.avgOrderCount || 0).toFixed(1), color: "#10B981" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xl font-black text-gray-800 mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Top Customers">
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {(data.purchasePatterns || []).slice(0, 8).map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                <div className="w-8 h-8 rounded-full bg-amazon-accent flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                  {c.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-700 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-amazon-accent">₹{Math.round(c.totalSpent).toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">{c.totalOrders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="New Customers Trend">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.newCustomersTrend || []}>
              <defs>
                <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="_id" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} formatter={v => [v, "New Customers"]} />
              <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2.5} fill="url(#custGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   INVENTORY TAB
══════════════════════════════════════════════ */
function InventoryTab({ data }) {
  const s = data.summary || {};
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products",   value: s.totalProducts || 0,                                    color: "#FF9900" },
          { label: "Low Stock",        value: s.lowStockCount || 0,                                    color: "#EF4444" },
          { label: "Dead Stock",       value: s.deadStockCount || 0,                                   color: "#F59E0B" },
          { label: "Inventory Value",  value: `₹${Math.round(s.totalInventoryValue || 0).toLocaleString()}`, color: "#10B981" },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xl font-black mb-1" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="🚨 Low Stock Alerts">
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {(data.lowStockAlerts || []).slice(0, 6).length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">All products well stocked ✅</p>
            ) : (data.lowStockAlerts || []).slice(0, 6).map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-gray-700">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-red-600">{p.stock} units</p>
                  <p className="text-xs text-gray-400">₹{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Inventory by Category">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={(() => {
                  const items = (data.categoryInventory || []).map(i => ({ ...i, name: i.name || i._id || "Unknown" }));
                  const total = items.reduce((s, i) => s + i.totalValue, 0);
                  const main  = items.filter(i => i.totalValue / total >= 0.03);
                  const rest  = items.filter(i => i.totalValue / total < 0.03).reduce((s, i) => s + i.totalValue, 0);
                  return rest > 0 ? [...main, { name: "Others", totalValue: rest }] : main;
                })()}
                cx="50%" cy="50%" outerRadius={90} dataKey="totalValue"
                labelLine={false}
                label={({ name, percent, cx, cy, midAngle, outerRadius }) => {
                  if (percent < 0.05) return null;
                  const R = Math.PI / 180;
                  const r = outerRadius + 22;
                  const x = cx + r * Math.cos(-midAngle * R);
                  const y = cy + r * Math.sin(-midAngle * R);
                  return <text x={x} y={y} fill="#475569" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={10} fontWeight={700}>{`${name.slice(0,10)} ${(percent*100).toFixed(0)}%`}</text>;
                }}
              >
                {(data.categoryInventory || []).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip formatter={v => [`₹${Math.round(v).toLocaleString()}`, "Value"]} contentStyle={tooltipStyle.contentStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FINANCIAL TAB
══════════════════════════════════════════════ */
function FinancialTab({ data }) {
  const s  = data.summary          || {};
  const g  = data.growthComparison || {};
  const pa = data.profitAnalysis   || {};
  const up = (v) => v >= 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue",   value: `₹${Math.round(s.totalRevenue || 0).toLocaleString()}`,  color: "#FF9900" },
          { label: "Total Orders",    value: s.totalOrders || 0,                                       color: "#3B82F6" },
          { label: "Avg Order Value", value: `₹${Math.round(s.avgOrderValue || 0).toLocaleString()}`, color: "#8B5CF6" },
          { label: "Profit Margin",   value: `${(pa.profitMargin || 0).toFixed(1)}%`,                 color: "#10B981" },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xl font-black mb-1" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Revenue Trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.revenueTrends || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="_id" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue"       stroke="#FF9900" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="avgOrderValue" stroke="#3B82F6" strokeWidth={2}   dot={false} strokeDasharray="4 3" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Payment Methods">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.paymentMethods || []} cx="50%" cy="50%" outerRadius={80} dataKey="revenue"
                label={({ name, percent }) => percent > 0.05 ? `${name} ${(percent*100).toFixed(0)}%` : ""}
                labelLine={false}>
                {(data.paymentMethods || []).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip formatter={v => [`₹${Math.round(v).toLocaleString()}`, "Revenue"]} contentStyle={tooltipStyle.contentStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Growth comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Revenue Growth", value: g.revenueGrowth || 0 },
          { label: "Order Growth",   value: g.orderGrowth   || 0 },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${up(item.value) ? "bg-emerald-50" : "bg-red-50"}`}>
              {up(item.value) ? <ArrowUpRight size={24} className="text-emerald-600" /> : <ArrowDownRight size={24} className="text-red-500" />}
            </div>
            <div>
              <p className={`text-3xl font-black ${up(item.value) ? "text-emerald-600" : "text-red-500"}`}>
                {up(item.value) ? "+" : ""}{item.value}%
              </p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function AdminAnalytics() {
  const [tab, setTab]       = useState("sales");
  const [period, setPeriod] = useState("30");
  const [data, setData]     = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ep = {
      sales:     `/admin/analytics/sales?period=${period}`,
      customers: `/admin/analytics/customers?period=${period}`,
      inventory: "/admin/analytics/inventory",
      financial: `/admin/analytics/financial?period=${period}`,
    }[tab];
    API.get(ep)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tab, period]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Comprehensive business insights and reports</p>
        </div>
        <select value={period} onChange={e => {setLoading(true);setPeriod(e.target.value);}}
          className="text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 shadow-sm">
          {PERIODS.map(p => <option key={p.value} value={p.value}>Last {p.label}</option>)}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => {setLoading(true);setTab(t.id);}}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                active ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}>
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            className="w-9 h-9 border-4 border-gray-100 border-t-amazon-accent rounded-full" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            {tab === "sales"     && <SalesTab     data={data} />}
            {tab === "customers" && <CustomersTab data={data} />}
            {tab === "inventory" && <InventoryTab data={data} />}
            {tab === "financial" && <FinancialTab data={data} />}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
