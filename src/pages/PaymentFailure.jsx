import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PaymentFailure() {
  const location = useLocation();
  const navigate = useNavigate();
  const { error, amount, orderId } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full text-center">

        {/* ERROR ANIMATION */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative inline-flex items-center justify-center mb-8">
          <div className="w-28 h-28 rounded-full bg-red-200/30 border-2 border-red-300/50 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-red-200/40 border-2 border-red-400/60 flex items-center justify-center">
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="w-10 h-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </motion.svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}>
          <h1 className="text-3xl font-extrabold text-red-600 mb-2">
            Payment Failed ❌
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            {error || "Your payment could not be processed. Please try again."}
          </p>
        </motion.div>

        {/* ERROR DETAILS CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-red-200 rounded-2xl p-6 mb-6 text-left space-y-4 shadow-sm">
          
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <span className="text-xl mt-1">⚠️</span>
            <div>
              <p className="font-semibold text-red-900 text-sm mb-1">
                Transaction Not Completed
              </p>
              <p className="text-xs text-red-700">
                Your payment method declined the transaction. This could be due to:
              </p>
              <ul className="text-xs text-red-600 mt-2 space-y-1 list-disc list-inside">
                <li>Insufficient funds</li>
                <li>Card declined by bank</li>
                <li>Expired card or wrong details</li>
                <li>Network connectivity issue</li>
              </ul>
            </div>
          </div>

          {amount && (
            <div className="border-t border-red-200 pt-4 flex justify-between items-center">
              <span className="font-semibold text-gray-700">Attempted Amount</span>
              <span className="text-xl font-extrabold text-red-600">
                ₹{Number(amount).toLocaleString()}
              </span>
            </div>
          )}
        </motion.div>

        {/* SUGGESTED ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6 shadow-sm">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-4">
            💡 What You Can Do
          </p>
          <ul className="text-xs text-blue-700 space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="text-sm mt-0.5">→</span>
              <span>Try a different payment method</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sm mt-0.5">→</span>
              <span>Check your card details and try again</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sm mt-0.5">→</span>
              <span>Use Cash on Delivery option if available</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sm mt-0.5">→</span>
              <span>Contact your bank for transaction blocking</span>
            </li>
          </ul>
        </motion.div>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-3">
          <motion.button
            onClick={() => navigate("/CheckoutNew")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-red-600/20">
            🔄 Retry Payment
          </motion.button>

          <motion.button
            onClick={() => navigate("/cart")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 bg-white border-2 border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition text-sm">
            🛒 Back to Cart
          </motion.button>

          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:border-gray-400 transition text-sm">
            🏠 Go to Home
          </motion.button>
        </motion.div>

        <p className="text-xs text-gray-500 mt-5">
          Need help? <span className="text-red-600 font-semibold cursor-pointer hover:underline">Contact Support</span>
        </p>
      </div>
    </div>
  );
}
