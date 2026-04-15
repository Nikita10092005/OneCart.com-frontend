import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBriefcase, FaChartLine, FaHome, FaStar, FaMapMarkerAlt,
  FaClock, FaTimes, FaCheckCircle, FaRupeeSign, FaUsers,
  FaLaptopCode, FaDatabase, FaMobileAlt, FaShieldAlt,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DEPARTMENTS = ["All", "Engineering", "Product", "Data", "Design", "Operations"];

const JOBS = [
  { title: "Senior Frontend Engineer",   dept: "Engineering", location: "Mumbai",    type: "Full-time", salary: "₹25–40 LPA", icon: <FaLaptopCode />,  color: "bg-blue-50 border-blue-200 text-blue-600",    desc: "Build beautiful, performant UIs with React and Tailwind. Own the customer-facing experience for millions of users.", skills: ["React", "TypeScript", "Tailwind", "Framer Motion"] },
  { title: "Backend Engineer",           dept: "Engineering", location: "Remote",    type: "Full-time", salary: "₹20–35 LPA", icon: <FaDatabase />,     color: "bg-emerald-50 border-emerald-200 text-emerald-600", desc: "Design and scale Node.js APIs and microservices that power millions of daily transactions.", skills: ["Node.js", "MongoDB", "Redis", "AWS"] },
  { title: "Product Manager",            dept: "Product",     location: "Mumbai",    type: "Full-time", salary: "₹30–50 LPA", icon: <FaBriefcase />,    color: "bg-purple-50 border-purple-200 text-purple-600",   desc: "Drive product strategy, work cross-functionally, and ship features that delight users at scale.", skills: ["Product Strategy", "Analytics", "Roadmapping", "A/B Testing"] },
  { title: "Data Scientist",             dept: "Data",        location: "Remote",    type: "Full-time", salary: "₹22–38 LPA", icon: <FaChartLine />,    color: "bg-amber-50 border-amber-200 text-amber-600",      desc: "Build ML models for recommendations, pricing, and demand forecasting at scale.", skills: ["Python", "TensorFlow", "SQL", "Spark"] },
  { title: "Mobile Engineer (React Native)", dept: "Engineering", location: "Bangalore", type: "Full-time", salary: "₹18–30 LPA", icon: <FaMobileAlt />, color: "bg-pink-50 border-pink-200 text-pink-600",       desc: "Build and maintain our iOS and Android apps used by millions of shoppers across India.", skills: ["React Native", "TypeScript", "Redux", "Firebase"] },
  { title: "Security Engineer",          dept: "Engineering", location: "Remote",    type: "Full-time", salary: "₹28–45 LPA", icon: <FaShieldAlt />,   color: "bg-red-50 border-red-200 text-red-500",            desc: "Protect our platform and customer data. Lead security audits, pen testing, and incident response.", skills: ["Penetration Testing", "AWS Security", "OWASP", "DevSecOps"] },
];

const CULTURE = [
  { icon: <FaChartLine />, title: "Grow Fast",       desc: "We move quickly and give you real ownership. You'll ship meaningful work from day one.",                  color: "bg-amazon-accent/10 border-amazon-accent/20 text-amazon-accent" },
  { icon: <FaHome />,      title: "Work Flexibly",   desc: "Remote-friendly culture with flexible hours. We care about output, not where you sit.",                   color: "bg-blue-50 border-blue-200 text-blue-600" },
  { icon: <FaStar />,      title: "Make Impact",     desc: "Your work reaches millions of Indians every day. The scale of impact here is real.",                       color: "bg-purple-50 border-purple-200 text-purple-600" },
  { icon: <FaUsers />,     title: "Great Team",      desc: "Work alongside ex-Flipkart, Amazon, and Google engineers who love what they build.",                       color: "bg-emerald-50 border-emerald-200 text-emerald-600" },
  { icon: <FaRupeeSign />, title: "Top Pay",         desc: "Competitive salaries, ESOPs, health insurance, and annual performance bonuses.",                          color: "bg-amber-50 border-amber-200 text-amber-600" },
  { icon: <FaLaptopCode />, title: "Best Tools",     desc: "MacBook Pro, ₹50K learning budget, premium software subscriptions — everything you need to do great work.", color: "bg-pink-50 border-pink-200 text-pink-600" },
];

const PERKS = [
  { emoji: "🏥", label: "Health Insurance" },
  { emoji: "📚", label: "₹50K Learning Budget" },
  { emoji: "💻", label: "MacBook Pro" },
  { emoji: "🏖️", label: "Unlimited PTO" },
  { emoji: "🍔", label: "Free Meals" },
  { emoji: "📈", label: "ESOPs" },
  { emoji: "🏋️", label: "Gym Membership" },
  { emoji: "🌍", label: "Remote Friendly" },
];

const EMPTY_FORM = { name: "", email: "", phone: "", experience: "", skills: "", education: "", portfolio: "", coverLetter: "" };
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

