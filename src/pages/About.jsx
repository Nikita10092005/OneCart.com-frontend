import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaHeart, FaCheckCircle, FaBolt, FaHandshake, FaLightbulb,
  FaGlobe, FaRocket, FaShieldAlt, FaTruck, FaHeadset,
  FaLinkedin, FaTwitter, FaGithub,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdVerified } from "react-icons/md";

/* ── animated counter ── */
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

/* ── data ── */
const STATS = [
  { label: "Happy Customers",  value: 2400000, suffix: "+", icon: "😊" },
  { label: "Pin Codes Served", value: 19000,   suffix: "+", icon: "📍" },
  { label: "Verified Sellers", value: 8500,    suffix: "+", icon: "🏪" },
  { label: "Orders Delivered", value: 5000000, suffix: "+", icon: "📦" },
];

const MISSION_CARDS = [
  { icon: <FaHeart />,       title: "Customer First",   desc: "Every feature, every policy, every decision starts with one question: is this good for our customer?",                                  color: "bg-red-50 border-red-200 text-red-500" },
  { icon: <FaCheckCircle />, title: "Quality Assured",  desc: "We partner only with verified sellers and run rigorous quality checks so you always get what you paid for.",                           color: "bg-emerald-50 border-emerald-200 text-emerald-600" },
  { icon: <FaBolt />,        title: "Delivered Fast",   desc: "Our logistics network spans 19,000+ pin codes, ensuring your order reaches you in record time.",                                       color: "bg-amber-50 border-amber-200 text-amber-500" },
  { icon: <FaShieldAlt />,   title: "Secure & Private", desc: "Bank-grade encryption, zero data selling, and transparent privacy policies — your trust is our foundation.",                          color: "bg-blue-50 border-blue-200 text-blue-500" },
  { icon: <FaTruck />,       title: "Easy Returns",     desc: "Hassle-free 10-day returns on most products. No questions asked, no hidden fees.",                                                    color: "bg-purple-50 border-purple-200 text-purple-500" },
  { icon: <FaHeadset />,     title: "24/7 Support",     desc: "Real humans, real help — our support team is available around the clock to resolve any issue you face.",                              color: "bg-teal-50 border-teal-200 text-teal-600" },
];

const VALUES = [
  { icon: <FaHandshake />, title: "Integrity",    desc: "We do what's right, always — for our customers, partners, and communities." },
  { icon: <FaLightbulb />, title: "Innovation",   desc: "We constantly push boundaries to build smarter, faster, better experiences." },
  { icon: <FaGlobe />,     title: "Inclusivity",  desc: "Quality products for every Indian, regardless of location or background." },
  { icon: <FaRocket />,    title: "Impact",       desc: "Every decision we make is measured by the positive change it creates." },
];

const TIMELINE = [
  { year: "2020", title: "Founded in Mumbai",         desc: "5 founders, 1 small office, and a big dream to fix e-commerce for Bharat." },
  { year: "2021", title: "10,000 Orders Milestone",   desc: "Crossed our first major milestone and expanded to 500+ pin codes." },
  { year: "2022", title: "Seller Platform Launch",    desc: "Opened our marketplace to independent sellers across India." },
  { year: "2023", title: "1 Million Customers",       desc: "Reached 1M happy customers and launched same-day delivery in 12 cities." },
  { year: "2024", title: "AI-Powered Recommendations",desc: "Launched smart recommendations, price alerts, and personalised shopping." },
  { year: "2025", title: "19,000+ Pin Codes",         desc: "Now delivering to every corner of India with 5M+ orders delivered." },
];

const TEAM = [
  { name: "Arjun Mehta",    role: "CEO & Co-founder",      avatar: "AM", color: "from-orange-400 to-amber-500",   bio: "Ex-Flipkart. Obsessed with logistics and last-mile delivery." },
  { name: "Priya Sharma",   role: "CTO & Co-founder",      avatar: "PS", color: "from-blue-400 to-indigo-500",    bio: "Full-stack engineer. Built the platform from scratch." },
  { name: "Rahul Gupta",    role: "Head of Operations",    avatar: "RG", color: "from-emerald-400 to-teal-500",   bio: "Supply chain expert with 10+ years in e-commerce." },
  { name: "Sneha Patel",    role: "Head of Design",        avatar: "SP", color: "from-pink-400 to-rose-500",      bio: "Crafting delightful experiences for millions of users." },
];

