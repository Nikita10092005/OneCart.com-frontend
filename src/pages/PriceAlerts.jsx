import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, TrendingDown, X } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { imgUrl } from "../utils/imageUrl";

function PriceAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!user) return;
      try {
        const res = await API.get("/price-alerts");
        setAlerts(res.data);
      } catch (error) {
        console.error("Error fetching price alerts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [user]);

  const handleDeleteAlert = async (alertId) => {
    try {
      await API.delete(`/price-alerts/${alertId}`);
      setAlerts(alerts.filter(alert => alert._id !== alertId));
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-amazon-section py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-amazon-text mb-4">Price Alerts</h1>
          <p className="text-amazon-accent">Please sign in to manage your price alerts.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amazon-section py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-10 h-10 border-4 border-amazon-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-amazon-accent">Loading price alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amazon-section py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bell className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amazon-text">Price Alerts</h1>
                <p className="text-amazon-accent text-sm">
                  {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Price Alerts Yet</h3>
              <p className="text-gray-600 mb-4">
                Set price alerts on products you're interested in and we'll notify you when prices drop!
              </p>
              <p className="text-sm text-gray-500">
                Browse products and click "Set Price Alert" to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => {
                const priceDrop = alert.currentPrice - alert.targetPrice;
                const dropPercentage = (priceDrop / alert.currentPrice) * 100;
                const isNotified = alert.isNotified;

                return (
                  <motion.div
                    key={alert._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-amazon-border rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            alert.productId?.image?.startsWith("http")
                              ? alert.productId.image
                              : imgUrl(alert.productId?.image)
                          }
                          alt={alert.productId?.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23DFE6DA'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='10' fill='%23758467'%3ENo Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        
                        <div>
                          <h4 className="font-semibold text-amazon-text mb-1">
                            {alert.productId?.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Current:</span>
                              <span className="font-medium text-gray-900 ml-1">
                                ₹{alert.currentPrice}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Target:</span>
                              <span className="font-medium text-green-600 ml-1">
                                ₹{alert.targetPrice}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Drop needed:</span>
                              <span className="font-medium text-blue-600 ml-1">
                                ₹{priceDrop} ({dropPercentage.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isNotified && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Notified
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteAlert(alert._id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove alert"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default PriceAlerts;
