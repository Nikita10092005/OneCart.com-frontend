import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PointsWidget from "../components/PointsWidget";
import { imgUrl } from "../utils/imageUrl";

const REFUND_REASONS = [
  { value: "damaged",          label: "Item arrived damaged" },
  { value: "wrong_item",       label: "Wrong item delivered" },
  { value: "not_as_described", label: "Not as described" },
  { value: "changed_mind",     label: "Changed my mind" },
  { value: "late_delivery",    label: "Delivered too late" },
  { value: "other",            label: "Other" },
];

const STATUS_CONFIG = {
  Ordered:   { color: "text-amazon-accent",   bg: "bg-amazon-section border-amazon-border", step: 1 },
  Packed:    { color: "text-blue-600",    bg: "bg-blue-50 border-blue-200",    step: 2 },
  Shipped:   { color: "text-orange-600",  bg: "bg-orange-50 border-orange-200", step: 3 },
  Delivered: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", step: 4 },
  Cancelled: { color: "text-red-500",     bg: "bg-red-50 border-red-200",     step: 0 },
};

const STEPS = ["Ordered", "Packed", "Shipped", "Delivered"];

function TrackBar({ status }) {
  const step = STATUS_CONFIG[status]?.step ?? 0;
  if (status === "Cancelled") return (
    <div className="flex items-center gap-2 py-3">
      <div className="w-2 h-2 rounded-full bg-red-400" />
      <span className="text-xs text-red-500 font-semibold">Order Cancelled</span>
    </div>
  );
  return (
    <div className="flex items-center gap-0 mt-4 mb-2">
      {STEPS.map((s, i) => {
        const done = step >= i + 1;
        return (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1, type: "spring" }}
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold
                  ${done ? "bg-amazon-accent border-amazon-accent text-white" : "border-amazon-border text-amazon-text-secondary bg-white"}`}>
                {done ? "✓" : i + 1}
              </motion.div>
              <span className={`text-[10px] mt-1.5 font-medium whitespace-nowrap ${done ? "text-amazon-accent" : "text-amazon-text-secondary"}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: step > i + 1 ? 1 : 0 }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="h-0.5 flex-1 -mt-5 mx-1 bg-amazon-accent origin-left" />
            )}
            {i < STEPS.length - 1 && (
              <div className="h-0.5 flex-1 -mt-5 mx-1 bg-amazon-border absolute" style={{ zIndex: -1 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [refundModal, setRefundModal] = useState(null); // order object
  const [refundReason, setRefundReason] = useState("damaged");
  const [refundDetail, setRefundDetail] = useState("");
  const [refundMethod, setRefundMethod] = useState("original_payment");
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [refundSuccess, setRefundSuccess] = useState(false);
  const [myRefunds, setMyRefunds] = useState([]);
  const [refundsLoading, setRefundsLoading] = useState(true);
  const [refundsError, setRefundsError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      if (!user?._id || hasFetched.current) return;
      try {
        const res = await API.get("/orders");
        const unique = Array.from(new Map(res.data.map(o => [o._id, o])).values());
        setOrders(unique);
        hasFetched.current = true;
      } catch (e) { console.log(e); }
      finally { setLoading(false); }
      try {
        const refundsRes = await API.get("/financial/refunds/my");
        setMyRefunds(refundsRes.data?.refunds || []);
      } catch {
        setRefundsError("Failed to load refund requests.");
      } finally {
        setRefundsLoading(false);
      }
    };
    fetch();
  }, [user]);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
    }
  }, []);

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await API.put(`/orders/${id}/cancel`);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: "Cancelled" } : o));
    } catch { alert("Cancel failed"); }
  };

  const downloadInvoice = (order) => {
    const lines = [
      `OneCart.com — Invoice`, `${"─".repeat(40)}`,
      `Order ID  : ${order._id}`,
      `Date      : ${new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
      `Status    : ${order.status}`, `Payment   : ${order.payment}`, `${"─".repeat(40)}`,
      ...(order.products?.map(i => `  ${i.productId?.name || "Product"} × ${i.quantity}  ₹${((i.productId?.price || 0) * i.quantity).toLocaleString()}`) || []),
      `${"─".repeat(40)}`, `Total     : ₹${order.totalAmount?.toLocaleString()}`,
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines], { type: "text/plain" }));
    a.download = `invoice_${order._id.slice(-6)}.txt`;
    a.click();
  };

  const submitRefund = async () => {
    if (!refundModal) return;
    setRefundSubmitting(true);
    try {
      const items = refundModal.products?.map(p => ({
        productId: p.productId?._id || p.productId,
        quantity: p.quantity,
        reason: refundReason,
      })) || [];

      const totalRefundAmount = refundModal.products?.reduce((sum, p) => {
        return sum + ((p.productId?.price || 0) * (p.quantity || 1));
      }, 0) || refundModal.totalAmount || 0;

      await API.post("/financial/refunds", {
        orderId: refundModal._id,
        userId: refundModal.userId,
        items,
        totalRefundAmount,
        reason: refundReason,
        detailedReason: refundDetail,
        refundMethod,
      });
      setRefundSuccess(true);
      setTimeout(() => {
        setRefundModal(null);
        setRefundSuccess(false);
        setRefundReason("damaged");
        setRefundDetail("");
        setRefundMethod("original_payment");
      }, 2500);
    } catch (e) {
      alert(e.response?.data?.message || "Failed to submit refund request.");
    } finally {
      setRefundSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-amazon-section flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="w-10 h-10 border-4 border-amazon-border border-t-amazon-accent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-amazon-section py-8 px-4">
      <div className="max-w-4xl mx-auto">

        <div ref={headerRef} className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-amazon-accent to-amazon-text-secondary" />
            <h1 className="text-2xl font-extrabold text-amazon-text">My Orders</h1>
          </div>
          <div className="flex items-center gap-4">
            <PointsWidget />
            {orders.length > 0 && (
              <span className="text-xs text-amazon-accent font-medium">{orders.length} order{orders.length > 1 ? "s" : ""}</span>
            )}
          </div>
        </div>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-6xl mb-5">📦</p>
            <h2 className="text-xl font-bold text-amazon-text mb-2">No orders yet</h2>
            <p className="text-amazon-accent text-sm mb-8">Your order history will appear here</p>
            <motion.button onClick={() => navigate("/home")}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-3 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold rounded-xl shadow-lg shadow-black/10">
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Ordered;
              const isOpen = expanded === order._id;
              const total = order.totalAmount || order.products?.reduce((s, i) => s + (i.productId?.price || 0) * (i.quantity || 1), 0) || 0;

              return (
                <motion.div key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -2 }}
                  className="bg-white border border-amazon-border rounded-2xl overflow-hidden hover:border-amazon-border transition-all shadow-sm">

                  <div className="p-5 flex flex-wrap items-center gap-4 cursor-pointer"
                    onClick={() => setExpanded(isOpen ? null : order._id)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-amazon-text">#{order._id.slice(-8).toUpperCase()}</p>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-amazon-accent">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        {" · "}{order.payment}
                      </p>
                    </div>

                    <div className="flex gap-1.5">
                      {order.products?.slice(0, 4).map((item, j) => (
                        <img key={j} src={item.productId?.image ? imgUrl(item.productId.image) : null}
                          alt="" className="w-10 h-10 rounded-xl object-contain bg-amazon-section border border-amazon-border p-0.5" />
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-extrabold text-amazon-price">₹{total.toLocaleString()}</span>
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
                        className="text-amazon-text-secondary">▾</motion.span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-amazon-border px-5 pb-5 pt-4">

                        <TrackBar status={order.status} />

                        <div className="grid grid-cols-2 gap-3 mt-4 mb-5">
                          {[
                            { label: "Name",    value: order.name },
                            { label: "Phone",   value: order.phone },
                            { label: "Address", value: order.address, full: true },
                          ].map(f => (
                            <div key={f.label} className={`bg-amazon-section rounded-xl p-3 border border-amazon-border ${f.full ? "col-span-2" : ""}`}>
                              <p className="text-xs text-amazon-accent font-semibold uppercase tracking-widest mb-1">{f.label}</p>
                              <p className="text-sm text-amazon-text font-medium">{f.value || "—"}</p>
                            </div>
                          ))}
                        </div>

                        <p className="text-xs font-bold text-amazon-accent uppercase tracking-widest mb-3">Items Ordered</p>
                        <div className="space-y-3 mb-5">
                          {order.products?.map((item, j) => (
                            <motion.div key={j} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: j * 0.05 }}
                              className="flex items-center gap-3 bg-amazon-section rounded-xl p-3 border border-amazon-border">
                              <img src={item.productId?.image ? imgUrl(item.productId.image) : null}
                                alt="" className="w-14 h-14 rounded-xl object-contain bg-white border border-amazon-border p-1 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-amazon-text truncate">{item.productId?.name || "Deleted Product"}</p>
                                <p className="text-xs text-amazon-accent mt-0.5">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-bold text-amazon-price flex-shrink-0">
                                ₹{((item.productId?.price || 0) * item.quantity).toLocaleString()}
                              </p>
                            </motion.div>
                          ))}
                        </div>

                        <div className="flex gap-3 flex-wrap">
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            onClick={() => navigate("/checkout")}
                            className="flex-1 py-2.5 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold rounded-xl text-xs shadow-md shadow-black/10">
                            🔁 Buy Again
                          </motion.button>
                          {["Ordered", "Packed"].includes(order.status) && (
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                              onClick={() => cancelOrder(order._id)}
                              className="flex-1 py-2.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 font-bold rounded-xl text-xs">
                              ✕ Cancel Order
                            </motion.button>
                          )}
                          {order.status === "Delivered" && order.payment === "Razorpay" && (
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                              onClick={() => { setRefundModal(order); setRefundReason("damaged"); setRefundDetail(""); setRefundMethod("original_payment"); }}
                              className="flex-1 py-2.5 bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100 font-bold rounded-xl text-xs">
                              ↩ Request Refund
                            </motion.button>
                          )}
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            onClick={() => downloadInvoice(order)}
                            className="flex-1 py-2.5 bg-amazon-section border border-amazon-border text-amazon-accent hover:border-amazon-border font-bold rounded-xl text-xs">
                            📄 Invoice
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* MY REFUND REQUESTS SECTION */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-orange-500 to-orange-400" />
            <h2 className="text-2xl font-extrabold text-amazon-text">My Refund Requests</h2>
          </div>

          {refundsLoading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="w-10 h-10 border-4 border-amazon-border border-t-amazon-accent rounded-full" />
            </div>
          ) : refundsError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {refundsError}
            </div>
          ) : myRefunds.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-6xl mb-4">🧾</p>
              <p className="text-amazon-accent text-sm">No refund requests yet</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {myRefunds.map((refund, i) => {
                const statusColors = {
                  pending: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
                  approved: { color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
                  processing: { color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
                  completed: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
                  rejected: { color: "text-red-500", bg: "bg-red-50 border-red-200" },
                };
                const cfg = statusColors[refund.status] || statusColors.pending;

                const methodLabels = {
                  original_payment: "Original Payment",
                  store_credit: "Store Credit",
                  bank_transfer: "Bank Transfer",
                };

                const orderIdStr = refund.orderId?._id || refund.orderId;
                const orderRef = typeof orderIdStr === "string" ? orderIdStr.slice(-8).toUpperCase() : "—";

                return (
                  <motion.div key={refund._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white border border-amazon-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-amazon-text">Order #{orderRef}</p>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                            {refund.status}
                          </span>
                        </div>
                        <p className="text-xs text-amazon-accent">
                          {refund.createdAt ? new Date(refund.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-base font-extrabold text-amazon-price">₹{refund.totalRefundAmount?.toLocaleString()}</p>
                        <p className="text-xs text-amazon-accent mt-0.5">{methodLabels[refund.refundMethod] || refund.refundMethod}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* REFUND MODAL */}
      <AnimatePresence>
        {refundModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-amazon-border">

              {refundSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-amazon-text mb-2">Refund Request Submitted</h3>
                  <p className="text-sm text-amazon-accent">Our team will review your request and process the refund within 5–7 business days.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-base font-extrabold text-amazon-text">Request Refund</h3>
                      <p className="text-xs text-amazon-accent mt-0.5">Order #{refundModal._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <button onClick={() => setRefundModal(null)}
                      className="w-8 h-8 rounded-full bg-amazon-section border border-amazon-border flex items-center justify-center text-amazon-accent hover:bg-amazon-border transition text-sm">✕</button>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
                    <span className="text-orange-500">💰</span>
                    <p className="text-xs text-orange-700 font-semibold">
                      Refund of ₹{refundModal.totalAmount?.toLocaleString()} will be returned to your Razorpay account
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold text-amazon-accent uppercase tracking-widest mb-2">Refund Method</label>
                    <div className="space-y-2">
                      {[
                        { value: "original_payment", label: "Original Payment Method" },
                        { value: "store_credit",      label: "Store Credit / Wallet" },
                        { value: "bank_transfer",     label: "Bank Transfer" },
                      ].map(m => (
                        <label key={m.value}
                          onClick={() => setRefundMethod(m.value)}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                            ${refundMethod === m.value ? "border-amazon-accent bg-amazon-section" : "border-amazon-border bg-white"}`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                            ${refundMethod === m.value ? "border-amazon-accent" : "border-amazon-border"}`}>
                            {refundMethod === m.value && <div className="w-2 h-2 rounded-full bg-amazon-accent" />}
                          </div>
                          <span className="text-sm text-amazon-text font-medium">{m.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {refundMethod === "store_credit" && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                      <span className="text-emerald-500">💳</span>
                      <p className="text-xs text-emerald-700 font-semibold">Refund will be credited to your OneCart Wallet</p>
                    </div>
                  )}
                  {refundMethod === "bank_transfer" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                      <span className="text-blue-500">🏦</span>
                      <p className="text-xs text-blue-700 font-semibold">Bank transfer refunds may take 5–7 business days</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-xs font-bold text-amazon-accent uppercase tracking-widest mb-2">Reason for Refund</label>
                    <div className="space-y-2">
                      {REFUND_REASONS.map(r => (
                        <label key={r.value}
                          onClick={() => setRefundReason(r.value)}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                            ${refundReason === r.value ? "border-amazon-accent bg-amazon-section" : "border-amazon-border bg-white"}`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                            ${refundReason === r.value ? "border-amazon-accent" : "border-amazon-border"}`}>
                            {refundReason === r.value && <div className="w-2 h-2 rounded-full bg-amazon-accent" />}
                          </div>
                          <span className="text-sm text-amazon-text font-medium">{r.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs font-bold text-amazon-accent uppercase tracking-widest mb-2">Additional Details (optional)</label>
                    <textarea value={refundDetail} onChange={e => setRefundDetail(e.target.value)} rows={3}
                      placeholder="Describe the issue in more detail..."
                      className="w-full bg-amazon-section/50 border border-amazon-border text-amazon-text text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 resize-none" />
                  </div>

                  <motion.button
                    onClick={submitRefund}
                    disabled={refundSubmitting}
                    whileHover={!refundSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!refundSubmitting ? { scale: 0.97 } : {}}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold rounded-xl text-sm shadow-lg disabled:opacity-60">
                    {refundSubmitting
                      ? <span className="flex items-center justify-center gap-2">
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Submitting...
                        </span>
                      : "↩ Submit Refund Request"
                    }
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
