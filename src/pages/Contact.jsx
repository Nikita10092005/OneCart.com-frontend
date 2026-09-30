import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import emailjs from "emailjs-com";
import API from "../services/api";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, ChevronRight, CheckCircle, Clock as ClockIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const faqs = [
  { q: "How long does delivery take?", a: "Standard delivery takes 3–5 business days. Express delivery is available at checkout." },
  { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy on all products." },
  { q: "How do I track my order?", a: "Once shipped, you'll receive a tracking link via email. You can also check the Orders page." },
  { q: "Do you offer customer support on weekends?", a: "Yes! Our support team is available 7 days a week, 9 AM – 8 PM IST." },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-amazon-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-amazon-section/50 transition text-left"
      >
        <span className="text-sm font-semibold text-amazon-text">{q}</span>
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight size={16} className="text-amazon-accent" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <p className="px-5 py-4 text-sm text-amazon-accent bg-amazon-section/30 border-t border-amazon-border">{a}</p>
      </motion.div>
    </div>
  );
}

function Contact() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [myQueries, setMyQueries] = useState([]);
  const heroRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (heroRef.current) gsap.fromTo(heroRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
    if (formRef.current) gsap.fromTo(formRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power3.out" });
  }, []);

  // Pre-fill email from logged-in user
  useEffect(() => {
    if (user) {
      setForm(f => ({ ...f, name: f.name || user.name || "", email: f.email || user.email || "" }));
      fetchMyQueries(user.email);
    }
  }, [user]);

  const fetchMyQueries = async (email) => {
    try {
      const res = await API.get(`/contact/user/${encodeURIComponent(email)}`);
      setMyQueries(res.data);
    } catch { /* silent */ }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await emailjs.send("service_3rcxxl2", "template_f69bk7x", form, "ILYTR7kEmE_jaqPS6");
      await API.post("/contact", form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      if (user?.email) fetchMyQueries(user.email);
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-amazon-section">

      {/* HERO BANNER */}
      <div ref={heroRef} className="relative bg-amazon-accent py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 40%)" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4"
          >
            <MessageCircle size={13} />
            We typically reply within 2 hours
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
            Get in Touch
          </h1>
          <p className="text-white/80 text-base max-w-md mx-auto">
            Have a question, feedback, or need help? We're here for you — always.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">

        {/* INFO CARDS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Mail size={20} />, title: "Email Us", value: "support@onecart.in", sub: "We reply within 2 hours" },
            { icon: <Phone size={20} />, title: "Call Us", value: "+91 98765 43210", sub: "Mon–Sat, 9 AM – 8 PM" },
            { icon: <MapPin size={20} />, title: "Our Office", value: "Mumbai, Maharashtra", sub: "India — 400001" },
            { icon: <Clock size={20} />, title: "Support Hours", value: "7 Days a Week", sub: "9 AM – 8 PM IST" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-amazon-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-amazon-border transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amazon-section flex items-center justify-center text-amazon-accent mb-3 group-hover:bg-amazon-accent group-hover:text-white transition-all">
                {item.icon}
              </div>
              <p className="text-xs font-bold text-amazon-accent uppercase tracking-widest mb-1">{item.title}</p>
              <p className="text-sm font-bold text-amazon-text">{item.value}</p>
              <p className="text-xs text-amazon-text-secondary mt-0.5">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* FORM + SIDEBAR */}
        <div ref={formRef} className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* CONTACT FORM */}
          <div className="lg:col-span-3 bg-white border border-amazon-border rounded-2xl p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-amazon-text">Send us a Message</h2>
              <p className="text-sm text-amazon-accent mt-1">Fill out the form and we'll get back to you shortly.</p>
            </div>

            {status === "success" && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
                ✅ Message sent! We'll be in touch soon.
              </motion.div>
            )}
            {status === "error" && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
                ❌ Something went wrong. Please try again.
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-amazon-accent uppercase tracking-widest mb-1.5">Your Name</label>
                  <input name="name" type="text" value={form.name} onChange={handleChange}
                    placeholder="Pankaj Kumar" required
                    className="w-full bg-amazon-section/40 border border-amazon-border text-amazon-text placeholder-amazon-text-secondary text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amazon-accent uppercase tracking-widest mb-1.5">Your Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com" required
                    className="w-full bg-amazon-section/40 border border-amazon-border text-amazon-text placeholder-amazon-text-secondary text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent focus:bg-white transition" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amazon-accent uppercase tracking-widest mb-1.5">Subject</label>
                <select name="subject" onChange={handleChange}
                  className="w-full bg-amazon-section/40 border border-amazon-border text-amazon-text text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent focus:bg-white transition">
                  <option value="">Select a topic...</option>
                  <option value="order">Order Issue</option>
                  <option value="return">Return / Refund</option>
                  <option value="payment">Payment Problem</option>
                  <option value="product">Product Query</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-amazon-accent uppercase tracking-widest mb-1.5">Your Message</label>
                <textarea name="message" value={form.message} onChange={handleChange}
                  placeholder="Describe your issue or question in detail..." rows={5} required
                  className="w-full bg-amazon-section/40 border border-amazon-border text-amazon-text placeholder-amazon-text-secondary text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent focus:bg-white transition resize-none" />
              </div>

              <motion.button type="submit" disabled={sending}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(117,132,103,0.35)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold rounded-xl text-sm shadow-lg shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-60">
                {sending ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <><Send size={15} /> Send Message</>
                )}
              </motion.button>
            </form>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-2 space-y-5">

            {/* QUICK LINKS */}
            <div className="bg-white border border-amazon-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-amazon-text mb-4">Quick Help</h3>
              <div className="space-y-2">
                {[
                  { label: "Track my order", href: "/track" },
                  { label: "Start a return", href: "/returns" },
                  { label: "View my orders", href: "/orders" },
                  { label: "FAQ", href: "/faq" },
                ].map((link) => (
                  <a key={link.label} href={link.href}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-amazon-section/50 hover:bg-amazon-section border border-transparent hover:border-amazon-border transition group">
                    <span className="text-sm font-medium text-amazon-text group-hover:text-amazon-accent transition">{link.label}</span>
                    <ChevronRight size={14} className="text-amazon-text-secondary group-hover:text-amazon-accent transition" />
                  </a>
                ))}
              </div>
            </div>

            {/* RESPONSE TIME CARD */}
            <div className="bg-amazon-accent rounded-2xl p-6 text-white shadow-lg shadow-black/10">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <MessageCircle size={20} />
              </div>
              <h3 className="font-extrabold text-base mb-1">Live Chat Available</h3>
              <p className="text-white/80 text-xs leading-relaxed mb-4">
                Use the chat bubble at the bottom-right for instant support from our team.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold bg-white/20 rounded-full px-3 py-1.5 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                Support Online Now
              </div>
            </div>
          </div>
        </div>

        {/* MY QUERIES — only for logged-in users */}
        {user && myQueries.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amazon-accent to-amazon-text-secondary" />
              <h2 className="text-xl font-extrabold text-amazon-text">My Previous Queries</h2>
            </div>
            <div className="space-y-3">
              {myQueries.map((q, i) => (
                <motion.div key={q._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white border border-amazon-border rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-amazon-accent">{new Date(q.createdAt).toLocaleDateString()}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      q.status === "replied" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      q.status === "closed"  ? "bg-gray-100 text-gray-500 border-gray-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {q.status === "replied" ? "✅ Replied" : q.status === "closed" ? "Closed" : "⏳ Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-amazon-text bg-amazon-section/50 rounded-xl p-3 mb-3">{q.message}</p>
                  {q.adminReply && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <p className="text-xs font-bold text-emerald-600 mb-1">Support Reply</p>
                      <p className="text-sm text-emerald-800">{q.adminReply}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ SECTION */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amazon-accent to-amazon-text-secondary" />
            <h2 className="text-xl font-extrabold text-amazon-text">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Contact;
