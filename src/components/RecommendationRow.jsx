import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const RecommendationRow = ({ productId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!productId) return;

    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/recommendations/${productId}`, { headers });
        if (!res.ok) return;

        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } catch {
        // silently fail — render nothing
      }
    };

    fetchRecommendations();
  }, [productId]);

  if (!recommendations.length) return null;

  return (
    <section className="mt-8 px-4">
      <h2 className="text-lg font-semibold mb-3">You may also like</h2>
      <div className="flex overflow-x-auto gap-4 pb-2">
        {recommendations.map((product) => (
          <div
            key={product._id}
            className="min-w-[160px] cursor-pointer hover:shadow-md transition rounded-lg border p-2"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <img
              src={`${API_URL}/uploads/${product.image}`}
              alt={product.name}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <p className="text-sm font-medium truncate">{product.name}</p>
            <p className="text-sm text-gray-600">₹{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendationRow;
