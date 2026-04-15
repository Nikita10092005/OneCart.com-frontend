import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaExchangeAlt, FaSync } from "react-icons/fa";

const CURRENCIES = [
  { flag: "🇺🇸", code: "USD", name: "US Dollar" },
  { flag: "🇪🇺", code: "EUR", name: "Euro" },
  { flag: "🇬🇧", code: "GBP", name: "British Pound" },
  { flag: "🇦🇪", code: "AED", name: "UAE Dirham" },
  { flag: "🇸🇬", code: "SGD", name: "Singapore Dollar" },
  { flag: "🇯🇵", code: "JPY", name: "Japanese Yen" },
  { flag: "🇦🇺", code: "AUD", name: "Australian Dollar" },
  { flag: "🇨🇦", code: "CAD", name: "Canadian Dollar" },
];

export default function CurrencyConverter() {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);

  const fetchRates = async () => {
    setLoading(true);
    setError("");
    try {
      // Free public API — no key needed, returns rates relative to USD
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/INR");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRates(data.rates);
      setLastUpdated(new Date());
    } catch {
      setError("Could not load live rates. Showing cached data.");
      // Fallback static rates (INR base)
      setRates({ USD: 0.012, EUR: 0.011, GBP: 0.0095, AED: 0.044, SGD: 0.016, JPY: 1.82, AUD: 0.018, CAD: 0.016, INR: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRates(); }, []);

  // Convert: amount of fromCurrency → INR → toCurrency
  const handleConvert = () => {
    if (!rates || !amount) return;
    const amtNum = parseFloat(amount);
    if (isNaN(amtNum)) return;
    // rates are relative to INR base
    const inINR = fromCurrency === "INR" ? amtNum : amtNum / (rates[fromCurrency] || 1);
    const result = toCurrency === "INR" ? inINR : inINR * (rates[toCurrency] || 1);
    setConvertedAmount(result);
  };

  const getINRRate = (code) => {
    if (!rates[code]) return "—";
    return (1 / rates[code]).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-amazon-section">
      {/* HERO */}
      <div className="bg-amazon-header text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <FaExchangeAlt className="text-amazon-accent text-xl" />
              <span className="text-amazon-accent text-sm font-bold uppercase tracking-widest">OneCart Payment</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
              Currency <span className="text-amazon-accent">Converter</span>
            </h1>
            <p className="text-white/70 text-base max-w-xl leading-relaxed">
              Live INR reference rates
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* CONVERTER WIDGET */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-amazon-accent" />
            <h2 className="text-xl font-extrabold text-amazon-text">Convert Currency</h2>
          </div>
          <div className="bg-white rounded-2xl border border-amazon-border p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs font-bold text-amazon-text-secondary uppercase tracking-wide mb-1 block">Amount</label>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full border border-amazon-border rounded-xl px-4 py-3 text-sm text-amazon-text focus:outline-none focus:border-amazon-accent transition"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-amazon-text-secondary uppercase tracking-wide mb-1 block">From</label>
                <select
                  value={fromCurrency}
                  onChange={e => setFromCurrency(e.target.value)}
                  className="w-full border border-amazon-border rounded-xl px-4 py-3 text-sm text-amazon-text focus:outline-none focus:border-amazon-accent transition bg-white"
                >
                  <option value="INR">🇮🇳 INR — Indian Rupee</option>
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-amazon-text-secondary uppercase tracking-wide mb-1 block">To</label>
                <select
                  value={toCurrency}
                  onChange={e => setToCurrency(e.target.value)}
                  className="w-full border border-amazon-border rounded-xl px-4 py-3 text-sm text-amazon-text focus:outline-none focus:border-amazon-accent transition bg-white"
                >
                  <option value="INR">🇮🇳 INR — Indian Rupee</option>
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleConvert}
              disabled={loading}
              className="w-full bg-amazon-accent hover:bg-amazon-accent/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Convert
            </button>
            {convertedAmount !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-amazon-section rounded-xl p-4 text-center"
              >
                <p className="text-xs text-amazon-text-secondary mb-1">Result</p>
                <p className="text-2xl font-extrabold text-amazon-accent">
                  {convertedAmount.toLocaleString("en-IN", { maximumFractionDigits: 4 })} {toCurrency}
                </p>
                <p className="text-xs text-amazon-text-secondary mt-1">
                  {amount} {fromCurrency} = {convertedAmount.toLocaleString("en-IN", { maximumFractionDigits: 4 })} {toCurrency}
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* LIVE RATES TABLE */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-amazon-accent" />
              <h2 className="text-xl font-extrabold text-amazon-text">Exchange Rates (INR)</h2>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-xs text-amazon-text-secondary">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={fetchRates}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs font-bold text-amazon-accent hover:text-amazon-accent/80 transition-colors disabled:opacity-50"
              >
                <FaSync className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 mb-4">{error}</p>
          )}

          <div className="bg-white rounded-2xl border border-amazon-border shadow-sm overflow-hidden">
            <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-amazon-section border-b border-amazon-border">
              <span className="text-xs font-bold text-amazon-text-secondary uppercase tracking-wide">Flag</span>
              <span className="text-xs font-bold text-amazon-text-secondary uppercase tracking-wide">Code</span>
              <span className="text-xs font-bold text-amazon-text-secondary uppercase tracking-wide">Currency</span>
              <span className="text-xs font-bold text-amazon-text-secondary uppercase tracking-wide text-right">1 Unit = INR</span>
            </div>
            {loading ? (
              <div className="py-12 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="w-8 h-8 border-4 border-amazon-text-secondary border-t-amazon-accent rounded-full"
                />
              </div>
            ) : (
              CURRENCIES.map((row, i) => (
                <motion.div
                  key={row.code}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-amazon-border last:border-b-0 hover:bg-amazon-section/50 transition-colors"
                >
                  <span className="text-2xl">{row.flag}</span>
                  <span className="text-sm font-bold text-amazon-text self-center">{row.code}</span>
                  <span className="text-sm text-amazon-text-secondary self-center">{row.name}</span>
                  <span className="text-sm font-extrabold text-amazon-accent self-center text-right">
                    ₹{getINRRate(row.code)}
                  </span>
                </motion.div>
              ))
            )}
          </div>

          <p className="mt-4 text-xs text-amazon-text-secondary text-center leading-relaxed">
            Rates are indicative and sourced from exchangerate-api.com. For actual transaction rates, check at checkout.
          </p>
        </motion.section>

      </div>
    </div>
  );
}
