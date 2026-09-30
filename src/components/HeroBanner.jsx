import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { imgUrl } from "../utils/imageUrl";
import { Link, useNavigate } from "react-router-dom";

const slides = [
  { img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1600", badge: "New Arrivals", title: "Discover Deals Across Electronics & Fashion", sub: "Curated picks every day with fast delivery", link: "/home" },
  { img: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600", badge: "Up to 60% Off", title: "Trending Fashion at Best Prices", sub: "GenZ styles, premium brands, unbeatable deals", link: "/home?main=Fashion" },
  { img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600", badge: "Flash Sale", title: "Upgrade Your Lifestyle Today", sub: "Smart gadgets, home essentials and more", link: "/home?main=Electronics" },
];

const offerCards = [
  { title: "🔥 Top Electronics", imgs: ["iphone15.jpg","applewatch9.jpg","airpodsmax.jpg","dellxps13.jpg"], category: "Electronics", link: "See deals →" },
  { title: "💥 Fashion Sale",    imgs: ["silkkurta.jpg","designersaree.jpg","whitesneakers.jpg","navyblazer.jpg"], category: "Fashion", link: "Shop now →" },
  { title: "🎁 Kids Specials",   imgs: ["rccar.jpg","teddybear.jpg","kidsledshoes.jpg","artkit.jpg"], category: "Kids", link: "Explore →" },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subRef   = useRef(null);
  const btnRef   = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(badgeRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
      gsap.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: "power3.out" });
      gsap.fromTo(subRef.current,   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.25, ease: "power3.out" });
      gsap.fromTo(btnRef.current,   { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, delay: 0.35, ease: "back.out(1.7)" });
    });
    return () => ctx.revert();
  }, [current]);

  useEffect(() => {
    if (!cardsRef.current) return;
    gsap.fromTo(
      cardsRef.current.children,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  const s = slides[current];

  return (
    <div className="px-3 sm:px-6 pt-4 sm:pt-5">

      {/* SLIDER */}
      <div className="relative h-[220px] sm:h-[320px] md:h-[400px] lg:h-[460px] rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
        <AnimatePresence mode="wait">
          <motion.div key={current}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
            className="absolute inset-0">
            <img src={s.img} alt={s.badge} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
            <div className="absolute inset-0 z-10 flex flex-col justify-center px-5 sm:px-10 md:px-14 max-w-xl sm:max-w-2xl">
              <span ref={badgeRef} className="inline-block text-xs font-bold bg-amazon-accent text-amazon-text px-3 py-1 rounded-full mb-2 sm:mb-4 w-fit shadow-lg">
                {s.badge}
              </span>
              <h1 ref={titleRef} className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-2 sm:mb-3 drop-shadow-lg">
                {s.title}
              </h1>
              <p ref={subRef} className="text-slate-200 text-xs sm:text-sm md:text-base mb-4 sm:mb-7 drop-shadow hidden sm:block">
                {s.sub}
              </p>
              <motion.button ref={btnRef}
                onClick={() => navigate(slides[current].link)}
                whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(255,153,0,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="w-fit bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-xl shadow-lg text-xs sm:text-sm cursor-pointer">
                Shop Now →
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ARROWS */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => setCurrent(p => p === 0 ? slides.length - 1 : p - 1)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 backdrop-blur border border-white/25 text-white flex items-center justify-center hover:bg-white/25 transition">
          <FaChevronLeft size={11} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => setCurrent(p => (p + 1) % slides.length)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 backdrop-blur border border-white/25 text-white flex items-center justify-center hover:bg-white/25 transition">
          <FaChevronRight size={11} />
        </motion.button>

        {/* DOTS */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <motion.button key={i} onClick={() => setCurrent(i)}
              animate={{ width: i === current ? 24 : 6, backgroundColor: i === current ? "#ffffff" : "rgba(255,255,255,0.4)" }}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full" />
          ))}
        </div>
      </div>

      {/* OFFER CARDS */}
      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
        {offerCards.map((card, i) => (
          <motion.div key={i}
            whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white border border-amazon-border rounded-2xl p-3 sm:p-4 cursor-pointer group">
            <h3 className="text-sm font-bold text-amazon-text mb-2 sm:mb-3">{card.title}</h3>
            <div className="grid grid-cols-4 sm:grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              {card.imgs.map((img, j) => (
                <div key={j} className="w-full h-14 sm:h-24 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                  <img src={imgUrl(img)} alt=""
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
            <Link
              to={`/search?category=${encodeURIComponent(card.category)}`}
              className="inline-block text-xs font-semibold text-amazon-accent hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amazon-accent focus-visible:ring-offset-2"
            >
              {card.link}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
