import { Check, Package, Truck, Home, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

const STAGES = [
  { name: "Ordered", icon: ClipboardList, color: "blue" },
  { name: "Packed", icon: Package, color: "indigo" },
  { name: "Shipped", icon: Truck, color: "orange" },
  { name: "Delivered", icon: Home, color: "green" },
];

const OrderProgressBar = ({ trackingStages = [], currentStage }) => {
  const currentIndex = STAGES.findIndex(s => s.name === currentStage);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  // Build a map of stage -> timestamp from trackingStages
  const stageTimestamps = {};
  trackingStages.forEach(({ stage, timestamp }) => {
    stageTimestamps[stage] = timestamp;
  });

  const formatTimestamp = (ts) => {
    if (!ts) return null;
    const date = new Date(ts);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="w-full py-8 px-2">
      {/* Current Status Header */}
      <div className="text-center mb-8">
        <motion.div
          key={currentStage}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-3 px-6 py-3 bg-amazon-accent text-amazon-text rounded-full shadow-lg"
        >
          {currentIndex >= 0 && (
            <>
              {(() => {
                const Icon = STAGES[safeIndex].icon;
                return <Icon size={24} />;
              })()}
              <span className="text-lg font-bold">
                Order {currentStage}
              </span>
            </>
          )}
        </motion.div>
        <p className="text-amazon-text text-sm mt-3">
          {currentStage === "Ordered" && "Your order has been confirmed"}
          {currentStage === "Packed" && "Your items are being prepared"}
          {currentStage === "Shipped" && "Your order is on the way!"}
          {currentStage === "Delivered" && "Your order has been delivered"}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative px-6">
        {/* Background Line - positioned between circles */}
        <div className="absolute top-6 left-6 right-6 h-2 bg-gray-200 rounded-full" />
        
        {/* Active Progress Line */}
        <motion.div
          className="absolute top-6 left-6 h-2 bg-amazon-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: safeIndex === 0 ? '0%' : `calc(${(safeIndex / (STAGES.length - 1)) * 100}% - 24px)` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Stage Circles */}
        <div className="flex justify-between relative z-10">
          {STAGES.map((stage, index) => {
            const isCompleted = index < safeIndex;
            const isCurrent = index === safeIndex;
            const isPending = index > safeIndex;
            const timestamp = stageTimestamps[stage.name];
            const Icon = stage.icon;

            return (
              <div key={stage.name} className="flex flex-col items-center">
                {/* Circle */}
                <motion.div
                  initial={false}
                  animate={isCurrent ? {
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(117, 132, 103, 0.4)",
                      "0 0 0 10px rgba(117, 132, 103, 0)",
                      "0 0 0 0 rgba(117, 132, 103, 0.4)"
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: isCurrent ? Infinity : 0 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-md transition-all duration-300 ${
                    isCompleted
                      ? "bg-amazon-accent border-amazon-accent text-amazon-text"
                      : isCurrent
                      ? "bg-amazon-accent border-amazon-accent text-amazon-text ring-4 ring-amazon-accent/30 animate-pulse"
                      : "bg-white border-gray-300 text-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={22} strokeWidth={3} />
                  ) : (
                    <Icon size={20} strokeWidth={isCurrent ? 2.5 : 2} />
                  )}
                </motion.div>

                {/* Label */}
                <span
                  className={`mt-3 text-sm font-bold text-center ${
                    isCompleted || isCurrent
                      ? "text-amazon-text"
                      : "text-gray-400"
                  }`}
                >
                  {stage.name}
                </span>

                {/* Status Badge - Current Stage */}
                {isCurrent && (
                  <span className="mt-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">
                    ✓ Active
                  </span>
                )}
                {isCompleted && (
                  <span className="mt-1 text-xs text-amazon-text-secondary">
                    ✓ Done
                  </span>
                )}

                {/* Timestamp */}
                {timestamp && (
                  <span className="mt-2 text-xs text-gray-500 text-center leading-tight max-w-[80px]">
                    {formatTimestamp(timestamp)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      {trackingStages.length > 0 && (
        <div className="mt-8 bg-amazon-section rounded-xl p-4">
          <h4 className="text-sm font-bold text-amazon-text mb-3">📋 Activity Timeline</h4>
          <div className="space-y-3">
            {trackingStages.slice().reverse().map((stage, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amazon-accent mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amazon-text">
                    Order {stage.stage}
                  </p>
                  <p className="text-xs text-amazon-accent">
                    {formatTimestamp(stage.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderProgressBar;
