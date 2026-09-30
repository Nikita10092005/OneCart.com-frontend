import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBoxOpen, FaTruck, FaWarehouse, FaShippingFast, FaBolt,
  FaChartLine, FaCheckCircle, FaTimesCircle, FaExclamationCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fboEnroll, getMyFboEnrollment } from "../services/api";

const HOW_IT_WORKS = [
  { title: "Send Inventory to OneCart Warehouse", desc: "Ship your products to our fulfillment centers. We accept bulk shipments from anywhere in India.", icon: <FaTruck /> },
  { title: "We Store & Pack Your Products", desc: "Our team carefully stores your inventory and professionally packs each order before dispatch.", icon: <FaWarehouse /> },
  { title: "We Ship Directly to Customers", desc: "OneCart handles last-mile delivery to 19,000+ pin codes, so you never worry about logistics.", icon: <FaShippingFast /> },
];

const BENEFITS = [
  { title: "Faster Delivery", desc: "Products stored in our warehouses ship same-day or next-day, boosting customer satisfaction.", icon: <FaBolt /> },
  { title: "Lower Return Rates", desc: "Professional packing and quality checks reduce damage in transit and lower return rates significantly.", icon: <FaChartLine /> },
  { title: "OneCart Customer Trust Badge", desc: "Products fulfilled by OneCart display a trust badge, increasing conversion rates for your listings.", icon: <FaCheckCircle /> },
];

const ELIGIBILITY = [
  "GST registered business",
  "Minimum 10 SKUs to enroll",
  "Products must meet OneCart quality standards",
  "Valid bank account for payouts",
  "Compliance with packaging guidelines",
];

// ── FboEnrollmentModal ────────────────────────────────────────────────────────