export default function Careers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeDept, setActiveDept] = useState("All");
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const openForm = (job) => {
    if (!user) { navigate("/login"); return; }
    setSelectedJob(job);
    setForm({ ...EMPTY_FORM, name: user.name || "", email: user.email || "" });
    setSubmitted(false);
    setError("");
  };

  const closeForm = () => { setSelectedJob(null); setSubmitted(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/jobs", { ...form, position: selectedJob.title });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const inputCls = "w-full border border-amazon-border rounded-xl px-4 py-3 text-sm text-amazon-text focus:outline-none focus:border-amazon-accent focus:ring-2 focus:ring-amazon-accent/20 transition bg-white";

  const filtered = activeDept === "All" ? JOBS : JOBS.filter(j => j.dept === activeDept);

  return (
    <>
      <div className="min-h-screen bg-amazon-section">

        {/* HERO */}
        <div className="relative bg-amazon-header overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #FF9900 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-amazon-accent/10 rounded-full blur-3xl" />
          <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 bg-amazon-accent/10 border border-amazon-accent/20 text-amazon-accent text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                <FaBriefcase /> We're Hiring
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
                Build the Future of<br /><span className="text-amazon-accent">Indian Commerce</span>
              </h1>
              <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Join a team that's redefining how India shops. We're building fast, thinking big, and hiring people who care deeply about their craft.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3 mt-8">
              {[`🧑‍💻 ${JOBS.length} Open Roles`, "🌍 Remote Friendly", "📈 Fast Growth", "💰 Top Pay"].map((b, i) => (
                <span key={i} className="bg-white/10 border border-white/10 text-white/80 text-xs font-semibold px-4 py-2 rounded-full">{b}</span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* PERKS STRIP */}
        <div className="bg-amazon-accent overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-6">
            {PERKS.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-white text-sm font-semibold">
                <span>{p.emoji}</span> {p.label}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-14 space-y-16">

          {/* OPEN POSITIONS */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionTitle>Open Positions</SectionTitle>

            {/* Dept filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {DEPARTMENTS.map(d => (
                <button key={d} onClick={() => setActiveDept(d)}
                  className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                    activeDept === d ? "bg-amazon-accent text-white border-amazon-accent" : "bg-white text-amazon-text-secondary border-amazon-border hover:border-amazon-accent"
                  }`}>
                  {d} {d === "All" ? `(${JOBS.length})` : `(${JOBS.filter(j => j.dept === d).length})`}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((job, i) => (
                  <motion.div key={job.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                    className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-base flex-shrink-0 ${job.color}`}>
                        {job.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-sm font-black text-amazon-text">{job.title}</h3>
                          <span className="text-[10px] bg-amazon-section border border-amazon-border text-amazon-text-secondary px-2 py-0.5 rounded-full font-medium">{job.dept}</span>
                        </div>
                        <p className="text-xs text-amazon-text-secondary leading-relaxed mb-3">{job.desc}</p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {job.skills.map(s => (
                            <span key={s} className="text-[10px] bg-amazon-accent/10 text-amazon-accent border border-amazon-accent/20 px-2 py-0.5 rounded-full font-bold">{s}</span>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1 text-xs bg-amazon-section border border-amazon-border text-amazon-text-secondary px-2.5 py-1 rounded-full">
                            <FaMapMarkerAlt className="text-amazon-accent" size={9} /> {job.location}
                          </span>
                          <span className="flex items-center gap-1 text-xs bg-amazon-section border border-amazon-border text-amazon-text-secondary px-2.5 py-1 rounded-full">
                            <FaClock className="text-amazon-accent" size={9} /> {job.type}
                          </span>
                          <span className="flex items-center gap-1 text-xs bg-emerald-50 border border-emerald-200 text-emerald-600 px-2.5 py-1 rounded-full font-bold">
                            <FaRupeeSign size={9} /> {job.salary}
                          </span>
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => openForm(job)}
                        className="flex-shrink-0 text-xs font-black text-white bg-amazon-accent hover:bg-amazon-accent-hover px-5 py-2.5 rounded-xl shadow-sm transition self-start sm:self-center">
                        Apply Now →
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* WHY ONECART */}
          <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionTitle>Why OneCart?</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CULTURE.map((card, i) => (
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

          {/* HIRING PROCESS */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionTitle>Our Hiring Process</SectionTitle>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-amazon-border" />
              <div className="space-y-6 pl-14">
                {[
                  { step: "1", title: "Apply Online",        desc: "Submit your application with resume and cover letter. Takes less than 5 minutes.",    time: "Day 1" },
                  { step: "2", title: "Screening Call",      desc: "30-min call with our recruiter to discuss your background and the role.",              time: "Day 3–5" },
                  { step: "3", title: "Technical Interview", desc: "1–2 rounds of technical assessment relevant to your role.",                            time: "Day 7–10" },
                  { step: "4", title: "Culture Fit Round",   desc: "Meet the team and discuss values, working style, and long-term goals.",                time: "Day 12–14" },
                  { step: "5", title: "Offer",               desc: "We move fast. Expect an offer within 48 hours of your final round.",                   time: "Day 15–16" },
                ].map((s, i) => (
                  <motion.div key={i} variants={fadeUp} className="relative flex items-start gap-4">
                    <div className="absolute -left-14 w-10 h-10 rounded-full bg-amazon-accent text-white font-black text-sm flex items-center justify-center shadow-md">
                      {s.step}
                    </div>
                    <div className="bg-white border border-amazon-border rounded-xl p-4 flex-1 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-black text-amazon-text">{s.title}</h4>
                        <span className="text-[10px] bg-amazon-section border border-amazon-border text-amazon-text-secondary px-2 py-0.5 rounded-full font-medium">{s.time}</span>
                      </div>
                      <p className="text-xs text-amazon-text-secondary leading-relaxed">{s.desc}</p>
                    </div>
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
              <p className="text-amazon-accent text-xs font-black uppercase tracking-widest mb-3">Don't see your role?</p>
              <h2 className="text-2xl font-black text-white mb-3">We're always looking for great people</h2>
              <p className="text-white/60 text-sm max-w-md mx-auto mb-6">Send us your resume and we'll reach out when the right opportunity opens up.</p>
              <a href="mailto:careers@onecart.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amazon-accent hover:bg-amazon-accent-hover text-white font-black text-sm rounded-xl shadow-lg transition">
                📬 careers@onecart.com
              </a>
            </div>
          </motion.div>

        </div>
      </div>

      {/* APPLICATION MODAL */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={e => { if (e.target === e.currentTarget) closeForm(); }}>
            <motion.div initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: "90vh" }}>

              <div className="bg-amazon-header rounded-t-3xl px-6 py-5 flex items-center justify-between flex-shrink-0">
                <div>
                  <p className="text-amazon-accent text-xs font-black uppercase tracking-widest mb-1">Job Application</p>
                  <h2 className="text-xl font-black text-white">{selectedJob.title}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-white/50 text-xs flex items-center gap-1"><FaMapMarkerAlt size={10} /> {selectedJob.location}</span>
                    <span className="text-white/50 text-xs flex items-center gap-1"><FaClock size={10} /> {selectedJob.type}</span>
                    <span className="text-amazon-accent text-xs font-bold">{selectedJob.salary}</span>
                  </div>
                </div>
                <button onClick={closeForm} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
                  <FaTimes size={14} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6">
                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                      <FaCheckCircle className="text-emerald-500 text-3xl" />
                    </div>
                    <h3 className="text-lg font-black text-amazon-text">Application Submitted!</h3>
                    <p className="text-sm text-amazon-text-secondary max-w-sm">
                      Thanks for applying for <span className="font-bold text-amazon-text">{selectedJob.title}</span>. We'll review your application and get back to you within 5 business days.
                    </p>
                    <button onClick={closeForm} className="mt-2 bg-amazon-accent text-white font-black px-6 py-2.5 rounded-xl text-sm hover:bg-amazon-accent-hover transition">
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-3">Personal Information</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[["Full Name *", "name", "text", "Pankaj Katal"], ["Email *", "email", "email", "you@example.com"],
                          ["Phone *", "phone", "tel", "+91 98765 43210"], ["Portfolio / LinkedIn", "portfolio", "url", "https://linkedin.com/in/..."]
                        ].map(([label, field, type, ph]) => (
                          <div key={field}>
                            <label className="text-xs font-bold text-amazon-text mb-1 block">{label}</label>
                            <input required={label.includes("*")} type={type} value={form[field]} onChange={set(field)} placeholder={ph} className={inputCls} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-3">Professional Details</p>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-amazon-text mb-1 block">Years of Experience *</label>
                          <select required value={form.experience} onChange={set("experience")} className={inputCls}>
                            <option value="">Select experience</option>
                            {["Fresher (0 years)", "1–2 years", "3–5 years", "5–8 years", "8+ years"].map(o => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-amazon-text mb-1 block">Technical Skills *</label>
                          <input required value={form.skills} onChange={set("skills")} placeholder="e.g. React, Node.js, MongoDB..." className={inputCls} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-amazon-text mb-1 block">Education *</label>
                          <input required value={form.education} onChange={set("education")} placeholder="e.g. B.Tech CS, IIT Delhi, 2022" className={inputCls} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-3">Cover Letter</p>
                      <textarea required rows={4} value={form.coverLetter} onChange={set("coverLetter")}
                        placeholder="Why are you a great fit? What have you built that you're proud of?"
                        className={`${inputCls} resize-none`} />
                    </div>
                    {error && <p className="text-red-500 text-xs font-medium">⚠ {error}</p>}
                    <div className="flex gap-3 pt-1">
                      <button type="button" onClick={closeForm}
                        className="flex-1 border border-amazon-border text-amazon-text font-bold py-3 rounded-xl text-sm hover:bg-amazon-section transition">
                        Cancel
                      </button>
                      <button type="submit" disabled={loading}
                        className="flex-1 bg-amazon-accent hover:bg-amazon-accent-hover disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm transition flex items-center justify-center gap-2">
                        {loading ? (
                          <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Submitting…</>
                        ) : "Submit Application"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
