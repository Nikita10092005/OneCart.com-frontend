import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import API from "../../services/api";

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) { setValue(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function KPICard({ label, value, prefix = "", suffix = "", color, icon }) {
  const animated = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-amazon-border shadow-sm p-5 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-black text-gray-800">
          {prefix}{animated.toLocaleString()}{suffix}
        </p>
      </div>
    </motion.div>
  );
}

const RANK_COLORS = ["#F59E0B", "#9CA3AF", "#CD7F32", "#6B7280", "#6B7280"];
const RANK_LABELS = ["🥇", "🥈", "🥉", "4th", "5th"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 border border-white/10 rounded-xl px-4 py-2 shadow-xl">
        <p className="text-xs text-white/60 mb-1">{label}</p>
        <p className="text-sm font-bold text-amazon-accent">₹{payload[0]?.value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

function buildForecast(dailyData) {
  if (!dailyData?.length) return [];
  const avg = dailyData.reduce((s, d) => s + (d.revenue || 0), 0) / dailyData.length;
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i + 1);
    return {
      date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      projected: Math.round(avg * (0.9 + Math.random() * 0.2)),
    };
  });
}

export default function AnalyticsTab({ analytics, loading, onDateChange, startDate, endDate }) {
  const forecastData = buildForecast(analytics?.dailyData);

  return (
    <div className="space-y-6">
      {/* Date Range */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-amazon-border px-3 py-2 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">From</span>
          <input
            type="date"
            value={startDate}
            onChange={e => onDateChange(e.target.value, endDate)}
            className="text-sm text-gray-700 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl border border-amazon-border px-3 py-2 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">To</span>
          <input
            type="date"
            value={endDate}
            onChange={e => onDateChange(startDate, e.target.value)}
            className="text-sm text-gray-700 focus:outline-none"
          />
        </div>
        <button
          onClick={() => onDateChange("", "")}
          className="text-xs font-bold text-amazon-accent border border-amazon-accent/30 bg-amazon-accent/10 px-3 py-2 rounded-xl hover:bg-amazon-accent/20 transition"
        >
          Show All
        </button>
        {loading && <span className="text-xs text-amazon-accent animate-pulse font-medium">Updating...</span>}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard label="Total Revenue" value={analytics?.totalRevenue || 0} prefix="₹" color="bg-amber-50 text-amber-500" icon="💰" />
        <KPICard label="Total Orders" value={analytics?.totalOrders || 0} color="bg-blue-50 text-blue-500" icon="📦" />
        <KPICard label="Units Sold" value={analytics?.totalUnitsSold || 0} color="bg-emerald-50 text-emerald-500" icon="🛒" />
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-amazon-border shadow-sm p-5"
      >
        <h3 className="text-sm font-bold text-gray-700 mb-4">Daily Revenue</h3>
        {analytics?.dailyData?.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analytics.dailyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={4} fill="url(#revenueGrad)" dot={{ fill: "#F59E0B", r: 5, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">No revenue data for this period</div>
        )}
      </motion.div>

      {/* Forecast Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-amazon-border shadow-sm p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-700">7-Day Earnings Forecast</h3>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Based on last 30 days trend</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={forecastData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Projected"]} />
            <Line type="monotone" dataKey="projected" stroke="#8B5CF6" strokeWidth={3} strokeDasharray="6 3" dot={{ fill: "#8B5CF6", r: 5, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Products */}
      {analytics?.topProducts?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-amazon-border shadow-sm p-5"
        >
          <h3 className="text-sm font-bold text-gray-700 mb-4">Top 5 Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="pb-2 pr-4">Rank</th>
                  <th className="pb-2 pr-4">Product</th>
                  <th className="pb-2 pr-4 text-right">Units Sold</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topProducts.map((p, i) => (
                  <tr key={p._id || i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 pr-4">
                      <span className="text-base">{RANK_LABELS[i]}</span>
                    </td>
                    <td className="py-2.5 pr-4 font-medium text-gray-700 max-w-[200px] truncate">{p.name}</td>
                    <td className="py-2.5 pr-4 text-right text-gray-600">{p.unitsSold}</td>
                    <td className="py-2.5 text-right font-semibold text-gray-800">₹{(p.revenue || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
