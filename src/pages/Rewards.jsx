import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const tierConfig = {
  bronze: { color: "#CD7F32", icon: "🥉", name: "Bronze" },
  silver: { color: "#C0C0C0", icon: "🥈", name: "Silver" },
  gold: { color: "#FFD700", icon: "🥇", name: "Gold" },
  platinum: { color: "#E5E4E2", icon: "💎", name: "Platinum" }
};

export default function Rewards() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rewards, setRewards] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchRewards();
  }, [user, navigate]);

  const fetchRewards = async () => {
    try {
      const [rewardsRes, historyRes] = await Promise.all([
        API.get("/rewards"),
        API.get("/rewards/history")
      ]);
      setRewards(rewardsRes.data);
      setHistory(historyRes.data);
    } catch (e) {
      console.error("Failed to fetch rewards:", e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amazon-section flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="w-10 h-10 border-4 border-amazon-text-secondary border-t-amazon-accent rounded-full"
        />
      </div>
    );
  }

  const tier = rewards?.tier || "bronze";
  const tierInfo = tierConfig[tier];
  const progressPercent = rewards?.nextTier 
    ? Math.min(100, ((rewards.totalPointsEarned - rewards.tierThresholds[tier]) / (rewards.pointsToNextTier + rewards.totalPointsEarned - rewards.tierThresholds[tier])) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-amazon-section py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-extrabold text-amazon-text">🏆 Rewards Program</h1>
          <p className="text-amazon-accent mt-2">Earn points with every purchase and unlock exclusive benefits</p>
        </motion.div>

        {/* POINTS CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-amazon-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amazon-accent font-medium">Available Points</p>
              <p className="text-5xl font-extrabold text-amazon-accent">{rewards?.points?.toLocaleString() || 0}</p>
            </div>
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
              style={{ backgroundColor: `${tierInfo.color}30`, border: `3px solid ${tierInfo.color}` }}
            >
              {tierInfo.icon}
            </div>
          </div>

          {/* TIER PROGRESS */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold" style={{ color: tierInfo.color }}>
                {tierInfo.icon} {tierInfo.name} Member
              </span>
              {rewards?.nextTier && (
                <span className="text-xs text-amazon-accent">
                  {rewards.pointsToNextTier.toLocaleString()} points to {tierConfig[rewards.nextTier].name}
                </span>
              )}
            </div>
            <div className="h-3 bg-amazon-section rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-full rounded-full"
                style={{ backgroundColor: tierInfo.color }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-amazon-accent">
              <span>{rewards?.tierThresholds?.[tier]?.toLocaleString() || 0}</span>
              <span>{rewards?.nextTier ? rewards?.tierThresholds?.[rewards.nextTier]?.toLocaleString() : "MAX"}</span>
            </div>
          </div>
        </motion.div>

        {/* TIER BENEFITS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {Object.entries(tierConfig).map(([key, info]) => (
            <div
              key={key}
              className={`p-4 rounded-xl border text-center transition-all ${
                tier === key 
                  ? "bg-white border-amazon-border shadow-md" 
                  : "bg-white/50 border-amazon-border"
              }`}
            >
              <div className="text-2xl mb-1">{info.icon}</div>
              <p className={`text-sm font-bold ${tier !== key ? "text-amazon-accent" : ""}`}
                 style={{ color: tier === key ? info.color : undefined }}>
                {info.name}
              </p>
              <p className="text-xs text-amazon-accent mt-1">
                {key === "bronze" && "Join to get"}
                {key === "silver" && "500+ points"}
                {key === "gold" && "2,000+ points"}
                {key === "platinum" && "5,000+ points"}
              </p>
            </div>
          ))}
        </motion.div>

        {/* EARN POINTS INFO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-amazon-border rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-amazon-text mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-amazon-text-secondary to-amazon-accent inline-block" />
            How to Earn Points
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-amazon-section rounded-xl">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="text-sm font-bold text-amazon-text">Welcome Bonus</p>
                <p className="text-xs text-amazon-accent">+100 points on signup</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amazon-section rounded-xl">
              <span className="text-2xl">🛍️</span>
              <div>
                <p className="text-sm font-bold text-amazon-text">Shopping</p>
                <p className="text-xs text-amazon-accent">+1 point per ₹10 spent</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amazon-section rounded-xl">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-sm font-bold text-amazon-text">Reviews</p>
                <p className="text-xs text-amazon-accent">+50 points per review</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SHOP WITH POINTS CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gradient-to-r from-amazon-accent via-orange-400 to-amber-400 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl flex-shrink-0">
              🛍️
            </div>
            <div>
              <p className="text-amazon-text font-extrabold text-lg leading-tight">Use Your Points to Shop!</p>
              <p className="text-amazon-text/80 text-sm mt-0.5">
                You have <span className="font-black">{rewards?.points?.toLocaleString() || 0} points</span> — worth
                <span className="font-black"> ₹{((rewards?.points || 0) / 10).toLocaleString()}</span> off your next order
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/home")}
            className="flex-shrink-0 bg-amazon-text text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md hover:bg-amazon-subheader transition-all w-full sm:w-auto text-center">
            Shop Now →
          </motion.button>
        </motion.div>

        {/* POINT HISTORY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-amazon-border rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-amazon-text mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-amazon-text-secondary to-amazon-accent inline-block" />
            Points History
          </h2>
          {history.length === 0 ? (
            <p className="text-center text-amazon-accent py-8">No points activity yet. Start shopping to earn!</p>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-amazon-section rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      item.type === "earned" ? "bg-emerald-100" : "bg-red-100"
                    }`}>
                      {item.type === "earned" ? "🎁" : "🔄"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amazon-text">{item.description}</p>
                      <p className="text-xs text-amazon-accent">
                        {new Date(item.createdAt).toLocaleDateString()} • {item.action}
                      </p>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${
                    item.type === "earned" ? "text-emerald-600" : "text-red-500"
                  }`}>
                    {item.type === "earned" ? "+" : "-"}{item.points}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
