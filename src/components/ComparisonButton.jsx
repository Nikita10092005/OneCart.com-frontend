import { useState } from "react";
import { GitCompare, Plus, X } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const ComparisonButton = ({ productId, productName, productImage, productPrice }) => {
  const { user } = useAuth();
  const [inComparison, setInComparison] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToComparison = async () => {
    if (!user) {
      alert("Please sign in to compare products");
      return;
    }

    setLoading(true);
    try {
      await API.post("/comparison", { productId });
      setInComparison(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error("Error adding to comparison:", error);
        alert("Failed to add product to comparison");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleAddToComparison}
        disabled={loading || inComparison}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          inComparison
            ? "bg-green-100 text-green-700 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        } ${loading ? "opacity-50" : ""}`}
      >
        {inComparison ? (
          <>
            <GitCompare size={16} />
            In Comparison
          </>
        ) : (
          <>
            <Plus size={16} />
            Compare
          </>
        )}
      </button>

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <GitCompare size={20} />
          <div>
            <p className="font-medium">Added to Comparison!</p>
            <p className="text-sm opacity-90">{productName}</p>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-2 hover:opacity-75"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
};

export default ComparisonButton;
