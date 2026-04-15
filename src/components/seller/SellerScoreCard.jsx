import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function computeScore(sellerRating, responseBadge, totalOrders) {
  const ratingScore = sellerRating ? (sellerRating / 5) * 40 : 0;
  const badgeScore = { Fast: 40, Standard: 25, Slow: 10, New: 15 }[responseBadge] ?? 15;
  const salesScore = Math.min(totalOrders || 0, 20);
  return Math.round(ratingScore + badgeScore + salesScore);
}

function getTier(score) {
  if (score <= 40) return { label: "Rising Star", color: "#3B82F6", bg: "bg-blue-500/10", text: "text-blue-400" };
  if (score <= 70) return { label: "Trusted Seller", color: "#F59E0B", bg: "bg-amber-500/10", text: "text-amber-400" };
  return { label: "Top Performer", color: "#10B981", bg: "bg-emerald-500/10", text: "text-emerald-400" };
}

export default function SellerScoreCard({ sellerRating, responseBadge, totalOrders }) {
  const score = computeScore(sellerRating, responseBadge, totalOrders);
  const tier = getTier(score);
  const [animatedScore, setAnimatedScore] = useState(0);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          {/* Track */}
          <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          {/* Progress */}
          <motion.circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke={tier.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-black text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-white/50 font-medium">/ 100</span>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`px-3 py-1 rounded-full text-xs font-bold ${tier.bg} ${tier.text} border border-current/20`}
      >
        {tier.label}
      </motion.div>
      <div className="text-center space-y-0.5">
        <p className="text-xs text-white/40">Seller Score</p>
        {responseBadge && (
          <p className="text-xs text-white/60">
            Response: <span className="text-amazon-accent font-semibold">{responseBadge}</span>
          </p>
        )}
      </div>
    </div>
  );
}
