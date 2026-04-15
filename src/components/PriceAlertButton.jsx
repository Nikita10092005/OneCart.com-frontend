import { useState, useEffect } from "react";
import { Bell, BellOff, TrendingDown } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const PriceAlertButton = ({ productId, currentPrice, productName }) => {
  const { user } = useAuth();
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [alertId, setAlertId] = useState(null);
  const [targetPrice, setTargetPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    API.get("/price-alerts").then((res) => {
      const existing = res.data.find((a) => a.productId?._id === productId || a.productId === productId);
      if (existing) {
        setIsAlertActive(true);
        setAlertId(existing._id);
      }
    }).catch(() => {});
  }, [user, productId]);

  const handleCreateAlert = async () => {
    if (!targetPrice || parseFloat(targetPrice) >= currentPrice) {
      alert("Target price must be lower than current price");
      return;
    }

    setLoading(true);
    try {
      await API.post("/price-alerts", {
        productId,
        targetPrice: parseFloat(targetPrice)
      });

      setIsAlertActive(true);
      setShowModal(false);
      setTargetPrice("");
      
      // Refresh to get the new alertId
      API.get("/price-alerts").then((res) => {
        const existing = res.data.find((a) => a.productId?._id === productId || a.productId === productId);
        if (existing) setAlertId(existing._id);
      }).catch(() => {});
      
      // Show success message
      alert(`Price alert set! We'll notify you when ${productName} drops to ₹${targetPrice}`);
    } catch (error) {
      console.error("Error creating price alert:", error);
      alert("Failed to create price alert. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAlert = async () => {
    if (!alertId) return;
    setLoading(true);
    try {
      await API.delete(`/price-alerts/${alertId}`);
      setIsAlertActive(false);
      setAlertId(null);
      alert("Price alert removed");
    } catch (error) {
      console.error("Error removing price alert:", error);
      alert("Failed to remove price alert");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <button 
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium"
        disabled
      >
        <Bell size={16} />
        Sign in for price alerts
      </button>
    );
  }

  return (
    <>
      {isAlertActive ? (
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
            <Bell size={14} />
            Alert Active
          </span>
          <button
            onClick={handleRemoveAlert}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            title="Remove price alert"
          >
            <BellOff size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <TrendingDown size={16} />
          Set Price Alert
        </button>
      )}

      {/* Price Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Set Price Alert for {productName}
            </h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Current Price:</span>
                <span className="text-lg font-bold text-gray-900">₹{currentPrice}</span>
              </div>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Price (₹)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Enter your target price"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max={currentPrice - 1}
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll notify you when the price drops to this amount or lower
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAlert}
                disabled={loading || !targetPrice}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Setting..." : "Set Alert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PriceAlertButton;
