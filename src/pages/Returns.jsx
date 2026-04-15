import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  RotateCcw, CheckCircle, Clock, ShieldCheck, Package,
  Truck, CreditCard, AlertCircle, ChevronDown, ArrowRight,
  Phone, Mail, MessageSquare, Star, XCircle, RefreshCw
} from "lucide-react";

const RETURN_STEPS = [
  {
    step: "01",
    icon: Package,
    title: "Initiate Return",
    desc: "Go to My Orders, select the item and click 'Request Refund' within 7 days of delivery.",
    color: "bg-amazon-accent/10 text-amazon-accent border-amazon-accent/20",
  },
  {
    step: "02",
    icon: Truck,
    title: "Ship the Item",
    desc: "Pack the item securely in original packaging. Our team will arrange a pickup or provide a drop-off address.",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    step: "03",
    icon: ShieldCheck,
    title: "Quality Check",
    desc: "Once received, our team inspects the item within 2 business days to verify its condition.",
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    step: "04",
    icon: CreditCard,
    title: "Refund Processed",
    desc: "Approved refunds are credited to your original payment method within 5–7 business days.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
];

const ELIGIBLE = [
  { icon: "✅", text: "Item received in damaged condition" },
  { icon: "✅", text: "Wrong item delivered" },
  { icon: "✅", text: "Item not as described on the listing" },
  { icon: "✅", text: "Missing parts or accessories" },
  { icon: "✅", text: "Defective or non-functional product" },
  { icon: "✅", text: "Delivered after the promised date" },
];

const NOT_ELIGIBLE = [
  { icon: "❌", text: "Items returned after 7 days of delivery" },
  { icon: "❌", text: "Used, washed, or altered items" },
  { icon: "❌", text: "Items without original tags or packaging" },
  { icon: "❌", text: "Perishable goods and consumables" },
  { icon: "❌", text: "Digital products and gift cards" },
  { icon: "❌", text: "Customised or personalised items" },
];

const FAQS = [
  {
    q: "How long does the return process take?",
    a: "Once you initiate a return, pickup is arranged within 2–3 business days. After we receive the item, quality check takes 1–2 days, and refund is processed within 5–7 business days.",
  },
  {
    q: "Can I exchange an item instead of returning it?",
    a: "Yes! You can request an exchange for the same product in a different size or colour. Go to My Orders, select the item, and choose 'Exchange' instead of 'Return'.",
  },
  {
    q: "What if my refund is not credited after 7 days?",
    a: "If your refund hasn't appeared after 7 business days, please contact our support team with your Order ID and we'll resolve it within 24 hours.",
  },
  {
    q: "Do I need to pay for return shipping?",
    a: "No. For eligible returns, OneCart arranges free pickup from your delivery address. You don't need to pay anything.",
  },
  {
    q: "Can I return part of my order?",
    a: "Yes, you can return individual items from a multi-item order. Each item is evaluated separately.",
  },
  {
    q: "What happens if my return is rejected?",
    a: "If the item doesn't pass quality check (e.g., it's been used or damaged by the customer), we'll send it back to you and notify you via email with the reason.",
  },
];

const REFUND_METHODS = [
  { method: "Razorpay / UPI / Net Banking", time: "5–7 business days", icon: "💳" },
  { method: "Credit / Debit Card",          time: "5–7 business days", icon: "🏦" },
  { method: "Cash on Delivery",             time: "7–10 business days (bank transfer)", icon: "💵" },
  { method: "OneCart Wallet Credits",       time: "Instant",           icon: "⚡" },
];

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="border border-amazon-border rounded-xl overflow-hidden bg-white"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-amazon-section/40 transition"
      >
        <span className="text-sm font-semibold text-amazon-text pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
          <ChevronDown size={16} className="text-amazon-text-secondary" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-amazon-text-secondary leading-relaxed border-t border-amazon-border pt-3">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Returns() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-amazon-section">

      {/* HERO BANNER */}
      <div className="bg-amazon-header text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <RotateCcw size={20} className="text-amazon-accent" />
              <span className="text-amazon-accent text-sm font-bold uppercase tracking-widest">Returns & Refunds</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
              Hassle-Free Returns,<br />
              <span className="text-amazon-accent">Always.</span>
            </h1>
            <p className="text-white/70 text-base max-w-xl leading-relaxed">
              Not happy with your purchase? We make returns simple. Return eligible items within 7 days and get a full refund — no questions asked.
            </p>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8"
          >
            {[
              { icon: "📅", value: "7 Days",     label: "Return Window" },
              { icon: "🚚", value: "Free",        label: "Return Pickup" },
              { icon: "⚡", value: "5–7 Days",   label: "Refund Time" },
              { icon: "🛡️", value: "100%",       label: "Secure Process" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="bg-white/10 border border-white/15 rounded-xl p-4 text-center backdrop-blur"
              >
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-lg font-extrabold text-amazon-accent">{s.value}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* HOW IT WORKS */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">How Returns Work</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RETURN_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-amazon-border rounded-2xl p-5 relative shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="absolute top-4 right-4 text-3xl font-black text-amazon-border">{step.step}</span>
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${step.color}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-amazon-text mb-2">{step.title}</h3>
                  <p className="text-xs text-amazon-text-secondary leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ELIGIBLE / NOT ELIGIBLE */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">What Can Be Returned?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Eligible */}
            <div className="bg-white border border-amazon-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <CheckCircle size={16} className="text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-amazon-text">Eligible for Return</h3>
              </div>
              <div className="space-y-2.5">
                {ELIGIBLE.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 text-sm text-amazon-text"
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    {item.text}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Not eligible */}
            <div className="bg-white border border-amazon-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                  <XCircle size={16} className="text-red-500" />
                </div>
                <h3 className="text-sm font-bold text-amazon-text">Not Eligible for Return</h3>
              </div>
              <div className="space-y-2.5">
                {NOT_ELIGIBLE.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 text-sm text-amazon-text"
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    {item.text}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* REFUND METHODS */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">Refund Methods & Timeline</h2>
          </div>
          <div className="bg-white border border-amazon-border rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-amazon-section border-b border-amazon-border px-5 py-3">
              <p className="text-xs font-black text-amazon-text-secondary uppercase tracking-widest">Payment Method</p>
              <p className="text-xs font-black text-amazon-text-secondary uppercase tracking-widest text-center">Refund To</p>
              <p className="text-xs font-black text-amazon-text-secondary uppercase tracking-widest text-right">Timeline</p>
            </div>
            {REFUND_METHODS.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`grid grid-cols-3 items-center px-5 py-4 ${i < REFUND_METHODS.length - 1 ? "border-b border-amazon-border" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{r.icon}</span>
                  <span className="text-sm font-medium text-amazon-text">{r.method}</span>
                </div>
                <p className="text-sm text-amazon-text-secondary text-center">Original source</p>
                <div className="flex justify-end">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    r.time === "Instant"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amazon-section text-amazon-text border border-amazon-border"
                  }`}>
                    {r.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-amazon-text-secondary mt-3 flex items-center gap-1.5">
            <AlertCircle size={12} />
            Refund timelines are from the date of approval, not the date of return initiation.
          </p>
        </motion.section>

        {/* FAQ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </motion.section>

        {/* CONTACT SUPPORT */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">Need More Help?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <MessageSquare size={22} className="text-amazon-accent" />,
                title: "Live Chat",
                desc: "Chat with our support team instantly. Available 9 AM – 9 PM, 7 days a week.",
                action: "Start Chat",
                bg: "bg-amazon-section border-amazon-border",
                onClick: () => {},
              },
              {
                icon: <Phone size={22} className="text-blue-600" />,
                title: "Call Us",
                desc: "+91 98765 43210\nMon–Sat, 10 AM – 7 PM",
                action: "Call Now",
                bg: "bg-blue-50 border-blue-200",
                onClick: () => {},
              },
              {
                icon: <Mail size={22} className="text-purple-600" />,
                title: "Email Support",
                desc: "support@onecart.com\nWe reply within 24 hours.",
                action: "Send Email",
                bg: "bg-purple-50 border-purple-200",
                onClick: () => navigate("/contact"),
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
                className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer transition-all`}
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${card.bg}`}>
                  {card.icon}
                </div>
                <h3 className="text-sm font-bold text-amazon-text mb-2">{card.title}</h3>
                <p className="text-xs text-amazon-text-secondary leading-relaxed mb-4 whitespace-pre-line">{card.desc}</p>
                <button
                  onClick={card.onClick}
                  className="flex items-center gap-1.5 text-xs font-bold text-amazon-accent hover:text-amazon-accent-hover transition"
                >
                  {card.action} <ArrowRight size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-amazon-header rounded-2xl p-7 flex flex-col sm:flex-row items-center justify-between gap-5 text-white"
        >
          <div>
            <h3 className="text-lg font-extrabold mb-1">Ready to return an item?</h3>
            <p className="text-white/60 text-sm">Go to My Orders and initiate your return in just a few clicks.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/orders")}
            className="bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold px-7 py-3 rounded-xl text-sm shadow-lg flex items-center gap-2 flex-shrink-0"
          >
            <RefreshCw size={15} /> Go to My Orders
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}
