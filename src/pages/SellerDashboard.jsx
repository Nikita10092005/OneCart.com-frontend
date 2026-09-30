import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

import SellerScoreCard from "../components/seller/SellerScoreCard";
import QuickActionsPanel from "../components/seller/QuickActionsPanel";
import AnalyticsTab from "../components/seller/AnalyticsTab";
import PayoutsTab from "../components/seller/PayoutsTab";
import InventoryTab from "../components/seller/InventoryTab";
import BulkUploadTab from "../components/seller/BulkUploadTab";

import {
  FaChartLine, FaWallet, FaBoxes, FaUpload,
  FaUmbrellaBeach, FaStore
} from "react-icons/fa";
import { TrendingUp, ShoppingBag, Package, DollarSign, ArrowUpRight } from "lucide-react";

const TABS = [
  { id: "analytics", label: "Analytics",   icon: FaChartLine },
  { id: "payouts",   label: "Payouts",     icon: FaWallet },
  { id: "inventory", label: "Inventory",   icon: FaBoxes },
  { id: "bulk",      label: "Bulk Upload", icon: FaUpload },
];

function getDefaultDates() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 90);
  return {
    start: start.toISOString().split("T")[0],
    end:   end.toISOString().split("T")[0],
  };
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab]           = useState("analytics");
  const [analytics, setAnalytics]           = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [sellerProfile, setSellerProfile]   = useState(null);
  const [restockAlertActive, setRestockAlertActive] = useState(false);
  const [vacationActive, setVacationActive] = useState(false);
  const dates = getDefaultDates();
  const [startDate, setStartDate] = useState(dates.start);
  const [endDate,   setEndDate]   = useState(dates.end);

  const fetchAnalytics = (start, end) => {
    const params = start && end ? `?startDate=${start}&endDate=${end}` : "";
    API.get(`/seller/analytics${params}`)
      .then(r => setAnalytics(r.data))
      .catch(console.error)
      .finally(() => setAnalyticsLoading(false));
  };

  useEffect(() => {
    fetchAnalytics("", "");
    if (user?._id) {
      API.get(`/seller/profile/${user._id}`)
        .then(r => setSellerProfile(r.data))
        .catch(console.error);
    }
  }, [user?._id]);

  const handleDateChange = (start, end) => {
    setAnalyticsLoading(true);
    setStartDate(start);
    setEndDate(end);
    fetchAnalytics(start, end);
  };

  const kpis = [
    { label: "Total Revenue",  value: `₹${(analytics?.totalRevenue || 0).toLocaleString()}`,  icon: DollarSign,  color: "#FF9900",  bg: "bg-orange-50" },
    { label: "Total Orders",   value: analytics?.totalOrders   || 0,                           icon: ShoppingBag, color: "#3B82F6",  bg: "bg-blue-50" },
    { label: "Units Sold",     value: analytics?.totalUnitsSold || 0,                          icon: Package,     color: "#8B5CF6",  bg: "bg-purple-50" },
    { label: "Avg Order Value",value: `₹${Math.round(analytics?.totalOrders ? (analytics?.totalRevenue || 0) / analytics.totalOrders : 0).toLocaleString()}`, icon: TrendingUp, color: "#10B981", bg: "bg-emerald-50" },
  ];

  return (
    <>
      {/* Vacation Banner */}
      <AnimatePresence>
        {vacationActive && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="bg-blue-600 text-white text-xs font-bold text-center py-2 flex items-center justify-center gap-2">
            <FaUmbrellaBeach /> Vacation Mode is active — your store is paused
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#F4F5F7]">

        {/* ── HEADER ── */}
        <div className="bg-[#0F1923] border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">

              {/* Greeting */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amazon-accent flex items-center justify-center shadow-sm">
                    <FaStore className="text-white text-sm" />
                  </div>
                  <span className="text-[10px] font-black text-amazon-accent uppercase tracking-widest">Seller Hub</span>
                </div>
                <h1 className="text-2xl font-black text-white mb-0.5">
                  Welcome back, {user?.name?.split(" ")[0] || "Seller"} 👋
                </h1>
                <p className="text-white/40 text-sm">Here's your store performance at a glance</p>
              </div>

              {/* Score Card */}
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, type: "spring" }}
                className="flex-shrink-0">
                <SellerScoreCard
                  sellerRating={sellerProfile?.sellerRating}
                  responseBadge={sellerProfile?.responseBadge || user?.responseBadge}
                  totalOrders={analytics?.totalOrders}
                />
              </motion.div>

              {/* Quick Actions */}
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="w-full lg:w-52 flex-shrink-0">
                <QuickActionsPanel
                  onRestockChange={setRestockAlertActive}
                  onVacationChange={setVacationActive}
                  vacationActive={vacationActive}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── KPI STRIP ── */}
        <div className="max-w-6xl mx-auto px-6 -mt-0 pt-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k, i) => {
              const Icon = k.icon;
              return (
                <motion.div key={k.label}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${k.bg}`}>
                    <Icon size={18} style={{ color: k.color }} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-800 leading-none mb-0.5">{analyticsLoading ? "—" : k.value}</p>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{k.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div className="max-w-6xl mx-auto px-6 mt-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            {/* Tabs */}
            <div className="flex gap-1 p-1.5 border-b border-gray-100">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all
                      ${active ? "bg-amazon-accent text-white shadow-sm" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}>
                    <Icon size={13} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}>
                  {activeTab === "analytics" && (
                    <AnalyticsTab
                      analytics={analytics}
                      loading={analyticsLoading}
                      onDateChange={handleDateChange}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  )}
                  {activeTab === "payouts"   && <PayoutsTab />}
                  {activeTab === "inventory" && <InventoryTab restockAlertActive={restockAlertActive} />}
                  {activeTab === "bulk"      && <BulkUploadTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="h-10" />
      </div>
    </>
  );
}
