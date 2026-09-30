import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const addBusinessDays = (date, days) => {
  const d = new Date(date);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) added++;
  }
  return d;
};

const getDeliveryRange = () => {
  const fmt = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return `${fmt(addBusinessDays(new Date(), 5))} – ${fmt(addBusinessDays(new Date(), 7))}`;
};

const STEPS = [
  { label: "Order Placed",       icon: "🛒", done: true  },
  { label: "Payment Confirmed",  icon: "✅", done: true  },
  { label: "Processing",         icon: "📦", done: false },
  { label: "Shipped",            icon: "🚚", done: false },
  { label: "Delivered",          icon: "🏠", done: false },
];

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [count, setCount] = useState(8);
  const [copied, setCopied] = useState(null);
  const { paymentId, orderId, amount } = location.state || {};

  useEffect(() => {
    const t = setInterval(() => {
      setCount(c => {
        if (c <= 1) { clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (count === 0) navigate("/orders");
  }, [count, navigate]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-amazon-section py-10 px-4">
      <div className="max-w-lg mx-auto">

        {/* SUCCESS HERO */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-amazon-border shadow-xl overflow-hidden mb-5">

          {/* GREEN TOP BAND */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 pt-8 pb-16 text-center relative">
            {/* CONFETTI DOTS */}
            {[...Array(12)].map((_, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{ opacity: [0, 1, 0], y: -40 - (i * 17 % 40), x: (i * 23 % 80) - 40 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 1.2 }}
                className="absolute top-8 left-1/2 w-2 h-2 rounded-full"
                style={{ backgroundColor: ["#fff", "#fde68a", "#a7f3d0", "#bfdbfe"][i % 4] }}
              />
            ))}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <motion.svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.7 }} />
              </motion.svg>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-2xl font-extrabold text-white mb-1">Order Placed!</motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-emerald-100 text-sm">Your order has been placed and confirmed</motion.p>
          </div>

          {/* AMOUNT PILL — overlaps the band */}
          <div className="flex justify-center -mt-7 mb-6 relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.55 }}
              className="bg-white border-2 border-emerald-400 rounded-2xl px-8 py-3 shadow-lg text-center">
              <p className="text-xs text-amazon-accent font-semibold uppercase tracking-widest mb-0.5">Amount Paid</p>
              <p className="text-3xl font-extrabold text-amazon-text">₹{Number(amount || 0).toLocaleString()}</p>
            </motion.div>
          </div>

          {/* TRANSACTION DETAILS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
            className="px-6 pb-6 space-y-3">

            {orderId && (
              <div className="flex items-center justify-between bg-amazon-section rounded-xl px-4 py-3">
                <div>
                  <p className="text-xs text-amazon-accent font-bold uppercase tracking-widest">Order ID</p>
                  <p className="text-sm font-mono font-bold text-amazon-text mt-0.5">#{orderId.slice(-10).toUpperCase()}</p>
                </div>
                <button onClick={() => copyToClipboard(orderId, "order")}
                  className="text-xs text-amazon-accent hover:text-amazon-text transition flex items-center gap-1 bg-white border border-amazon-border px-2.5 py-1.5 rounded-lg">
                  {copied === "order" ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
            )}

            {paymentId && (
              <div className="flex items-center justify-between bg-amazon-section rounded-xl px-4 py-3">
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-xs text-amazon-accent font-bold uppercase tracking-widest">Payment ID</p>
                  <p className="text-sm font-mono font-bold text-amazon-text mt-0.5 truncate">{paymentId}</p>
                </div>
                <button onClick={() => copyToClipboard(paymentId, "payment")}
                  className="text-xs text-amazon-accent hover:text-amazon-text transition flex items-center gap-1 bg-white border border-amazon-border px-2.5 py-1.5 rounded-lg flex-shrink-0">
                  {copied === "payment" ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between bg-amazon-section rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-amazon-accent font-bold uppercase tracking-widest">Est. Delivery</p>
                <p className="text-sm font-bold text-amazon-text mt-0.5">{getDeliveryRange()}</p>
              </div>
              <span className="text-2xl">📅</span>
            </div>

            <div className="flex items-center justify-between bg-amazon-section rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-amazon-accent font-bold uppercase tracking-widest">Payment Method</p>
                <p className="text-sm font-bold text-amazon-text mt-0.5">Razorpay</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full">PAID</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ORDER TIMELINE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="bg-white rounded-2xl border border-amazon-border shadow-sm p-5 mb-5">
          <p className="text-xs font-bold text-amazon-accent uppercase tracking-widest mb-5">Order Timeline</p>
          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex gap-4">
                {/* ICON + LINE */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 border-2
                      ${step.done
                        ? "bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-200"
                        : "bg-white border-amazon-border"}`}>
                    {step.done
                      ? <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      : <span className="text-amazon-text-secondary text-xs font-bold">{i + 1}</span>
                    }
                  </motion.div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 ${step.done ? "bg-emerald-400" : "bg-amazon-border"}`} />
                  )}
                </div>
                {/* LABEL */}
                <div className="pb-6 pt-1.5">
                  <p className={`text-sm font-bold ${step.done ? "text-amazon-text" : "text-amazon-text-secondary"}`}>
                    {step.icon} {step.label}
                  </p>
                  {step.done && (
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">
                      {i === 0 ? "Just now" : "Confirmed"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="grid grid-cols-2 gap-3 mb-4">
          <motion.button
            onClick={() => navigate("/orders")}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(109,129,150,0.35)" }}
            whileTap={{ scale: 0.97 }}
            className="py-3.5 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold rounded-xl text-sm shadow-lg">
            📦 Track Order
          </motion.button>
          <motion.button
            onClick={() => navigate("/home")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="py-3.5 bg-white border-2 border-amazon-border text-amazon-text font-bold rounded-xl text-sm hover:border-amazon-accent transition">
            🛍️ Shop More
          </motion.button>
        </motion.div>

        {/* REDIRECT COUNTDOWN */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-amazon-border rounded-full px-4 py-2 shadow-sm">
            <div className="w-4 h-4 rounded-full border-2 border-amazon-accent border-t-transparent animate-spin" />
            <p className="text-xs text-amazon-accent font-medium">
              Redirecting to orders in <span className="font-extrabold text-amazon-text">{count}s</span>
            </p>
          </div>
        </motion.div>

        {/* SECURED BADGE */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="text-center text-xs text-amazon-text-secondary mt-4">
          🔒 Payment secured by Razorpay · 256-bit SSL encryption
        </motion.p>

      </div>
    </div>
  );
}