function FboEnrollmentModal({ onClose, onSuccess }) {
  const [warehousePickupAddress, setWarehousePickupAddress] = useState("");
  const [skuCount, setSkuCount] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const e = {};
    if (!warehousePickupAddress.trim()) e.warehousePickupAddress = "Warehouse pickup address is required.";
    if (!skuCount) {
      e.skuCount = "SKU count is required.";
    } else {
      const parsed = parseInt(skuCount, 10);
      if (!Number.isInteger(parsed) || parsed < 10) e.skuCount = "SKU count must be an integer of at least 10.";
    }
    if (!bankAccountNumber.trim()) e.bankAccountNumber = "Bank account number is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setApiError(null);
    try {
      await fboEnroll({ warehousePickupAddress, skuCount: parseInt(skuCount, 10), bankAccountNumber });
      onSuccess();
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to submit enrollment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-amazon-border">
          <div className="flex items-center gap-2">
            <FaBoxOpen className="text-amazon-accent text-lg" />
            <h2 className="text-lg font-extrabold text-amazon-text">FBO Enrollment</h2>
          </div>
          <button onClick={onClose} className="text-amazon-text-secondary hover:text-amazon-text transition-colors" aria-label="Close">
            <FaTimesCircle className="text-xl" />
          </button>
        </div>

        {apiError && (
          <div className="mx-6 mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <FaExclamationCircle className="shrink-0" />
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-amazon-text mb-1">
              Warehouse Pickup Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={warehousePickupAddress}
              onChange={(e) => { setWarehousePickupAddress(e.target.value); setErrors((p) => ({ ...p, warehousePickupAddress: undefined })); }}
              placeholder="Full address where OneCart will pick up your inventory"
              rows={3}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/50 resize-none ${errors.warehousePickupAddress ? "border-red-400" : "border-amazon-border"}`}
            />
            {errors.warehousePickupAddress && <p className="text-red-500 text-xs mt-1">{errors.warehousePickupAddress}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-amazon-text mb-1">
              Number of SKUs <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={skuCount}
              onChange={(e) => { setSkuCount(e.target.value); setErrors((p) => ({ ...p, skuCount: undefined })); }}
              placeholder="Minimum 10"
              min={10}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/50 ${errors.skuCount ? "border-red-400" : "border-amazon-border"}`}
            />
            {errors.skuCount && <p className="text-red-500 text-xs mt-1">{errors.skuCount}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-amazon-text mb-1">
              Bank Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bankAccountNumber}
              onChange={(e) => { setBankAccountNumber(e.target.value); setErrors((p) => ({ ...p, bankAccountNumber: undefined })); }}
              placeholder="Your bank account number for payouts"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/50 ${errors.bankAccountNumber ? "border-red-400" : "border-amazon-border"}`}
            />
            {errors.bankAccountNumber && <p className="text-red-500 text-xs mt-1">{errors.bankAccountNumber}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amazon-accent hover:bg-amazon-accent/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting…
              </>
            ) : "Submit Enrollment"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── SellUnder page ────────────────────────────────────────────────────────────

export default function SellUnder() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fboStatus, setFboStatus] = useState(null);
  const [fboRejectionReason, setFboRejectionReason] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(Boolean(user));
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user) return;
    getMyFboEnrollment()
      .then((res) => {
        setFboStatus(res.data.status);
        setFboRejectionReason(res.data.rejectionReason || "");
      })
      .catch((err) => {
        if (err.response?.status === 404) setFboStatus(null);
      })
      .finally(() => setStatusLoading(false));
  }, [user]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSuccess = () => {
    setModalOpen(false);
    setFboStatus("pending");
    showToast("success", "FBO enrollment submitted! Admin will review it shortly.");
  };

  return (
    <>
      <div className="min-h-screen bg-amazon-section">
        <div className="bg-amazon-header text-white py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-3">
                <FaBoxOpen className="text-amazon-accent text-xl" />
                <span className="text-amazon-accent text-sm font-bold uppercase tracking-widest">Fulfilled by OneCart</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
                Sell Under <span className="text-amazon-accent">OneCart</span>
              </h1>
              <p className="text-white/70 text-base max-w-xl leading-relaxed">
                Let us handle logistics while you focus on products
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

          {/* HOW IT WORKS */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-amazon-accent" />
              <h2 className="text-xl font-extrabold text-amazon-text">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {HOW_IT_WORKS.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-xl bg-amazon-accent/10 border border-amazon-accent/20 flex items-center justify-center mb-4 text-amazon-accent text-lg">{step.icon}</div>
                  <div className="text-xs font-bold text-amazon-accent mb-1">Step {i + 1}</div>
                  <h3 className="text-sm font-bold text-amazon-text mb-2">{step.title}</h3>
                  <p className="text-xs text-amazon-text-secondary leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* BENEFITS */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-amazon-accent" />
              <h2 className="text-xl font-extrabold text-amazon-text">Benefits</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {BENEFITS.map((benefit, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl border border-amazon-border p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-xl bg-amazon-accent/10 border border-amazon-accent/20 flex items-center justify-center mb-4 text-amazon-accent text-lg">{benefit.icon}</div>
                  <h3 className="text-sm font-bold text-amazon-text mb-2">{benefit.title}</h3>
                  <p className="text-xs text-amazon-text-secondary leading-relaxed">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ELIGIBILITY */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-amazon-accent" />
              <h2 className="text-xl font-extrabold text-amazon-text">Eligibility</h2>
            </div>
            <div className="bg-white rounded-2xl border border-amazon-border p-6 shadow-sm">
              <p className="text-sm text-amazon-text-secondary mb-4">
                To enroll in the Sell Under OneCart program, your business must meet the following requirements:
              </p>
              <ul className="space-y-3">
                {ELIGIBILITY.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-amazon-text">
                    <FaCheckCircle className="text-amazon-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-white rounded-2xl border border-amazon-border p-8 shadow-sm text-center">
              <h2 className="text-xl font-extrabold text-amazon-text mb-3">Ready to enroll in FBO?</h2>
              <p className="text-sm text-amazon-text-secondary mb-6 max-w-md mx-auto">
                Send us your inventory and let OneCart handle the rest — storage, packing, and delivery.
              </p>

              {statusLoading ? (
                <div className="flex items-center justify-center gap-2 text-amazon-text-secondary text-sm">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Checking enrollment status…
                </div>
              ) : !user ? (
                <button onClick={() => navigate("/login")} className="bg-amazon-accent hover:bg-amazon-accent/90 text-white font-bold px-8 py-3 rounded-xl transition-colors">
                  Login to Apply
                </button>
              ) : user.role !== "seller" ? (
                <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-5 py-3 rounded-xl max-w-md mx-auto">
                  <FaExclamationCircle className="shrink-0" />
                  You need to be an approved seller first.{" "}
                  <a href="/sell" className="underline font-semibold hover:text-amber-800">Apply here</a>
                </div>
              ) : fboStatus === "pending" ? (
                <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-5 py-3 rounded-xl max-w-md mx-auto">
                  <FaExclamationCircle className="shrink-0" />
                  Your FBO enrollment is under review.
                </div>
              ) : fboStatus === "approved" ? (
                <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-5 py-3 rounded-xl max-w-md mx-auto">
                  <FaCheckCircle className="shrink-0" />
                  You are enrolled in the Fulfilled by OneCart program.
                </div>
              ) : fboStatus === "rejected" ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-3 rounded-xl max-w-md mx-auto text-left">
                    <FaTimesCircle className="shrink-0 mt-0.5" />
                    <span><span className="font-semibold">Enrollment rejected:</span> {fboRejectionReason || "No reason provided."}</span>
                  </div>
                  <button onClick={() => setModalOpen(true)} className="bg-amazon-accent hover:bg-amazon-accent/90 text-white font-bold px-8 py-3 rounded-xl transition-colors">
                    Re-enroll
                  </button>
                </div>
              ) : (
                <button onClick={() => setModalOpen(true)} className="bg-amazon-accent hover:bg-amazon-accent/90 text-white font-bold px-8 py-3 rounded-xl transition-colors">
                  Enroll in FBO
                </button>
              )}
            </div>
          </motion.section>

        </div>
      </div>

      {modalOpen && <FboEnrollmentModal onClose={() => setModalOpen(false)} onSuccess={handleSuccess} />}

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
    </>
  );
}
