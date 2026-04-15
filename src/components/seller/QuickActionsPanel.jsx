import { useState } from "react";
import { motion } from "framer-motion";
import API from "../../services/api";
import { FaBell, FaUmbrellaBeach } from "react-icons/fa";

function Toggle({ enabled, onToggle, label, icon, color }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2">
        <span className={`text-sm ${color}`}>{icon}</span>
        <span className="text-sm font-medium text-white/80">{label}</span>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${enabled ? "bg-amazon-accent" : "bg-white/20"}`}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
          animate={{ x: enabled ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

export default function QuickActionsPanel({ onRestockChange, onVacationChange, vacationActive }) {
  const [restockAlert, setRestockAlert] = useState(false);
  const [vacationLoading, setVacationLoading] = useState(false);

  const handleRestockToggle = () => {
    const next = !restockAlert;
    setRestockAlert(next);
    onRestockChange?.(next);
  };

  const handleVacationToggle = async () => {
    const next = !vacationActive;
    setVacationLoading(true);
    try {
      await API.put("/seller/vacation", { enabled: next });
      onVacationChange?.(next);
    } catch (err) {
      console.error("Vacation mode error:", err);
    } finally {
      setVacationLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Quick Actions</p>
      <Toggle
        enabled={restockAlert}
        onToggle={handleRestockToggle}
        label="Restock Alert"
        icon={<FaBell />}
        color="text-amber-400"
      />
      <Toggle
        enabled={vacationActive}
        onToggle={vacationLoading ? undefined : handleVacationToggle}
        label={vacationLoading ? "Updating..." : "Vacation Mode"}
        icon={<FaUmbrellaBeach />}
        color="text-blue-400"
      />
    </div>
  );
}
