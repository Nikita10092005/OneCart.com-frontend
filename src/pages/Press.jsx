import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaNewspaper, FaDownload, FaExternalLinkAlt, FaSearch } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const PRESS_RELEASES = [
  { date: "15 Jan 2025", tag: "Milestone",  headline: "OneCart Crosses 10 Million Orders Milestone", excerpt: "OneCart announced today that it has processed over 10 million orders since its founding in 2020, cementing its position as one of India's fastest-growing e-commerce platforms.", full: "The milestone was reached on January 12, 2025, just 5 years after the company's founding. CEO Arjun Mehta credited the achievement to the company's relentless focus on logistics reliability and seller quality. OneCart now processes over 50,000 orders per day across 19,000+ pin codes." },
  { date: "3 Nov 2024",  tag: "Product",    headline: "OneCart Launches AI-Powered Smart Recommendations", excerpt: "The new recommendation engine uses deep learning to personalise product discovery for each shopper, resulting in a 40% increase in cart conversion rates during beta testing.", full: "The system, built by OneCart's in-house data science team, analyses over 200 signals per user session to surface the most relevant products. It was trained on 3 years of anonymised purchase data and went through 6 months of A/B testing before launch." },
  { date: "22 Aug 2024", tag: "Expansion",  headline: "OneCart Expands to 500 New Cities Across India", excerpt: "Following a successful Series B funding round, OneCart has extended its delivery network to cover 500 additional cities, bringing its total reach to over 19,000 pin codes.", full: "The expansion was made possible by partnerships with 12 regional logistics providers and the opening of 8 new fulfilment centres in Tier 2 cities. OneCart now offers same-day delivery in 45 cities and next-day delivery in 300+ cities." },
  { date: "10 May 2024", tag: "Funding",    headline: "OneCart Raises ₹500 Crore in Series B Round", excerpt: "The funding round was led by Sequoia India and Tiger Global, with participation from existing investors. The capital will be used to expand logistics infrastructure and accelerate technology development.", full: "The Series B values OneCart at approximately ₹4,200 crore. The company plans to use the funds to open 20 new warehouses, hire 500 engineers, and launch its seller analytics platform." },
  { date: "1 Feb 2024",  tag: "Partnership", headline: "OneCart Partners with 1,000 New Verified Sellers", excerpt: "OneCart's seller onboarding programme has added 1,000 new verified sellers in Q1 2024, bringing the total to over 8,500 active sellers on the platform.", full: "The new sellers span categories including electronics, fashion, home goods, and artisanal products. OneCart's seller verification process includes quality audits, return rate monitoring, and customer satisfaction scoring." },
];

const MENTIONS = [
  { outlet: "TechCrunch India", logo: "📰", color: "bg-blue-50 border-blue-200", quote: "OneCart is quietly becoming the go-to platform for Tier 2 and Tier 3 India — a market the big players have consistently underserved." },
  { outlet: "Economic Times",   logo: "📊", color: "bg-emerald-50 border-emerald-200", quote: "With its laser focus on logistics and seller quality, OneCart has built a trust moat that's proving difficult for competitors to replicate." },
  { outlet: "YourStory",        logo: "✍️", color: "bg-purple-50 border-purple-200", quote: "The Mumbai-based startup's growth story is a masterclass in solving real problems for real people — and doing it at scale." },
  { outlet: "Inc42",            logo: "🚀", color: "bg-amber-50 border-amber-200", quote: "OneCart's Series B is a strong signal that investors believe in the Bharat commerce story — and OneCart is best positioned to tell it." },
  { outlet: "Business Standard", logo: "📈", color: "bg-red-50 border-red-200", quote: "The company's unit economics are among the best in Indian e-commerce, with a path to profitability that's clearer than most of its peers." },
  { outlet: "Mint",             logo: "💹", color: "bg-teal-50 border-teal-200", quote: "OneCart's AI-powered recommendations have set a new benchmark for personalisation in Indian e-commerce." },
];

const AWARDS = [
  { year: "2025", title: "Best E-Commerce Platform", org: "India Tech Awards", icon: "🏆" },
  { year: "2024", title: "Fastest Growing Startup",  org: "Economic Times Startup Awards", icon: "🚀" },
  { year: "2024", title: "Best Customer Experience", org: "CX Excellence Awards", icon: "⭐" },
  { year: "2023", title: "Top 50 Startups to Watch", org: "Forbes India", icon: "📋" },
];

const ASSETS = [
  { name: "OneCart Logo Pack",     desc: "SVG, PNG in light and dark variants", icon: "🎨", size: "2.4 MB" },
  { name: "Brand Guidelines",      desc: "Colors, typography, usage rules",      icon: "📐", size: "1.1 MB" },
  { name: "Executive Headshots",   desc: "High-res photos of leadership team",   icon: "👤", size: "8.2 MB" },
  { name: "Product Screenshots",   desc: "App and web UI screenshots",           icon: "📱", size: "5.6 MB" },
];

const TAG_COLORS = {
  Milestone:   "bg-amber-50 text-amber-600 border-amber-200",
  Product:     "bg-blue-50 text-blue-600 border-blue-200",
  Expansion:   "bg-emerald-50 text-emerald-600 border-emerald-200",
  Funding:     "bg-purple-50 text-purple-600 border-purple-200",
  Partnership: "bg-pink-50 text-pink-600 border-pink-200",
};

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

