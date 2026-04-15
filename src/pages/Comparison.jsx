import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, X, Trash2, ArrowRight } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { imgUrl } from "../utils/imageUrl";
import { useNavigate } from "react-router-dom";

function Comparison() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparison = async () => {
      if (!user) return;
      try {
        const res = await API.get("/comparison");
        setComparison(res.data);
      } catch (error) {
        console.error("Error fetching comparison:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [user]);

  const handleRemoveProduct = async (productId) => {
    try {
      await API.delete(`/comparison/${productId}`);
      setComparison(prev => ({
        ...prev,
        products: prev.products.filter(p => p.productId._id !== productId)
      }));
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const handleClearComparison = async () => {
    try {
      await API.delete("/comparison");
      setComparison({ products: [] });
    } catch (error) {
      console.error("Error clearing comparison:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-amazon-section py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-amazon-text mb-4">Product Comparison</h1>
          <p className="text-amazon-accent">Please sign in to compare products.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amazon-section py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-10 h-10 border-4 border-amazon-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-amazon-accent">Loading comparison...</p>
        </div>
      </div>
    );
  }

  const products = comparison?.products || [];

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-amazon-section py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md p-8 text-center"
          >
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GitCompare className="text-purple-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-amazon-text mb-3">No Products to Compare</h2>
            <p className="text-amazon-accent mb-6">
              Add products to comparison to see them side by side and make better decisions.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              <ArrowRight size={18} />
              Browse Products
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amazon-section py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <GitCompare className="text-purple-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amazon-text">Product Comparison</h1>
                <p className="text-amazon-accent text-sm">
                  Comparing {products.length} product{products.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {products.length > 0 && (
              <button
                onClick={handleClearComparison}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amazon-border">
                  <th className="text-left py-3 px-4 font-semibold text-amazon-text">Feature</th>
                  {products.map((product) => (
                    <th key={product.productId._id} className="text-left py-3 px-4 min-w-[200px]">
                      <div className="relative">
                        <button
                          onClick={() => handleRemoveProduct(product.productId._id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                        >
                          <X size={12} />
                        </button>
                        <img
                          src={
                            product.productId.image?.startsWith("http")
                              ? product.productId.image
                              : imgUrl(product.productId.image)
                          }
                          alt={product.productId.name}
                          className="w-40 h-32 object-cover rounded-lg mb-2 mx-auto block"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='128' viewBox='0 0 200 128'%3E%3Crect width='200' height='128' fill='%23DFE6DA'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23758467'%3ENo Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <h3 className="font-semibold text-amazon-text text-sm">
                          {product.productId.name}
                        </h3>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-amazon-section">
                  <td className="py-3 px-4 font-medium text-amazon-accent">Price</td>
                  {products.map((product) => (
                    <td key={product.productId._id} className="py-3 px-4">
                      <span className="text-lg font-bold text-amazon-price">
                        ₹{product.productId.price?.toLocaleString()}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-amazon-section">
                  <td className="py-3 px-4 font-medium text-amazon-accent">Category</td>
                  {products.map((product) => (
                    <td key={product.productId._id} className="py-3 px-4">
                      <span className="px-2 py-1 bg-amazon-section text-amazon-accent rounded-full text-sm">
                        {product.productId.category}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-amazon-section">
                  <td className="py-3 px-4 font-medium text-amazon-accent">Description</td>
                  {products.map((product) => (
                    <td key={product.productId._id} className="py-3 px-4 text-sm text-gray-600">
                      {product.productId.description?.slice(0, 100)}...
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-amazon-section">
                  <td className="py-3 px-4 font-medium text-amazon-accent">Features</td>
                  {products.map((product) => (
                    <td key={product.productId._id} className="py-3 px-4">
                      <div className="space-y-1">
                        {product.productId.features?.slice(0, 3).map((feature, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {feature}
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-amazon-accent">Actions</td>
                  {products.map((product) => (
                    <td key={product.productId._id} className="py-3 px-4">
                      <button
                        onClick={() => navigate(`/product/${product.productId._id}`)}
                        className="w-full px-3 py-2 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text rounded-lg text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Add More Products */}
          {products.length < 4 && (
            <div className="mt-6 text-center">
              <p className="text-amazon-accent mb-3">
                You can compare up to 4 products. {4 - products.length} slot{4 - products.length !== 1 ? 's' : ''} available.
              </p>
              <button
                onClick={() => navigate("/home")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <GitCompare size={18} />
                Add More Products
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Comparison;
