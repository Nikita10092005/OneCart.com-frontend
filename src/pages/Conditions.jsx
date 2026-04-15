import { motion } from "framer-motion";
import { FaFileContract, FaUserShield, FaBan, FaCopyright, FaBalanceScale, FaCheckCircle } from "react-icons/fa";

const SECTIONS = [
  {
    title: "Account Usage",
    icon: <FaUserShield />,
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    badge: "bg-blue-100 text-blue-700",
    points: [
      "You must be 18 years or older to create an account on OneCart.",
      "You are solely responsible for maintaining the confidentiality of your login credentials.",
      "Account sharing with third parties is strictly prohibited and may result in suspension.",
      "OneCart reserves the right to suspend or permanently ban accounts that violate these terms.",
      "You agree to provide accurate, current, and complete information during registration.",
    ],
  },
  {
    title: "Prohibited Activities",
    icon: <FaBan />,
    color: "from-red-500 to-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    badge: "bg-red-100 text-red-700",
    points: [
      "Fraudulent transactions, chargebacks without valid reason, or payment manipulation.",
      "Posting fake, misleading, incentivised, or defamatory reviews on any product.",
      "Scraping, crawling, or automated data extraction from the OneCart platform.",
      "Reselling products purchased on OneCart without prior written consent from OneCart.",
      "Attempting to gain unauthorised access to any part of the platform or its systems.",
    ],
  },
  {
    title: "Intellectual Property",
    icon: <FaCopyright />,
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    badge: "bg-purple-100 text-purple-700",
    points: [
      "All content on OneCart — including text, images, UI, and code — is owned by OneCart.",
      "The OneCart name, logo, and all trademarks may not be used without written permission.",
      "Unauthorised reproduction or distribution of any platform content is strictly prohibited.",
      "User-submitted content (reviews, photos) grants OneCart a non-exclusive licence to display it.",
      "Any feedback or suggestions you provide may be used by OneCart without obligation to you.",
    ],
  },
  {
    title: "Dispute Resolution",
    icon: <FaBalanceScale />,
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    badge: "bg-amber-100 text-amber-700",
    points: [
      "All disputes arising from use of OneCart are governed by the laws of India.",
      "Exclusive jurisdiction for any legal proceedings lies in Mumbai, Maharashtra.",
      "OneCart aims to resolve all customer disputes within a 30-day resolution window.",
      "Customers are strongly encouraged to contact support before initiating any legal action.",
      "Binding arbitration may be required for certain categories of disputes as per our policy.",
    ],
  },
];

const STATS = [
  { value: "2M+", label: "Active Users" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "30 Days", label: "Dispute Window" },
  { value: "24/7", label: "Support" },
];

export default function Conditions() {
  return (
    <div className="min-h-screen bg-amazon-section">

      {/* HERO */}
      <div className="bg-gradient-to-br from-amazon-header via-amazon-subheader to-[#1a2a3a] text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 right-16 w-64 h-64 rounded-full bg-amazon-accent blur-3xl" />
          <div className="absolute bottom-0 left-8 w-48 h-48 rounded-full bg-blue-400 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amazon-accent/20 border border-amazon-accent/30 flex items-center justify-center">
                <FaFileContract className="text-amazon-accent text-sm" />
              </div>
              <span className="text-amazon-accent text-xs font-bold uppercase tracking-widest">Legal · Terms</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Conditions of <span className="text-amazon-accent">Use</span>
            </h1>
            <p className="text-white/60 text-base max-w-2xl leading-relaxed mb-8">
              These terms govern your use of the OneCart platform. By accessing or using our services, you agree to be bound by the following conditions. Last updated <strong className="text-white/80">January 2025</strong>.
            </p>
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              {STATS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center"
                >
                  <div className="text-amazon-accent font-extrabold text-lg">{s.value}</div>
                  <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* NOTICE BANNER */}
      <div className="bg-amazon-accent/10 border-b border-amazon-accent/20 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-amazon-text">
          <FaCheckCircle className="text-amazon-accent flex-shrink-0" />
          <span>By continuing to use OneCart, you acknowledge that you have read and agree to these conditions.</span>
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
              {/* Card header */}
              <div className={`${section.bg} ${section.border} border-b px-6 py-4 flex items-center gap-4`}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} text-white flex items-center justify-center text-base shadow-sm`}>
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-amazon-text">{section.title}</h2>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${section.badge}`}>
                    {section.points.length} clauses
                  </span>
                </div>
              </div>
              {/* Points */}
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

        {/* FOOTER NOTE */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-amazon-subheader text-white rounded-2xl p-6 text-center"
        >
          <p className="text-white/70 text-sm leading-relaxed">
            Questions about these terms? Reach out to our legal team at{" "}
            <a href="mailto:legal@onecart.in" className="text-amazon-accent underline underline-offset-2 hover:text-amazon-accent-hover">
              legal@onecart.in
            </a>{" "}
            or visit our{" "}
            <a href="/contact" className="text-amazon-accent underline underline-offset-2 hover:text-amazon-accent-hover">
              Help Centre
            </a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