export default function Press() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [activeTag, setActiveTag] = useState("All");

  const tags = ["All", ...Object.keys(TAG_COLORS)];
  const filtered = PRESS_RELEASES.filter(pr =>
    (activeTag === "All" || pr.tag === activeTag) &&
    (!search || pr.headline.toLowerCase().includes(search.toLowerCase()) || pr.excerpt.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-amazon-section">

      {/* HERO */}
      <div className="relative bg-amazon-header overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #FF9900 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amazon-accent/10 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-amazon-accent/10 border border-amazon-accent/20 text-amazon-accent text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <FaNewspaper /> Press & Media
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
              OneCart in the <span className="text-amazon-accent">News</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Press releases, media mentions, awards, and brand assets for journalists and content creators covering OneCart.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mt-8">
            {["📰 5 Press Releases", "🏆 4 Industry Awards", "📺 6 Media Mentions", "📦 Brand Assets Available"].map((b, i) => (
              <span key={i} className="bg-white/10 border border-white/10 text-white/80 text-xs font-semibold px-4 py-2 rounded-full">{b}</span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14 space-y-16">

        {/* PRESS RELEASES */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>Press Releases</SectionTitle>

          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1 max-w-sm">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-amazon-text-secondary" size={12} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search press releases..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-amazon-border rounded-xl text-sm text-amazon-text focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 transition" />
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(t => (
                <button key={t} onClick={() => setActiveTag(t)}
                  className={`text-xs font-bold px-3 py-2 rounded-full border transition-all ${
                    activeTag === t ? "bg-amazon-accent text-white border-amazon-accent" : "bg-white text-amazon-text-secondary border-amazon-border hover:border-amazon-accent"
                  }`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((pr, i) => (
                <motion.div key={pr.headline} layout variants={fadeUp}
                  className="bg-white rounded-2xl border border-amazon-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5 cursor-pointer" onClick={() => setExpanded(expanded === i ? null : i)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs text-amazon-accent font-black">{pr.date}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TAG_COLORS[pr.tag]}`}>{pr.tag}</span>
                        </div>
                        <h3 className="text-sm font-black text-amazon-text mb-2">{pr.headline}</h3>
                        <p className="text-xs text-amazon-text-secondary leading-relaxed">{pr.excerpt}</p>
                      </div>
                      <motion.div animate={{ rotate: expanded === i ? 180 : 0 }} className="text-amazon-accent text-xs flex-shrink-0 mt-1">▼</motion.div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expanded === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-5 pb-5 border-t border-amazon-section pt-4">
                          <p className="text-sm text-amazon-text-secondary leading-relaxed">{pr.full}</p>
                          <button className="mt-3 flex items-center gap-1.5 text-xs text-amazon-accent font-bold hover:underline">
                            <FaExternalLinkAlt size={10} /> Read full release
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="text-center py-10 text-amazon-accent">
                <FaNewspaper size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-bold text-amazon-text">No results found</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* AWARDS */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>Awards & Recognition</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AWARDS.map((a, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm text-center transition-all">
                <div className="text-3xl mb-3">{a.icon}</div>
                <p className="text-xs text-amazon-accent font-black mb-1">{a.year}</p>
                <h4 className="text-sm font-black text-amazon-text mb-1">{a.title}</h4>
                <p className="text-xs text-amazon-text-secondary">{a.org}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* MEDIA MENTIONS */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>Media Mentions</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MENTIONS.map((m, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -3, boxShadow: "0 10px 24px rgba(0,0,0,0.08)" }}
                className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${m.color}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{m.logo}</span>
                  <div>
                    <p className="text-sm font-black text-amazon-text">{m.outlet}</p>
                    <div className="flex items-center gap-1 text-[10px] text-amazon-accent font-bold">
                      <MdVerified size={11} /> Verified Coverage
                    </div>
                  </div>
                </div>
                <p className="text-xs text-amazon-text-secondary leading-relaxed italic">"{m.quote}"</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* BRAND ASSETS */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>Brand Assets</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ASSETS.map((a, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm flex items-center gap-4 transition-all">
                <div className="w-12 h-12 bg-amazon-section border border-amazon-border rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-amazon-text">{a.name}</h4>
                  <p className="text-xs text-amazon-text-secondary">{a.desc}</p>
                  <p className="text-[10px] text-amazon-accent font-bold mt-0.5">{a.size}</p>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-black text-amazon-accent border border-amazon-accent px-3 py-2 rounded-xl hover:bg-amazon-accent hover:text-white transition flex-shrink-0">
                  <FaDownload size={10} /> Download
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* MEDIA CONTACT */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="relative bg-amazon-header rounded-3xl overflow-hidden p-10">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #FF9900 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-amazon-accent text-xs font-black uppercase tracking-widest mb-3">Media Contact</p>
                <h2 className="text-2xl font-black text-white mb-3">Get in Touch</h2>
                <p className="text-white/60 text-sm leading-relaxed">
                  For press inquiries, interview requests, or media assets, please reach out to our communications team. We typically respond within 4 business hours.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { icon: "✉️", label: "Email", value: "press@onecart.com", href: "mailto:press@onecart.com", color: "bg-amazon-accent/10 border-amazon-accent/20" },
                  { icon: "📞", label: "Phone", value: "+91 98765 43211", href: "tel:+919876543211", color: "bg-blue-500/10 border-blue-500/20" },
                  { icon: "🕐", label: "Response Time", value: "Within 4 business hours", color: "bg-emerald-500/10 border-emerald-500/20" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg flex-shrink-0 ${c.color}`}>{c.icon}</div>
                    <div>
                      <p className="text-white/50 text-xs">{c.label}</p>
                      {c.href
                        ? <a href={c.href} className="text-sm font-bold text-amazon-accent hover:underline">{c.value}</a>
                        : <p className="text-sm font-bold text-white">{c.value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
