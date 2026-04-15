import { motion } from "framer-motion";
import { FaTruck, FaGift, FaBox, FaBolt } from "react-icons/fa";

const RATES = [
  { title: "Free Shipping", desc: "On orders above ₹499", detail: "Standard delivery: 3–5 business days", icon: <FaGift />, color: "bg-emerald-50 border-emerald-200 text-emerald-600" },
  { title: "Flat ₹49", desc: "On orders below ₹499", detail: "Standard delivery: 3–5 business days", icon: <FaBox />, color: "bg-blue-50 border-blue-200 text-blue-600" },
];

const REGIONS = [
  { region: "Metro Cities", days: "1–2 days" },
  { region: "Tier 2 Cities", days: "2–3 days" },
  { region: "Tier 3 Cities", days: "3–5 days" },
  { region: "Remote Areas", days: "5–7 days" },
];

export default function Shipping() {
  return (
    <div className="min-h-screen bg-amazon-section">
      <div className="bg-amazon-header text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <FaTruck className="text-amazon-accent text-xl" />
              <span className="text-amazon-accent text-sm font-bold uppercase tracking-widest">Shipping</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Shipping <span className="text-amazon-accent">Rates</span></h1>
            <p className="text-white/70 text-base max-w-xl leading-relaxed">Fast, reliable delivery across India</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">Shipping Rates</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RATES.map((rate, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 text-lg ${rate.color}`}>{rate.icon}</div>
                <h3 className="text-base font-bold text-amazon-text mb-1">{rate.title}</h3>
                <p className="text-sm text-amazon-text-secondary mb-1">{rate.desc}</p>
                <p className="text-xs text-amazon-text-secondary">{rate.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">Express Delivery</h2>
          </div>
          <div className="bg-white rounded-2xl border border-amazon-border p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amazon-accent/10 border border-amazon-accent/20 flex items-center justify-center text-amazon-accent text-lg flex-shrink-0"><FaBolt /></div>
              <div>
                <h3 className="text-base font-bold text-amazon-text mb-1">OneCart Express</h3>
                <p className="text-sm text-amazon-text-secondary mb-1">₹99 per order — delivery in 1–2 days</p>
                <p className="text-xs text-amazon-text-secondary">Available in 50+ cities across India</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">Delivery Timelines by Region</h2>
          </div>
          <div className="bg-white rounded-2xl border border-amazon-border overflow-hidden shadow-sm">
            {REGIONS.map((row, i) => (
              <div key={i} className={`flex items-center justify-between px-6 py-4 ${i !== REGIONS.length - 1 ? "border-b border-amazon-border" : ""}`}>
                <span className="text-sm font-medium text-amazon-text">{row.region}</span>
                <span className="text-sm text-amazon-accent font-semibold">{row.days}</span>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