const TECH = [
  { name: "React",      icon: "⚛️" }, { name: "Node.js",   icon: "🟢" },
  { name: "MongoDB",    icon: "🍃" }, { name: "Razorpay",  icon: "💳" },
  { name: "Tailwind",   icon: "🎨" }, { name: "Framer",    icon: "🎞️" },
  { name: "AWS S3",     icon: "☁️" }, { name: "Redis",     icon: "🔴" },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

export default function About() {
  return (
    <div className="min-h-screen bg-amazon-section">

      {/* ── HERO ── */}
      <div className="relative bg-amazon-header overflow-hidden">
        {/* background grid */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #FF9900 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amazon-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amazon-accent/5 rounded-full blur-2xl" />

        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-amazon-accent/10 border border-amazon-accent/20 text-amazon-accent text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <HiSparkles /> Our Story
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
              Built for <span className="text-amazon-accent">Bharat</span>,<br />
              Delivered to Every <span className="text-amazon-accent">Doorstep</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              OneCart is India's most trusted e-commerce platform — connecting millions of customers with thousands of verified sellers, powered by technology and driven by trust.
            </p>
          </motion.div>

          {/* floating badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mt-8">
            {["🏆 #1 Trusted Platform", "🔒 Secure Payments", "🚀 Fast Delivery", "💚 Eco Packaging"].map((b, i) => (
              <span key={i} className="bg-white/10 border border-white/10 text-white/80 text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-sm">
                {b}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="bg-amazon-accent">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <p className="text-3xl font-black text-white">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="text-white/70 text-xs font-semibold mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14 space-y-16">

        {/* ── OUR STORY ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>Our Story</SectionTitle>
          <div className="bg-white rounded-2xl border border-amazon-border p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-amazon-accent/10 text-amazon-accent text-xs font-bold px-3 py-1.5 rounded-full">
                  <MdVerified /> Founded 2020 · Mumbai
                </div>
                <p className="text-sm text-amazon-text-secondary leading-relaxed">
                  OneCart was born in a small office in Mumbai with a simple but powerful mission: make quality products accessible to every Indian, no matter where they live. What started as a team of 5 passionate builders has grown into a platform trusted by millions.
                </p>
                <p className="text-sm text-amazon-text-secondary leading-relaxed">
                  We saw a gap — great products existed, but reaching customers in Tier 2 and Tier 3 cities was broken. We set out to fix that. Today, OneCart delivers to 19,000+ pin codes, partners with thousands of verified sellers, and processes lakhs of orders every month.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Cities", value: "500+", icon: "🏙️" },
                  { label: "Sellers", value: "8,500+", icon: "🏪" },
                  { label: "Categories", value: "200+", icon: "🗂️" },
                  { label: "Team Size", value: "1,200+", icon: "👥" },
                ].map((s, i) => (
                  <div key={i} className="bg-amazon-section rounded-xl p-4 text-center border border-amazon-border">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <p className="text-xl font-black text-amazon-accent">{s.value}</p>
                    <p className="text-xs text-amazon-text-secondary font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── MISSION ── */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>Why We Exist</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MISSION_CARDS.map((card, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm transition-all">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 text-lg ${card.color}`}>{card.icon}</div>
                <h3 className="text-sm font-black text-amazon-text mb-2">{card.title}</h3>
                <p className="text-xs text-amazon-text-secondary leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── TIMELINE ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>Our Journey</SectionTitle>
          <div className="relative">
            <div className="absolute left-[88px] top-0 bottom-0 w-0.5 bg-amazon-border hidden sm:block" />
            <div className="space-y-6">
              {TIMELINE.map((t, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="flex gap-6 items-start">
                  <div className="w-20 text-right flex-shrink-0">
                    <span className="text-sm font-black text-amazon-accent">{t.year}</span>
                  </div>
                  <div className="relative flex-shrink-0 hidden sm:block">
                    <div className="w-4 h-4 rounded-full bg-amazon-accent border-4 border-white shadow-md mt-0.5" />
                  </div>
                  <div className="bg-white border border-amazon-border rounded-xl p-4 flex-1 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-sm font-black text-amazon-text mb-1">{t.title}</h4>
                    <p className="text-xs text-amazon-text-secondary leading-relaxed">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── VALUES ── */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>Our Values</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((val, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -3 }}
                className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm flex items-start gap-4 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amazon-accent/10 border border-amazon-accent/20 flex items-center justify-center text-amazon-accent flex-shrink-0 text-base">
                  {val.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black text-amazon-text mb-1">{val.title}</h3>
                  <p className="text-xs text-amazon-text-secondary leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── TEAM ── */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>Meet the Team</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEAM.map((member, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm text-center transition-all">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} text-white font-black text-lg flex items-center justify-center mx-auto mb-3 shadow-md`}>
                  {member.avatar}
                </div>
                <h4 className="text-sm font-black text-amazon-text">{member.name}</h4>
                <p className="text-xs text-amazon-accent font-semibold mt-0.5 mb-2">{member.role}</p>
                <p className="text-xs text-amazon-text-secondary leading-relaxed">{member.bio}</p>
                <div className="flex justify-center gap-3 mt-3">
                  {[FaLinkedin, FaTwitter, FaGithub].map((Icon, j) => (
                    <button key={j} className="text-amazon-text-secondary hover:text-amazon-accent transition-colors">
                      <Icon size={13} />
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── TECH STACK ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <SectionTitle>Built With</SectionTitle>
          <div className="bg-white border border-amazon-border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap gap-3 justify-center">
              {TECH.map((t, i) => (
                <motion.div key={i} whileHover={{ scale: 1.08, y: -2 }}
                  className="flex items-center gap-2 bg-amazon-section border border-amazon-border px-4 py-2.5 rounded-xl text-sm font-bold text-amazon-text cursor-default">
                  <span className="text-base">{t.icon}</span> {t.name}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── CTA ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="relative bg-amazon-header rounded-3xl overflow-hidden p-10 text-center">
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: "radial-gradient(circle, #FF9900 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="relative">
              <p className="text-amazon-accent text-xs font-black uppercase tracking-widest mb-3">Join the Family</p>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                Shop smarter with <span className="text-amazon-accent">OneCart</span>
              </h2>
              <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
                Millions of Indians trust us every day. Discover quality products, unbeatable prices, and lightning-fast delivery.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <motion.a href="/" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 bg-amazon-accent hover:bg-amazon-accent-hover text-white font-black text-sm rounded-xl shadow-lg">
                  🛍️ Start Shopping
                </motion.a>
                <motion.a href="/contact" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-black text-sm rounded-xl border border-white/20">
                  📬 Contact Us
                </motion.a>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-6 rounded-full bg-amazon-accent" />
      <h2 className="text-xl font-black text-amazon-text">{children}</h2>
    </div>
  );
}
