import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWallet, FaMobileAlt, FaUniversity, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const RELOAD_OPTIONS = [
  { id: "upi",     icon: <FaMobileAlt />,  title: "UPI",         badge: "Instant", fee: "No charges",         color: "border-emerald-200", iconBg: "bg-emerald-50 text-emerald-600", badgeColor: "bg-emerald-100 text-emerald-700" },
  { id: "netbank", icon: <FaUniversity />, title: "Net Banking",  badge: "Instant", fee: "No charges",         color: "border-blue-200",    iconBg: "bg-blue-50 text-blue-600",       badgeColor: "bg-blue-100 text-blue-700" },
  { id: "debit",   icon: <FaCreditCard />, title: "Debit Card",   badge: "Instant", fee: "₹2 convenience fee", color: "border-orange-200",  iconBg: "bg-orange-50 text-orange-600",   badgeColor: "bg-orange-100 text-orange-700" },
];

const QUICK_AMOUNTS = [100, 250, 500, 1000, 2000];
const MAX_WALLET = 10000;

function loadRazorpayScript() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function ReloadBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null); // { type: "success"|"error", msg }
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);
  const [txError, setTxError] = useState(null);

  // Fetch real wallet balance
  useEffect(() => {
    if (!user) return;
    API.get("/wallet/balance")
      .then(r => setBalance(r.data.balance))
      .catch(() => setBalance(0));
  }, [user]);

  // Fetch transaction history
  useEffect(() => {
    if (!user) return;
    API.get("/wallet/transactions")
      .then(r => setTransactions(r.data || []))
      .catch(() => setTxError("Failed to load transaction history."))
      .finally(() => setTxLoading(false));
  }, [user]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleReload = async () => {
    const amt = Number(amount);
    if (!amt || amt < 10) { setError("Minimum reload amount is ₹10"); return; }
    if (amt > MAX_WALLET) { setError("Maximum reload amount is ₹10,000"); return; }
    if ((balance || 0) + amt > MAX_WALLET) { setError(`This would exceed the ₹${MAX_WALLET} wallet limit`); return; }

    setError("");
    setLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Could not load payment gateway. Check your internet connection.");
      setLoading(false);
      return;
    }

    let razorpayOrder;
    try {
      const { data } = await API.post("/wallet/create-order", { amount: amt });
      if (!data.success) throw new Error(data.message);
      razorpayOrder = data.order;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate payment");
      setLoading(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "OneCart Wallet",
      description: `Add ₹${amt} to your wallet`,
      order_id: razorpayOrder.id,
      handler: async (response) => {
        try {
          const { data } = await API.post("/wallet/verify", {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
            amount: amt,
          });
          if (data.success) {
            setBalance(data.balance);
            setAmount("");
            showToast("success", `₹${amt} added to your wallet successfully!`);
          } else {
            showToast("error", data.message || "Payment verification failed");
          }
        } catch {
          showToast("error", "Payment verification failed. Contact support.");
        }
        setLoading(false);
      },
      modal: { ondismiss: () => setLoading(false) },
      prefill: { name: user?.name || "", email: user?.email || "" },
      theme: { color: "#F59E0B" },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="min-h-screen bg-amazon-section">
      {/* HERO */}
      <div className="bg-amazon-header text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <FaWallet className="text-amazon-accent text-xl" />
              <span className="text-amazon-accent text-sm font-bold uppercase tracking-widest">OneCart Payment</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
              Reload Your <span className="text-amazon-accent">Balance</span>
            </h1>
            <p className="text-white/70 text-base max-w-xl leading-relaxed">
              Top up your OneCart Wallet instantly
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* WALLET INFO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-amazon-border p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-amazon-text-secondary uppercase tracking-widest mb-1">Current Balance</p>
              <p className="text-4xl font-extrabold text-amazon-text">
                {balance === null ? <span className="text-2xl text-amazon-text-secondary">Loading…</span> : `₹${balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
              </p>
            </div>
            <div className="text-right text-xs text-amazon-text-secondary space-y-1">
              <p>Max limit: <span className="font-bold text-amazon-text">₹{MAX_WALLET.toLocaleString("en-IN")}</span></p>
              <p>Validity: <span className="font-bold text-emerald-600">No expiry</span></p>
            </div>
          </div>
          {balance !== null && (
            <div className="mt-4">
              <div className="w-full bg-amazon-section rounded-full h-2">
                <div className="bg-amazon-accent h-2 rounded-full transition-all" style={{ width: `${Math.min((balance / MAX_WALLET) * 100, 100)}%` }} />
              </div>
              <p className="text-xs text-amazon-text-secondary mt-1">₹{(MAX_WALLET - balance).toLocaleString("en-IN")} remaining capacity</p>
            </div>
          )}
        </motion.div>

        {/* RELOAD AMOUNT */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">Enter Amount</h2>
          </div>
          <div className="bg-white rounded-2xl border border-amazon-border p-6 shadow-sm space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amazon-text font-bold">₹</span>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={amount}
                  onChange={e => { setAmount(e.target.value); setError(""); }}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-3 border border-amazon-border rounded-xl text-amazon-text text-sm focus:outline-none focus:border-amazon-accent focus:ring-2 focus:ring-amazon-accent/20 transition"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            {/* Quick amounts */}
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map(a => (
                <button
                  key={a}
                  onClick={() => { setAmount(String(a)); setError(""); }}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${String(amount) === String(a) ? "bg-amazon-accent text-white border-amazon-accent" : "border-amazon-border text-amazon-text hover:border-amazon-accent hover:text-amazon-accent"}`}
                >
                  ₹{a}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* PAYMENT METHOD */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">Payment Method</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {RELOAD_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSelectedMethod(opt.id)}
                className={`bg-white rounded-2xl border-2 p-5 text-left transition-all shadow-sm hover:shadow-md ${selectedMethod === opt.id ? "border-amazon-accent" : opt.color}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-lg ${opt.iconBg}`}>{opt.icon}</div>
                <h3 className="text-sm font-bold text-amazon-text mb-2">{opt.title}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${opt.badgeColor}`}>{opt.badge}</span>
                  <span className="text-xs text-amazon-text-secondary">{opt.fee}</span>
                </div>
                {selectedMethod === opt.id && (
                  <div className="mt-3 flex items-center gap-1 text-amazon-accent text-xs font-bold">
                    <FaCheckCircle /> Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.section>

        {/* ADD MONEY BUTTON */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <button
            onClick={handleReload}
            disabled={loading || !amount}
            className="w-full bg-amazon-accent hover:bg-amazon-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-lg"
          >
            {loading ? "Processing…" : `Add ${amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "Money"} to Wallet`}
          </button>
        </motion.div>

        {/* TRANSACTION HISTORY */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">Transaction History</h2>
          </div>

          {txLoading && (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-amazon-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!txLoading && txError && (
            <p className="text-red-500 text-sm">{txError}</p>
          )}

          {!txLoading && !txError && transactions.length === 0 && (
            <div className="bg-white border border-amazon-border rounded-2xl p-8 shadow-sm text-center text-amazon-text-secondary">
              <span className="text-3xl">📋</span>
              <p className="mt-2 text-sm">No transactions yet</p>
            </div>
          )}

          {!txLoading && !txError && transactions.length > 0 && (
            <div className="space-y-3">
              {transactions.map(tx => {
                const sourceIcon = tx.source === "reload" ? "🔄" : tx.source === "refund" ? "💸" : "🛒";
                const isCredit = tx.type === "credit";
                return (
                  <div key={tx._id} className="bg-white border border-amazon-border rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl">{sourceIcon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-amazon-text truncate">{tx.description}</p>
                        <p className="text-xs text-amazon-text-secondary mt-0.5">
                          Bal: ₹{tx.balanceAfter?.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${isCredit ? "text-emerald-600" : "text-red-500"}`}>
                        {isCredit ? "+" : "−"}₹{tx.amount?.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-amazon-text-secondary mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>

      </div>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg ${toast.type === "success" ? "bg-emerald-600" : "bg-red-500"}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
