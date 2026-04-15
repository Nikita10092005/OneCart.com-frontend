import { motion } from "framer-motion";
import { FaAd, FaSearch, FaBrain, FaBullseye, FaToggleOff, FaShieldAlt, FaCheckCircle, FaUserCog } from "react-icons/fa";
import { MdOutlinePrivacyTip } from "react-icons/md";

const HOW_IT_WORKS = [
  {
    icon: <FaSearch />,
    step: "01",
    title: "We Collect Browsing Data",
    desc: "We track pages you visit, products you view, categories you explore, and searches you make on OneCart to build a picture of your interests.",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: <FaBrain />,
    step: "02",
    title: "We Analyse Your Interests",
    desc: "Our algorithms identify patterns in your activity — what you browse, save, and buy — to understand your preferences and predict what you'd love.",
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    icon: <FaBullseye />,
    step: "03",
    title: "We Show Relevant Ads",
    desc: "Ads are matched to your interests so you see products you're genuinely more likely to want — fewer irrelevant ads, more useful discoveries.",
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
];

const DATA_CATEGORIES = [
  {
    icon: "🔍",
    label: "Browsing History",
    desc: "Pages and products you've viewed on OneCart",
  },
  {
    icon: "🔎",
    label: "Search Queries",
    desc: "Keywords, filters, and categories you've searched",
  },
  {
    icon: "🛒",
    label: "Purchase History",
    desc: "Items you've bought and order patterns",
  },
  {
    icon: "❤️",
    label: "Wishlist & Saves",
    desc: "Products you've saved or added to your wishlist",
  },
  {
    icon: "📍",
    label: "City-Level Location",
    desc: "Approximate location only — never precise GPS data",
  },
  {
    icon: "📱",
    label: "Device & Session",
    desc: "Device type and session duration for relevance tuning",
  },
];

const OPT_OUT_STEPS = [
  {
    step: "1",
    icon: <FaUserCog />,
    title: "Open Your Profile",
    desc: "Click your avatar in the top-right corner and select 'My Account'.",
  },
  {
    step: "2",
    icon: <FaShieldAlt />,
    title: "Go to Privacy Settings",
    desc: "Navigate to the 'Privacy & Data' tab within your account settings.",
  },
  {
    step: "3",
    icon: <FaToggleOff />,
    title: "Disable Personalised Ads",
    desc: "Toggle off 'Interest-Based Advertising'. Changes take effect within 24 hours.",
  },
];

const COMMITMENTS = [
  { icon: <FaShieldAlt />, text: "We never sell your data to advertisers" },
  { icon: <FaCheckCircle />, text: "Ads are served by OneCart only — no third-party ad networks" },
  { icon: <MdOutlinePrivacyTip />, text: "You can opt out at any time with one toggle" },
  { icon: <FaCheckCircle />, text: "Location data is city-level only — never precise GPS" },
];

export default function InterestAds() {
  return (
    <div className="min-h-screen bg-amazon-section">

      {/* HERO */}
      <div className="bg-gradient-to-br from-amazon-header via-amazon-subheader to-[#1a2a3a] text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 right-16 w-64 h-64 rounded-full bg-amazon-accent blur-3xl" />
          <div className="absolute bottom-0 left-8 w-48 h-48 rounded-full bg-purple-400 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amazon-accent/20 border border-amazon-accent/30 flex items-center justify-center">
                <FaAd className="text-amazon-accent text-sm" />
              </div>
              <span className="text-amazon-accent text-xs font-bold uppercase tracking-widest">Advertising · Transparency</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Interest-Based <span className="text-amazon-accent">Ads</span>
            </h1>
            <p className="text-white/60 text-base max-w-2xl leading-relaxed mb-8">
              We believe ads should be useful, not annoying. Here's a transparent look at how we personalise your ad experience — and how you can control it.
            </p>

            {/* Commitment pills */}
            <div className="flex flex-wrap gap-2">
              {COMMITMENTS.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white/70"
                >
                  <span className="text-amazon-accent text-xs">{c.icon}</span>
                  {c.text}
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
          <span>Interest-based ads help us keep OneCart free. You can opt out at any time from your privacy settings.</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">

        {/* HOW IT WORKS */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-amazon-border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className={`${card.bg} ${card.border} border-b px-5 py-4 flex items-center gap-3`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center text-base shadow-sm`}>
                    {card.icon}
                  </div>
                  <span className="text-2xl font-black text-black/10">{card.step}</span>
                </div>
                <div className="px-5 py-4">
                  <h3 className="text-sm font-extrabold text-amazon-text mb-2">{card.title}</h3>
                  <p className="text-xs text-amazon-text-secondary leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* WHAT DATA WE USE */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">What Data We Use</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DATA_CATEGORIES.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-xl border border-amazon-border p-4 flex items-start gap-3 hover:shadow-sm transition-shadow"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="text-sm font-bold text-amazon-text">{item.label}</div>
                  <div className="text-xs text-amazon-text-secondary mt-0.5 leading-relaxed">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* HOW TO OPT OUT */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">How to Opt Out</h2>
          </div>
          <div className="bg-white rounded-2xl border border-amazon-border shadow-sm overflow-hidden">
            <div className="bg-amazon-section border-b border-amazon-border px-6 py-4">
              <p className="text-sm text-amazon-text-secondary">
                Opting out is simple and takes less than a minute. Follow these steps:
              </p>
            </div>
            <div className="divide-y divide-amazon-border">
              {OPT_OUT_STEPS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-5 px-6 py-5"
                >
                  <div className="w-10 h-10 rounded-xl bg-amazon-accent/10 border border-amazon-accent/20 text-amazon-accent flex items-center justify-center text-base flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-amazon-accent">STEP {item.step}</span>
                      <h3 className="text-sm font-extrabold text-amazon-text">{item.title}</h3>
                    </div>
                    <p className="text-xs text-amazon-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FOOTER NOTE */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-amazon-subheader text-white rounded-2xl p-6 text-center"
        >
          <p className="text-white/70 text-sm leading-relaxed">
            Have questions about how we use your data for advertising? Read our full{" "}
            <a href="/privacy" className="text-amazon-accent underline underline-offset-2 hover:text-amazon-accent-hover">
              Privacy Notice
            </a>{" "}
            or contact us at{" "}
            <a href="mailto:privacy@onecart.in" className="text-amazon-accent underline underline-offset-2 hover:text-amazon-accent-hover">
              privacy@onecart.in
            </a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
