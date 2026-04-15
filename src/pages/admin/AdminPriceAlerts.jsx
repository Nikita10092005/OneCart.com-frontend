import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, Clock } from "lucide-react";
import API from "../../services/api";
import { imgUrl } from "../../utils/imageUrl";

function AdminPriceAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ pending: 0, notified: 0 });
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    (async () => {
      const [alertsRes, statsRes] = await Promise.all([
        API.get("/admin/price-alerts"),
        API.get("/admin/price-alerts/stats"),
      ]);
      setAlerts(alertsRes.data);
      setStats(statsRes.data);
      setLoading(false);
    })();
  }, []);

  const handleApprove = async (alert) => {
    setApprovingId(alert._id);
    try {
      await API.put(`/admin/price-alerts/${alert._id}/approve`);
      setAlerts((prev) => prev.filter((a) => a._id !== alert._id));
      setStats((prev) => ({ pending: prev.pending - 1, notified: prev.notified + 1 }));
    } catch (err) {
      console.error("Approve failed:", err);
    } finally {
      setApprovingId(null);
    }
  };

  const getImageSrc = (image) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return imgUrl(image);
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="w-10 h-10 border-4 border-amazon-border border-t-amazon-accent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-amazon-section">
        <div>
          <h2 className="text-2xl font-black text-amazon-text">Price Alert Management</h2>
          <p className="text-amazon-accent text-sm mt-0.5">Review and notify users about their price alerts</p>
        </div>

        {/* STAT CARDS */}
        <div className="flex gap-3">
          <div className="bg-amazon-section border border-amazon-border px-5 py-3 rounded-xl text-center">
            <div className="flex items-center gap-1.5 justify-center mb-0.5">
              <Clock size={11} className="text-amazon-text-secondary" />
              <span className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest">Pending</span>
            </div>
            <span className="text-xl font-black text-amazon-accent">{stats.pending}</span>
          </div>
          <div className="bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text px-5 py-3 rounded-xl text-center shadow-md shadow-black/10">
            <div className="flex items-center gap-1.5 justify-center mb-0.5">
              <CheckCircle size={11} className="text-white/80" />
              <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Notified</span>
            </div>
            <span className="text-xl font-black text-white">{stats.notified}</span>
          </div>
        </div>
      </div>

      {/* ALERTS LIST */}
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-amazon-section rounded-2xl flex items-center justify-center mb-4">
            <Bell size={28} className="text-amazon-text-secondary" />
          </div>
          <h3 className="text-lg font-black text-amazon-text mb-1">No pending alerts</h3>
          <p className="text-sm text-amazon-accent">All price alerts have been handled.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {alerts.map((alert, i) => (
              <motion.div
                key={alert._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(117,132,103,0.12)" }}
                className="bg-white border border-amazon-border rounded-2xl p-5 transition-all"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5">
                  {/* PRODUCT IMAGE + NAME */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-xl border border-amazon-section overflow-hidden flex-shrink-0 bg-amazon-section">
                      {alert.productId?.image ? (
                        <img
                          src={getImageSrc(alert.productId.image)}
                          alt={alert.productId.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-0.5">Product</p>
                      <h3 className="font-black text-amazon-text text-sm truncate">{alert.productId?.name || "—"}</h3>
                    </div>
                  </div>

                  {/* USER INFO */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-0.5">User</p>
                    <p className="font-bold text-sm text-amazon-text">{alert.userId?.name || "—"}</p>
                    <p className="text-xs text-amazon-accent truncate">{alert.userId?.email || "—"}</p>
                  </div>

                  {/* PRICES */}
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-0.5">Target</p>
                      <p className="font-black text-amazon-accent text-base">₹{alert.targetPrice?.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-0.5">Current</p>
                      <p className="font-black text-amazon-text text-base">₹{alert.currentPrice?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* APPROVE BUTTON */}
                  <button
                    onClick={() => handleApprove(alert)}
                    disabled={approvingId === alert._id}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amazon-accent hover:bg-amazon-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-amazon-text rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-black/10 flex-shrink-0"
                  >
                    {approvingId === alert._id ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                        className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full"
                      />
                    ) : (
                      <CheckCircle size={13} />
                    )}
                    Approve ✓
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default AdminPriceAlerts;
