import { motion } from "framer-motion";
import { FaShieldAlt, FaDatabase, FaUserLock, FaShareAlt, FaCookieBite, FaEnvelope, FaCheckCircle } from "react-icons/fa";

const SECTIONS = [
  {
    icon: <FaDatabase />,
    title: "What We Collect",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    badge: "bg-blue-100 text-blue-700",
    points: [
      "Full name, email address, and phone number provided during registration.",
      "Shipping and billing addresses for order fulfilment.",
      "Order history, wishlist items, and browsing behaviour on the platform.",
      "Payment method type (we never store full card numbers — handled by our payment gateway).",
      "Device information, IP address, and browser type for security and analytics.",
    ],
  },
  {
    icon: <FaUserLock />,
    title: "How We Use Your Data",
    color: "from-green-500 to-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    badge: "bg-green-100 text-green-700",
    points: [
      "To process and fulfil your orders, and send you order status updates.",
      "To personalise your shopping experience with relevant product recommendations.",
      "To send promotional emails and offers — you can opt out at any time.",
      "To detect and prevent fraud, abuse, and unauthorised account access.",
      "To improve our platform through aggregated, anonymised analytics.",
    ],
  },
  {
    icon: <FaShareAlt />,
    title: "Data Sharing",
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    badge: "bg-purple-100 text-purple-700",
    points: [
      "We never sell your personal data to third parties — ever.",
      "Sellers receive only the information needed to fulfil your order (name, address).",
      "Logistics partners receive shipping details strictly for delivery purposes.",
      "Payment processors receive transaction data under strict data protection agreements.",
      "We may disclose data if required by law or valid government order.",
    ],
  },
  {
    icon: <FaCookieBite />,
    title: "Cookies & Tracking",
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    badge: "bg-amber-100 text-amber-700",
    points: [
      "We use essential cookies to keep you logged in and maintain your cart.",
      "Analytics cookies help us understand how users navigate the platform.",
      "Advertising cookies power our interest-based ad personalisation.",
      "You can manage or disable non-essential cookies from your browser settings.",
      "Disabling cookies may affect certain features like saved preferences.",
    ],
  },
  {
    icon: <FaUserLock />,
    title: "Your Rights",
    color: "from-rose-500 to-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
    badge: "bg-rose-100 text-rose-700",
    points: [
      "Right to access — request a copy of all personal data we hold about you.",
      "Right to correction — update inaccurate or incomplete information at any time.",
      "Right to deletion — request erasure of your data (subject to legal obligations).",
      "Right to portability — receive your data in a structured, machine-readable format.",
      "Right to object — opt out of marketing communications and profiling at any time.",
    ],
  },
];

const HIGHLIGHTS = [
  { icon: <FaShieldAlt />, label: "256-bit Encryption", sub: "All data in transit" },
  { icon: <FaDatabase />, label: "India-based Servers", sub: "Data stays local" },
  { icon: <FaUserLock />, label: "Zero Data Sales", sub: "We never sell your data" },
  { icon: <FaCheckCircle />, label: "GDPR Aligned", sub: "Global privacy standards" },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-amazon-section">

      {/* HERO */}
      <div className="bg-gradient-to-br from-amazon-header via-amazon-subheader to-[#1a2a3a] text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 right-16 w-64 h-64 rounded-full bg-green-400 blur-3xl" />
          <div className="absolute bottom-0 left-8 w-48 h-48 rounded-full bg-blue-400 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amazon-accent/20 border border-amazon-accent/30 flex items-center justify-center">
                <FaShieldAlt className="text-amazon-accent text-sm" />
              </div>
              <span className="text-amazon-accent text-xs font-bold uppercase tracking-widest">Legal · Privacy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Privacy <span className="text-amazon-accent">Notice</span>
            </h1>
            <p className="text-white/60 text-base max-w-2xl leading-relaxed mb-8">
              Your privacy matters to us. This notice explains what data we collect, why we collect it, and how you stay in control. Last updated <strong className="text-white/80">January 2025</strong>.
            </p>

            {/* Trust highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {HIGHLIGHTS.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 flex items-center gap-2"
                >
                  <div className="text-amazon-accent text-base flex-shrink-0">{h.icon}</div>
                  <div>
                    <div className="text-white text-xs font-bold leading-tight">{h.label}</div>
                    <div className="text-white/40 text-xs">{h.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* NOTICE BANNER */}
      <div className="bg-green-50 border-b border-green-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-green-800">
          <FaCheckCircle className="text-green-500 flex-shrink-0" />
          <span>We are committed to protecting your personal data in accordance with applicable privacy laws.</span>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        {SECTIONS.map((section, i) => (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
          >
            <div className="bg-white rounded-2xl border border-amazon-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className={`${section.bg} ${section.border} border-b px-6 py-4 flex items-center gap-4`}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} text-white flex items-center justify-center text-base shadow-sm`}>
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-amazon-text">{section.title}</h2>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${section.badge}`}>
                    {section.points.length} points
                  </span>
                </div>
              </div>
              <ul className="px-6 py-5 space-y-3">
                {section.points.map((point, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.05 }}
                    className="flex items-start gap-3 text-sm text-amazon-text-secondary leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-amazon-accent/10 text-amazon-accent flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {j + 1}
                    </span>
                    {point}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.section>
        ))}

        {/* CONTACT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-amazon-border shadow-sm p-6 flex flex-col sm:flex-row items-center gap-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-amazon-accent/10 border border-amazon-accent/20 flex items-center justify-center flex-shrink-0">
            <FaEnvelope className="text-amazon-accent text-xl" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-extrabold text-amazon-text mb-1">Data Protection Officer</h3>
            <p className="text-sm text-amazon-text-secondary leading-relaxed">
              For privacy-related queries, data access requests, or to exercise your rights, contact our DPO at{" "}
              <a href="mailto:privacy@onecart.in" className="text-amazon-accent font-semibold hover:underline">
                privacy@onecart.in
              </a>
              . We respond within 72 hours.
            </p>
          </div>
        </motion.div>

        {/* FOOTER NOTE */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-amazon-subheader text-white rounded-2xl p-6 text-center"
        >
          <p className="text-white/70 text-sm leading-relaxed">
            By using OneCart, you consent to the data practices described in this Privacy Notice. We may update this policy periodically — we'll notify you of significant changes via email.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
