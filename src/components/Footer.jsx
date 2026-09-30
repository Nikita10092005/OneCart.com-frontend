import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";

const cols = [
  {
    title: "Get to Know Us",
    links: [
      { label: "About OneCart", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Press Releases", to: "/press" },
      { label: "OneCart Science", to: "/science" },
    ]
  },
  {
    title: "Make Money with Us",
    links: [
      { label: "Sell on OneCart", to: "/sell" },
      { label: "Sell Under OneCart", to: "/sell-under" },
      { label: "Become an Affiliate", to: "/affiliate" },
      { label: "Advertise Your Products", to: "/advertise" },
    ]
  },
  {
    title: "OneCart Payment",
    links: [
      { label: "OneCart Business Card", to: "/business-card" },
      { label: "Shop with Points", to: "/rewards" },
      { label: "Reload Your Balance", to: "/reload-balance" },
      { label: "Currency Converter", to: "/currency-converter" },
    ]
  },
  {
    title: "Let Us Help You",
    links: [
      { label: "Your Account", to: "/profile" },
      { label: "Your Orders", to: "/orders" },
      { label: "Shipping Rates", to: "/shipping" },
      { label: "Returns & Replacements", to: "/returns" },
      { label: "Help", to: "/faq" },
    ]
  },
];

const SOCIAL_LINKS = [
  { icon: <FaFacebook />, color: "hover:text-blue-300",  href: "https://facebook.com" },
  { icon: <FaInstagram />, color: "hover:text-pink-300", href: "https://instagram.com" },
  { icon: <FaTwitter />,  color: "hover:text-sky-300",   href: "https://twitter.com" },
  { icon: <FaYoutube />,  color: "hover:text-red-300",   href: "https://youtube.com" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showToast, setShowToast] = useState(false);

  async function handleSubscribe() {
    if (!email) {
      setEmailError("Please enter your email address");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setEmailError("");
    try {
      await API.post("/newsletter", { email: email.trim() });
      setSubscribed(true);
      setEmail("");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setEmailError(error.response?.data?.message || "Unable to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="bg-amazon-header text-white mt-12">

      {/* BACK TO TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full bg-amazon-subheader hover:bg-amazon-header text-white hover:text-amazon-accent text-sm font-medium py-3.5 transition-colors text-center">
        Back to top
      </button>

      {/* MAIN LINKS GRID */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border-b border-white/10">
        {cols.map(col => (
          <div key={col.title}>
            <h4 className="text-white font-bold text-sm mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map(l => (
                <li key={l.label}>
                  <Link to={l.to}
                    className="text-[#DDDDDD] text-sm hover:text-amazon-accent hover:underline transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* MIDDLE — LOGO + CONTACT + SOCIAL */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col sm:flex-wrap sm:flex-row items-start justify-between gap-6 sm:gap-8 border-b border-white/10">

        {/* LOGO */}
        <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-amazon-accent flex items-center justify-center shadow-lg">
            <HiSparkles className="text-amazon-text text-sm" />
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-black text-white">One</span>
            <span className="text-2xl font-black text-amazon-accent">Cart</span>
            <span className="text-xs font-semibold text-white/40 ml-0.5">.com</span>
          </div>
        </div>

        {/* CONTACT */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-sm mb-1">Contact Us</h4>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <FaMapMarkerAlt className="text-amazon-accent flex-shrink-0" />
            <span>123 Commerce Street, Mumbai, India</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <FaPhone className="text-amazon-accent flex-shrink-0" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <FaEnvelope className="text-amazon-accent flex-shrink-0" />
            <span>support@onecart.com</span>
          </div>
        </div>

        {/* NEWSLETTER + SOCIAL */}
        <div className="flex flex-col gap-4 w-full sm:min-w-[260px] sm:max-w-xs">
          <h4 className="text-white font-bold text-sm">Stay Updated</h4>
          <div className="flex gap-2">
            <input
              type="email"
              aria-label="Newsletter email"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError(""); }}
              placeholder="Enter your email"
              className="min-w-0 flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-amazon-accent transition" />
            <button
              onClick={handleSubscribe}
              disabled={loading || subscribed}
              className={`text-amazon-text text-sm font-bold px-4 py-2.5 rounded-lg transition whitespace-nowrap
                ${subscribed ? "bg-emerald-500 cursor-not-allowed" : "bg-amazon-accent hover:bg-amazon-accent-hover"}
                ${loading ? "opacity-60 cursor-not-allowed" : ""}
              `}>
              {subscribed ? "Subscribed ✓" : loading ? "Subscribing…" : "Subscribe"}
            </button>
          </div>
          {emailError && (
            <p className="text-red-400 text-xs -mt-2">{emailError}</p>
          )}
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white ${s.color} hover:border-current transition-all`}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-amazon-subheader py-4 sm:py-5 px-4 sm:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 sm:gap-4">

          {/* LOGO SMALL */}
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black text-white">One</span>
            <span className="text-sm font-black text-amazon-accent">Cart</span>
            <span className="text-xs text-white/40">.com</span>
          </div>

          {/* BOTTOM LINKS */}
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Conditions of Use", to: "/conditions" },
              { label: "Privacy Notice", to: "/privacy" },
              { label: "Interest-Based Ads", to: "/interest-ads" },
            ].map(l => (
              <Link key={l.label} to={l.to}
                className="text-xs text-white/50 hover:text-amazon-accent hover:underline transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* COPYRIGHT */}
          <p className="text-xs text-white/40">
            © 2026 OneCart.com. All rights reserved.
          </p>
        </div>
      </div>

      {/* TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg">
            You're subscribed! Thanks for joining.
          </motion.div>
        )}
      </AnimatePresence>

    </footer>
  );
}
