import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Search, ShoppingCart, CreditCard, Truck, RotateCcw, Shield, Star, MessageSquare, ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "orders",
    icon: ShoppingCart,
    label: "Orders",
    color: "bg-amazon-accent/10 text-amazon-accent border-amazon-accent/20",
    faqs: [
      { q: "How do I place an order?", a: "Browse products, add items to your cart, then click 'Proceed to Checkout'. Fill in your delivery details, choose a payment method, and confirm your order. You'll receive a confirmation email instantly." },
      { q: "Can I modify or cancel my order after placing it?", a: "You can cancel an order from My Orders page as long as it hasn't been shipped yet. Once shipped, cancellation is not possible but you can initiate a return after delivery." },
      { q: "How do I know if my order was placed successfully?", a: "You'll receive a confirmation email with your Order ID. You can also check My Orders in your account to see the order status." },
      { q: "Can I place an order without creating an account?", a: "Currently, an account is required to place orders. This helps us keep your order history, manage returns, and send you tracking updates." },
      { q: "Is there a minimum order value?", a: "There is no minimum order value. However, orders above ₹499 qualify for free delivery. Orders below ₹499 have a flat ₹49 delivery charge." },
    ],
  },
  {
    id: "payments",
    icon: CreditCard,
    label: "Payments",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    faqs: [
      { q: "What payment methods are accepted?", a: "We accept UPI (GPay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, and Cash on Delivery (COD) for eligible orders." },
      { q: "Is it safe to save my card details?", a: "Yes. We use Razorpay's secure vault which is PCI-DSS compliant. Your card details are encrypted and never stored on our servers." },
      { q: "Why was my payment declined?", a: "Payments can fail due to insufficient funds, incorrect card details, bank restrictions, or network issues. Try a different payment method or contact your bank. Your money is not deducted on failed transactions." },
      { q: "Can I use multiple payment methods for one order?", a: "Currently, only one payment method can be used per order. However, you can use OneCart Wallet credits along with another payment method." },
      { q: "When will I be charged for my order?", a: "For online payments, you're charged immediately at checkout. For COD orders, payment is collected at the time of delivery." },
    ],
  },
  {
    id: "delivery",
    icon: Truck,
    label: "Delivery",
    color: "bg-orange-50 text-orange-600 border-orange-200",
    faqs: [
      { q: "How long does delivery take?", a: "Standard delivery takes 3–7 business days depending on your location. Metro cities typically receive orders in 2–4 days. You'll receive tracking updates via email and in-app notifications." },
      { q: "How can I track my order?", a: "Go to the Track Order page or My Orders section. You can see real-time status — Ordered, Packed, Shipped, or Delivered — along with timestamps for each stage." },
      { q: "Is free delivery available?", a: "Yes! Orders above ₹499 get free delivery. For orders below ₹499, a flat ₹49 delivery charge applies." },
      { q: "What if I'm not available at the time of delivery?", a: "Our delivery partner will attempt delivery up to 3 times. You'll receive a call before delivery. If all attempts fail, the order is returned and a full refund is processed." },
      { q: "Do you deliver to all locations in India?", a: "We deliver to most pin codes across India. Enter your pin code at checkout to check availability. Some remote areas may have longer delivery times." },
    ],
  },
  {
    id: "returns",
    icon: RotateCcw,
    label: "Returns & Refunds",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    faqs: [
      { q: "What is the return policy?", a: "You can return eligible items within 7 days of delivery. Items must be unused, in original packaging, with all tags intact. Damaged, used, or customised items are not eligible." },
      { q: "How do I initiate a return?", a: "Go to My Orders, select the delivered order, and click 'Request Refund'. Choose your reason, and our team will arrange a free pickup within 2–3 business days." },
      { q: "How long does a refund take?", a: "Once the returned item passes quality check (1–2 days), refunds are processed within 5–7 business days to your original payment method. COD refunds are transferred to your bank account." },
      { q: "Can I exchange an item instead of returning it?", a: "Yes! You can request an exchange for the same product in a different size or colour. Select 'Exchange' when initiating the return from My Orders." },
      { q: "What if I received a damaged or wrong item?", a: "We're sorry about that! Please initiate a return immediately with photos of the item. Damaged or wrong item returns are prioritised and refunds are processed within 3 business days." },
    ],
  },
  {
    id: "account",
    icon: Shield,
    label: "Account & Security",
    color: "bg-purple-50 text-purple-600 border-purple-200",
    faqs: [
      { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page and enter your registered email. You'll receive a reset link within a few minutes. Check your spam folder if you don't see it." },
      { q: "Can I change my email address?", a: "Yes, go to Profile > Account Settings to update your email. You'll need to verify the new email address before the change takes effect." },
      { q: "How do I delete my account?", a: "To delete your account, contact our support team at support@onecart.com. Note that account deletion is permanent and all order history will be lost." },
      { q: "Is my personal data safe?", a: "Absolutely. We follow strict data protection practices and never sell your data to third parties. Read our Privacy Policy for full details." },
    ],
  },
  {
    id: "rewards",
    icon: Star,
    label: "Rewards & Offers",
    color: "bg-yellow-50 text-yellow-600 border-yellow-200",
    faqs: [
      { q: "How does the rewards program work?", a: "You earn 1 point for every ₹10 spent on products. Points can be redeemed for discounts on future orders. 100 points = ₹10 discount." },
      { q: "Do reward points expire?", a: "Points are valid for 12 months from the date they were earned. Points earned from cancelled or returned orders are automatically reversed." },
      { q: "How do I apply a coupon code?", a: "Enter your coupon code in the 'Promo Code' section at checkout. Valid coupons are applied automatically and the discount is shown in your order summary." },
      { q: "Why is my coupon not working?", a: "Coupons may not work if they've expired, the minimum order value isn't met, or the coupon is not applicable to items in your cart. Check the coupon terms or contact support." },
    ],
  },
];

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border border-amazon-border rounded-xl overflow-hidden bg-white"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-amazon-section/40 transition gap-4"
      >
        <span className="text-sm font-semibold text-amazon-text">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
          <ChevronDown size={16} className="text-amazon-text-secondary" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 pt-3 text-sm text-amazon-text-secondary leading-relaxed border-t border-amazon-border">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("orders");
  const [searchQuery, setSearchQuery] = useState("");

  const currentCategory = CATEGORIES.find(c => c.id === activeCategory);

  const searchResults = searchQuery.trim().length > 1
    ? CATEGORIES.flatMap(cat =>
        cat.faqs
          .filter(f =>
            f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.a.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(f => ({ ...f, category: cat.label }))
      )
    : [];

  const totalFaqs = CATEGORIES.reduce((sum, c) => sum + c.faqs.length, 0);

  return (
    <div className="min-h-screen bg-amazon-section">

      {/* HERO */}
      <div className="bg-amazon-header text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-amazon-accent text-sm font-bold uppercase tracking-widest mb-3">Help Center</p>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
              How can we <span className="text-amazon-accent">help you?</span>
            </h1>
            <p className="text-white/60 text-sm mb-7">
              {totalFaqs} answers across {CATEGORIES.length} categories
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amazon-text-secondary" />
              <input
                type="text"
                placeholder="Search your question..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-amazon-border text-amazon-text placeholder-amazon-text-secondary text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Search results */}
        {searchQuery.trim().length > 1 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-sm text-amazon-text-secondary mb-4">
              {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "<span className="font-semibold text-amazon-text">{searchQuery}</span>"
            </p>
            {searchResults.length === 0 ? (
              <div className="bg-white border border-amazon-border rounded-2xl p-10 text-center shadow-sm">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-bold text-amazon-text mb-1">No results found</p>
                <p className="text-sm text-amazon-text-secondary">Try different keywords or browse categories below</p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map((item, i) => (
                  <div key={i}>
                    <p className="text-xs text-amazon-accent font-bold uppercase tracking-widest mb-1 px-1">{item.category}</p>
                    <FAQItem q={item.q} a={item.a} index={i} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <>
            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const active = activeCategory === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all
                      ${active
                        ? "bg-amazon-accent text-amazon-text border-amazon-accent shadow-md"
                        : "bg-white text-amazon-text-secondary border-amazon-border hover:border-amazon-accent hover:text-amazon-accent"}`}
                  >
                    <Icon size={13} />
                    {cat.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black
                      ${active ? "bg-amazon-text/20" : "bg-amazon-section"}`}>
                      {cat.faqs.length}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Category header */}
            {currentCategory && (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {(() => {
                  const Icon = currentCategory.icon;
                  return (
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${currentCategory.color}`}>
                      <Icon size={18} />
                      <div>
                        <p className="text-sm font-bold">{currentCategory.label}</p>
                        <p className="text-xs opacity-70">{currentCategory.faqs.length} questions</p>
                      </div>
                    </div>
                  );
                })()}

                <div className="space-y-2">
                  {currentCategory.faqs.map((faq, i) => (
                    <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Popular topics */}
        {!searchQuery && (
          <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full bg-amazon-accent" />
              <h2 className="text-base font-extrabold text-amazon-text">Popular Topics</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: "📦", label: "Track my order",     action: () => navigate("/track") },
                { icon: "↩️", label: "Return an item",     action: () => navigate("/returns") },
                { icon: "💳", label: "Payment issues",     action: () => setActiveCategory("payments") },
                { icon: "🚚", label: "Delivery info",      action: () => setActiveCategory("delivery") },
                { icon: "🎁", label: "Rewards & coupons",  action: () => setActiveCategory("rewards") },
                { icon: "🔐", label: "Account & security", action: () => setActiveCategory("account") },
              ].map((topic, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={topic.action}
                  className="bg-white border border-amazon-border rounded-xl p-4 text-left flex items-center gap-3 hover:border-amazon-accent transition-all shadow-sm"
                >
                  <span className="text-xl">{topic.icon}</span>
                  <span className="text-sm font-semibold text-amazon-text">{topic.label}</span>
                  <ArrowRight size={13} className="text-amazon-text-secondary ml-auto flex-shrink-0" />
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        {/* Still need help */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-amazon-header rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amazon-accent flex items-center justify-center flex-shrink-0">
              <MessageSquare size={22} className="text-amazon-text" />
            </div>
            <div>
              <h3 className="font-bold text-base mb-0.5">Still can't find your answer?</h3>
              <p className="text-white/60 text-sm">Our support team is available 9 AM – 9 PM, 7 days a week.</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/contact")}
            className="bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 flex-shrink-0 shadow-lg"
          >
            Contact Support <ArrowRight size={14} />
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}
