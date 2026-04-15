import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FaFlask, FaGithub, FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";

function Counter({ to, suffix = "", duration = 2 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / (duration * 60);
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [inView, to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const AI_FEATURES = [
  { icon: "🤖", title: "Smart Recommendations",  color: "bg-amazon-accent/10 border-amazon-accent/20 text-amazon-accent", stat: "40% lift",  statLabel: "in conversion",  desc: "Our ML models analyse 200+ signals per session — browsing history, purchase patterns, real-time trends — to surface products you'll actually want." },
  { icon: "🔍", title: "Visual Search",           color: "bg-blue-50 border-blue-200 text-blue-600",                       stat: "0.3s",      statLabel: "avg response",   desc: "Snap a photo of any product and our computer vision engine finds the closest matches in our catalogue instantly using ResNet-50 embeddings." },
  { icon: "📉", title: "Price Prediction",        color: "bg-purple-50 border-purple-200 text-purple-600",                 stat: "87%",       statLabel: "accuracy",       desc: "Time-series forecasting models predict price movements so you know the best time to buy and never overpay." },
  { icon: "🗣️", title: "NLP Search",              color: "bg-emerald-50 border-emerald-200 text-emerald-600",              stat: "3x",        statLabel: "better results", desc: "Natural language understanding lets you search the way you talk — 'red dress under 2000 for party' just works." },
  { icon: "🚚", title: "Logistics Intelligence",  color: "bg-amber-50 border-amber-200 text-amber-600",                   stat: "99.2%",     statLabel: "on-time rate",   desc: "Real-time route optimisation and demand forecasting ensure your order takes the fastest path to your door." },
  { icon: "🛡️", title: "Fraud Detection",         color: "bg-red-50 border-red-200 text-red-500",                         stat: "<0.01%",    statLabel: "fraud rate",     desc: "Graph neural networks analyse transaction patterns in real-time to block fraudulent orders before they're processed." },
];

const INITIATIVES = [
  { icon: "🔬", title: "OneCart Labs",     color: "bg-emerald-50 border-emerald-200 text-emerald-600", desc: "Our internal R&D team experiments with cutting-edge AI, logistics optimisation, and next-gen UX patterns. 20 researchers, 3 PhDs.", link: "Learn more" },
  { icon: "🌐", title: "Open Source",      color: "bg-orange-50 border-orange-200 text-orange-600",    desc: "We contribute back to the community. Several of our internal tools and libraries are available on GitHub with 2,000+ stars.", link: "View on GitHub" },
  { icon: "📄", title: "Research Papers",  color: "bg-pink-50 border-pink-200 text-pink-600",          desc: "Our data science team publishes findings on recommendation systems, demand forecasting, and supply chain ML at top conferences.", link: "Read papers" },
  { icon: "🎓", title: "OneCart Scholars", color: "bg-blue-50 border-blue-200 text-blue-600",          desc: "We fund PhD research at IITs and IISc on problems relevant to Indian e-commerce — from last-mile delivery to vernacular NLP.", link: "Apply now" },
];

const TECH_STACK = [
  { name: "React",        icon: "⚛️",  category: "Frontend" },
  { name: "Node.js",      icon: "🟢",  category: "Backend" },
  { name: "MongoDB",      icon: "🍃",  category: "Database" },
  { name: "TensorFlow",   icon: "🧠",  category: "ML" },
  { name: "Redis",        icon: "🔴",  category: "Cache" },
  { name: "Kubernetes",   icon: "☸️",  category: "Infra" },
  { name: "Python",       icon: "🐍",  category: "ML" },
  { name: "TypeScript",   icon: "🔷",  category: "Frontend" },
  { name: "Kafka",        icon: "📨",  category: "Streaming" },
  { name: "Elasticsearch",icon: "🔍",  category: "Search" },
  { name: "PyTorch",      icon: "🔥",  category: "ML" },
  { name: "GraphQL",      icon: "◈",   category: "API" },
];

const PAPERS = [
  { title: "Personalised Recommendations at Scale: Lessons from 10M Users", venue: "RecSys 2024", authors: "Sharma et al.", tag: "ML" },
  { title: "Real-Time Fraud Detection Using Graph Neural Networks",          venue: "KDD 2024",    authors: "Gupta et al.", tag: "Security" },
  { title: "Last-Mile Delivery Optimisation in Dense Urban Environments",    venue: "ICML 2023",   authors: "Mehta et al.", tag: "Logistics" },
  { title: "Vernacular NLP for Product Search in Low-Resource Languages",    venue: "ACL 2023",    authors: "Patel et al.", tag: "NLP" },
];

const STATS = [
  { label: "ML Models in Production", value: 47,        suffix: "" },
  { label: "Daily Predictions",       value: 50000000,  suffix: "+" },
  { label: "Engineers & Researchers", value: 320,       suffix: "+" },
  { label: "Patents Filed",           value: 12,        suffix: "" },
];

const TAG_COLORS = { ML: "bg-purple-50 text-purple-600 border-purple-200", Security: "bg-red-50 text-red-500 border-red-200", Logistics: "bg-amber-50 text-amber-600 border-amber-200", NLP: "bg-blue-50 text-blue-600 border-blue-200" };
const CATEGORY_COLORS = { Frontend: "bg-blue-50 text-blue-600", Backend: "bg-emerald-50 text-emerald-600", Database: "bg-green-50 text-green-600", ML: "bg-purple-50 text-purple-600", Cache: "bg-red-50 text-red-500", Infra: "bg-gray-100 text-gray-600", Streaming: "bg-amber-50 text-amber-600", Search: "bg-orange-50 text-orange-600", API: "bg-pink-50 text-pink-600" };

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-6 rounded-full bg-amazon-accent" />
      <h2 className="text-xl font-black text-amazon-text">{children}</h2>
    </div>
  );
}

export default function Science() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...new Set(TECH_STACK.map(t => t.category))];
  const filteredTech = activeCategory === "All" ? TECH_STACK : TECH_STACK.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-amazon-section">

      {/* HERO */}
      <div className="relative bg-amazon-header overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #FF9900 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amazon-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/5 rounded-full blur-2xl" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-amazon-accent/10 border border-amazon-accent/20 text-amazon-accent text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <FaFlask /> Science & Technology
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
              Technology That<br /><span className="text-amazon-accent">Thinks Ahead</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              From AI-powered recommendations to real-time fraud detection — the science behind India's smartest shopping platform.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mt-8">
            {["🧠 47 ML Models", "📄 4 Research Papers", "⭐ 2K+ GitHub Stars", "🎓 3 PhD Researchers"].map((b, i) => (
              <span key={i} className="bg-white/10 border border-white/10 text-white/80 text-xs font-semibold px-4 py-2 rounded-full">{b}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* STATS */}
      <div className="bg-amazon-accent">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <p className="text-3xl font-black text-white"><Counter to={s.value} suffix={s.suffix} /></p>
              <p className="text-white/70 text-xs font-semibold mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14 space-y-16">

        {/* AI & ML */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>AI & ML Features</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_FEATURES.map((card, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm transition-all">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-3 text-xl ${card.color}`}>{card.icon}</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="text-sm font-black text-amazon-text">{card.title}</h3>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-black text-amazon-accent">{card.stat}</span>
                  <span className="text-xs text-amazon-text-secondary">{card.statLabel}</span>
                </div>
                <p className="text-xs text-amazon-text-secondary leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* HOW IT WORKS */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>How Our Recommendation Engine Works</SectionTitle>
          <div className="bg-white border border-amazon-border rounded-2xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {[
                { step: "1", icon: "👤", label: "User Signal",      desc: "Clicks, views, purchases, dwell time" },
                { step: "→", icon: null, label: null,               desc: null },
                { step: "2", icon: "🧠", label: "Feature Extraction", desc: "200+ signals processed in real-time" },
                { step: "→", icon: null, label: null,               desc: null },
                { step: "3", icon: "🎯", label: "Ranked Results",   desc: "Personalised product list in <50ms" },
              ].map((s, i) => s.icon ? (
                <motion.div key={i} whileHover={{ scale: 1.04 }}
                  className="bg-amazon-section border border-amazon-border rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <p className="text-xs font-black text-amazon-text mb-1">{s.label}</p>
                  <p className="text-[10px] text-amazon-text-secondary">{s.desc}</p>
                </motion.div>
              ) : (
                <div key={i} className="text-amazon-accent text-xl font-black text-center hidden md:block">→</div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Collaborative Filtering", desc: "Finds users with similar taste and recommends what they loved" },
                { label: "Content-Based Filtering", desc: "Matches product attributes to your preference profile" },
                { label: "Hybrid Ensemble",         desc: "Combines both approaches with a neural re-ranker for best results" },
              ].map((m, i) => (
                <div key={i} className="bg-amazon-section/50 border border-amazon-border rounded-xl p-4">
                  <p className="text-xs font-black text-amazon-text mb-1">{m.label}</p>
                  <p className="text-[11px] text-amazon-text-secondary leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* RESEARCH PAPERS */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>Research Publications</SectionTitle>
          <div className="space-y-3">
            {PAPERS.map((p, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}
                className="bg-white border border-amazon-border rounded-2xl p-5 shadow-sm flex items-start gap-4 transition-all">
                <div className="w-10 h-10 bg-amazon-section border border-amazon-border rounded-xl flex items-center justify-center text-lg flex-shrink-0">📄</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-sm font-black text-amazon-text">{p.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TAG_COLORS[p.tag]}`}>{p.tag}</span>
                  </div>
                  <p className="text-xs text-amazon-text-secondary">{p.authors} · <span className="font-bold text-amazon-accent">{p.venue}</span></p>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-bold text-amazon-accent border border-amazon-accent px-3 py-2 rounded-xl hover:bg-amazon-accent hover:text-white transition flex-shrink-0">
                  <FaExternalLinkAlt size={9} /> Read
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* INNOVATION INITIATIVES */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>Innovation Initiatives</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INITIATIVES.map((card, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -3, boxShadow: "0 10px 24px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm transition-all">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 text-xl ${card.color}`}>{card.icon}</div>
                <h3 className="text-sm font-black text-amazon-text mb-2">{card.title}</h3>
                <p className="text-xs text-amazon-text-secondary leading-relaxed mb-3">{card.desc}</p>
                <button className="flex items-center gap-1.5 text-xs font-bold text-amazon-accent hover:underline">
                  {card.title === "Open Source" ? <FaGithub size={11} /> : <FaArrowRight size={10} />}
                  {card.link}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* TECH STACK */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>Tech Stack</SectionTitle>
          <div className="bg-white border border-amazon-border rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-amazon-text-secondary mb-5 leading-relaxed">
              We build with modern, battle-tested technologies that scale to millions of users and billions of events per day.
            </p>
            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-5">
              {categories.map(c => (
                <button key={c} onClick={() => setActiveCategory(c)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    activeCategory === c ? "bg-amazon-accent text-white border-amazon-accent" : "bg-amazon-section text-amazon-text-secondary border-amazon-border hover:border-amazon-accent"
                  }`}>{c}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {filteredTech.map((t, i) => (
                <motion.div key={t.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="flex items-center gap-2 bg-amazon-section border border-amazon-border px-4 py-2.5 rounded-xl cursor-default">
                  <span className="text-base">{t.icon}</span>
                  <span className="text-sm font-bold text-amazon-text">{t.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[t.category] || "bg-gray-100 text-gray-500"}`}>{t.category}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="relative bg-amazon-header rounded-3xl overflow-hidden p-10 text-center">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #FF9900 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="relative">
            <p className="text-amazon-accent text-xs font-black uppercase tracking-widest mb-3">Join the Team</p>
            <h2 className="text-2xl font-black text-white mb-3">Love building at scale?</h2>
            <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
              We're hiring engineers, data scientists, and researchers who want to solve hard problems for millions of Indians.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.a href="/careers" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-6 py-3 bg-amazon-accent hover:bg-amazon-accent-hover text-white font-black text-sm rounded-xl shadow-lg transition">
                🧑‍💻 View Open Roles
              </motion.a>
              <motion.a href="https://github.com" target="_blank" rel="noreferrer"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-black text-sm rounded-xl border border-white/20 flex items-center gap-2 transition">
                <FaGithub /> GitHub
              </motion.a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
