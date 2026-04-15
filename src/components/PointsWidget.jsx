import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Star } from "lucide-react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PointsWidget() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState("bronze");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPoints();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPoints = async () => {
    try {
      const res = await API.get("/rewards");
      setPoints(res.data.points || 0);
      setTier(res.data.tier || "bronze");
    } catch (e) {
      console.error("Failed to fetch points:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) return null;

  const tierConfig = {
    bronze: { icon: "🥉", color: "#CD7F32" },
    silver: { icon: "🥈", color: "#C0C0C0" },
    gold: { icon: "🥇", color: "#FFD700" },
    platinum: { icon: "💎", color: "#E5E4E2" }
  };

  const config = tierConfig[tier] || tierConfig.bronze;

  return (
    <Link to="/rewards">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-amazon-accent rounded-xl p-3 shadow-md cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-white/20 border-2 border-white/30"
            style={{ color: config.color }}
          >
            {config.icon}
          </div>
          <div className="text-amazon-text">
            <p className="text-xs font-medium opacity-90">Your Points</p>
            <p className="text-lg font-bold leading-tight">{points.toLocaleString()}</p>
          </div>
          <div className="ml-auto text-amazon-text/80">
            <Gift size={18} />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-amazon-text/80">
          <Star size={12} className="fill-amazon-text" />
          <span className="capitalize">{tier} Member</span>
        </div>
      </motion.div>
    </Link>
  );
}
