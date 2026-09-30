import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStore, FaCheckCircle, FaTimesCircle, FaClock, FaWallet,
  FaBoxOpen, FaChevronDown, FaChevronUp, FaExclamationCircle, FaEdit,
} from "react-icons/fa";
import API from "../../services/api";
import {
  getFboEnrollments,
  approveFboEnrollment,
  rejectFboEnrollment,
  rejectSellerApplicationAdmin,
} from "../../services/api";

const STATUS_STYLES = {
  pending:  "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

const TABS = [
  { id: "applications", label: "Applications", icon: <FaStore /> },
  { id: "fbo", label: "FBO Enrollments", icon: <FaBoxOpen /> },
  { id: "payouts", label: "Seller Payouts", icon: <FaWallet /> },
];

// ── RejectModal ───────────────────────────────────────────────────────────────

function RejectModal({ onClose, onConfirm, loading }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) { setError("Rejection reason is required."); return; }
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-amazon-border">
          <h3 className="text-base font-extrabold text-amazon-text">Reject Application</h3>
          <button onClick={onClose} className="text-amazon-text-secondary hover:text-amazon-text transition-colors">
            <FaTimesCircle className="text-lg" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-amazon-text mb-1">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError(""); }}
              placeholder="Explain why this application is being rejected…"
              rows={4}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/50 resize-none ${error ? "border-red-400" : "border-amazon-border"}`}
            />
            {error && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FaExclamationCircle /> {error}
              </p>
            )}
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-amazon-text-secondary hover:text-amazon-text border border-amazon-border rounded-xl transition-colors">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors"
            >
              {loading ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <FaTimesCircle size={12} />}
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Detail row for applications ───────────────────────────────────────────────

function AppDetailRow({ app, onDetailsUpdated }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    businessName: app.businessName || "",
    gstNumber: app.gstNumber || "",
    phoneNumber: app.phoneNumber || "",
    businessAddress: app.businessAddress || "",
    businessType: app.businessType || "Individual",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const hasMissing = !app.businessName || !app.phoneNumber || !app.businessAddress;

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      await API.put(`/admin/seller-applications/${app._id}/details`, form);
      onDetailsUpdated(app._id, form);
      setEditing(false);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: "Business Name", value: app.businessName },
    { label: "GST Number", value: app.gstNumber },
    { label: "Phone Number", value: app.phoneNumber },
    { label: "Business Type", value: app.businessType },
    { label: "Business Address", value: app.businessAddress },
  ];

  return (
    <div className="px-4 pb-4 pt-2 bg-white rounded-b-2xl border-t border-amazon-border/50">
      {!editing ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            {fields.map(({ label, value }) => (
              <div key={label} className={label === "Business Address" ? "col-span-2" : ""}>
                <p className="text-xs font-semibold text-amazon-text-secondary uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-sm text-amazon-text">{value || <span className="text-amazon-text-secondary italic">Not provided</span>}</p>
              </div>
            ))}
            {app.rejectionReason && (
              <div className="col-span-2">
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-0.5">Rejection Reason</p>
                <p className="text-sm text-red-600">{app.rejectionReason}</p>
              </div>
            )}
          </div>
          {hasMissing && (
            <button
              onClick={() => setEditing(true)}
              className="mt-3 text-xs font-semibold text-amazon-accent hover:underline flex items-center gap-1"
            >
              <FaEdit size={11} /> Fill in missing details
            </button>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-bold text-amazon-text-secondary uppercase tracking-wide mb-1">Edit Details</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-amazon-text-secondary uppercase tracking-wide mb-0.5 block">Business Name</label>
              <input
                value={form.businessName} onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))}
                className="w-full border border-amazon-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/40"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-amazon-text-secondary uppercase tracking-wide mb-0.5 block">Phone Number</label>
              <input
                value={form.phoneNumber} onChange={e => setForm(p => ({ ...p, phoneNumber: e.target.value }))}
                className="w-full border border-amazon-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/40"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-amazon-text-secondary uppercase tracking-wide mb-0.5 block">GST Number</label>
              <input
                value={form.gstNumber} onChange={e => setForm(p => ({ ...p, gstNumber: e.target.value }))}
                className="w-full border border-amazon-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/40 uppercase"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-amazon-text-secondary uppercase tracking-wide mb-0.5 block">Business Type</label>
              <select
                value={form.businessType} onChange={e => setForm(p => ({ ...p, businessType: e.target.value }))}
                className="w-full border border-amazon-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/40 bg-white"
              >
                <option value="Individual">Individual</option>
                <option value="Registered Business">Registered Business</option>
                <option value="Brand">Brand</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-amazon-text-secondary uppercase tracking-wide mb-0.5 block">Business Address</label>
              <textarea
                value={form.businessAddress} onChange={e => setForm(p => ({ ...p, businessAddress: e.target.value }))}
                rows={2}
                className="w-full border border-amazon-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-accent/40 resize-none"
              />
            </div>
          </div>
          {saveError && <p className="text-red-500 text-xs">{saveError}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-xs font-semibold text-amazon-text-secondary border border-amazon-border rounded-lg hover:text-amazon-text transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amazon-accent hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors"
            >
              {saving ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <FaCheckCircle size={10} />}
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminSellerApplications() {
  const [activeTab, setActiveTab] = useState("applications");

  // Applications state
  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [approving, setApproving] = useState({});
  const [rejectModal, setRejectModal] = useState({ open: false, id: null, type: null });
  const [rejecting, setRejecting] = useState(false);

  // FBO state
  const [fboEnrollments, setFboEnrollments] = useState([]);
  const [fboLoading, setFboLoading] = useState(false);
  const [fboApproving, setFboApproving] = useState({});

  // Payouts state
  const [payouts, setPayouts] = useState([]);
  const [processing, setProcessing] = useState({});

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load applications on mount
  useEffect(() => {
    API.get("/admin/seller-applications")
      .then(r => setApps(r.data))
      .catch(console.error)
      .finally(() => setAppsLoading(false));
  }, []);

  // Load FBO enrollments when tab activated
  useEffect(() => {
    if (activeTab === "fbo") {
      setFboLoading(true);
      getFboEnrollments()
        .then(r => setFboEnrollments(r.data))
        .catch(console.error)
        .finally(() => setFboLoading(false));
    }
    if (activeTab === "payouts") {
      API.get("/admin/seller-payouts")
        .then(r => setPayouts(r.data))
        .catch(console.error);
    }
  }, [activeTab]);

  // Update application details (admin fill-in for old records)
  const handleDetailsUpdated = (id, updatedFields) => {
    setApps(prev => prev.map(a => a._id === id ? { ...a, ...updatedFields } : a));
    showToast("Details saved successfully!");
  };

  // Approve seller application
  const handleApprove = async (id) => {
    setApproving(prev => ({ ...prev, [id]: true }));
    try {
      await API.put(`/admin/seller-applications/${id}/approve`);
      setApps(prev => prev.map(a => a._id === id ? { ...a, status: "approved" } : a));
      showToast("Seller approved successfully!");
    } catch (err) {
      showToast(err.response?.data?.message || "Approval failed", "error");
    } finally {
      setApproving(prev => ({ ...prev, [id]: false }));
    }
  };

  // Reject (applications or FBO)
  const handleRejectConfirm = async (reason) => {
    setRejecting(true);
    try {
      if (rejectModal.type === "application") {
        await rejectSellerApplicationAdmin(rejectModal.id, reason);
        setApps(prev => prev.map(a => a._id === rejectModal.id ? { ...a, status: "rejected", rejectionReason: reason } : a));
        showToast("Application rejected.");
      } else {
        await rejectFboEnrollment(rejectModal.id, reason);
        setFboEnrollments(prev => prev.map(e => e._id === rejectModal.id ? { ...e, status: "rejected", rejectionReason: reason } : e));
        showToast("FBO enrollment rejected.");
      }
      setRejectModal({ open: false, id: null, type: null });
    } catch (err) {
      showToast(err.response?.data?.message || "Rejection failed", "error");
    } finally {
      setRejecting(false);
    }
  };

  // Approve FBO enrollment
  const handleFboApprove = async (id) => {
    setFboApproving(prev => ({ ...prev, [id]: true }));
    try {
      await approveFboEnrollment(id);
      setFboEnrollments(prev => prev.map(e => e._id === id ? { ...e, status: "approved" } : e));
      showToast("FBO enrollment approved!");
    } catch (err) {
      showToast(err.response?.data?.message || "Approval failed", "error");
    } finally {
      setFboApproving(prev => ({ ...prev, [id]: false }));
    }
  };

  // Process payout
  const handleProcessPayout = async (id) => {
    setProcessing(prev => ({ ...prev, [id]: true }));
    try {
      await API.patch(`/seller/payouts/${id}/process`);
      setPayouts(prev => prev.map(p => p._id === id ? { ...p, status: "processed" } : p));
      showToast("Payout marked as processed!");
    } catch {
      showToast("Failed to process payout", "error");
    } finally {
      setProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  if (appsLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-amazon-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {rejectModal.open && (
        <RejectModal
          onClose={() => setRejectModal({ open: false, id: null, type: null })}
          onConfirm={handleRejectConfirm}
          loading={rejecting}
        />
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-amazon-border mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors relative ${activeTab === tab.id ? "text-amazon-accent" : "text-amazon-text-secondary hover:text-amazon-text"}`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amazon-accent rounded-full" />}
          </button>
        ))}
      </div>

      {/* ── Applications Tab ── */}
      {activeTab === "applications" && (
        <div className="space-y-3">
          <p className="text-xs text-amazon-text-secondary mb-4">{apps.filter(a => a.status === "pending").length} pending approval</p>
          {apps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-amazon-text-secondary">
              <FaStore size={40} className="opacity-20" />
              <p className="font-medium">No applications yet</p>
            </div>
          ) : (
            apps.map((app, i) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-amazon-section rounded-2xl border border-amazon-border overflow-hidden"
              >
                {/* Row header — clickable to expand */}
                <div
                  className="flex items-center justify-between gap-4 p-4 cursor-pointer hover:bg-amazon-border/10 transition-colors"
                  onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amazon-accent flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
                      {app.userId?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amazon-text">{app.userId?.name || "Unknown"}</p>
                      <p className="text-xs text-amazon-text-secondary">{app.userId?.email || "—"}</p>
                      <p className="text-xs text-amazon-text-secondary mt-0.5">
                        Applied: {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${STATUS_STYLES[app.status] || STATUS_STYLES.pending}`}>
                      {app.status === "pending" && <FaClock className="inline mr-1" />}
                      {app.status === "approved" && <FaCheckCircle className="inline mr-1" />}
                      {app.status === "rejected" && <FaTimesCircle className="inline mr-1" />}
                      {app.status}
                    </span>
                    {app.status === "pending" && (
                      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleApprove(app._id)}
                          disabled={approving[app._id]}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amazon-accent hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
                        >
                          {approving[app._id] ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <FaCheckCircle size={11} />}
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectModal({ open: true, id: app._id, type: "application" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors"
                        >
                          <FaTimesCircle size={11} /> Reject
                        </button>
                      </div>
                    )}
                    <span className="text-amazon-text-secondary">
                      {expandedId === app._id ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                    </span>
                  </div>
                </div>

                {/* Expandable detail */}
                <AnimatePresence>
                  {expandedId === app._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <AppDetailRow app={app} onDetailsUpdated={handleDetailsUpdated} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* ── FBO Enrollments Tab ── */}
      {activeTab === "fbo" && (
        <div className="space-y-3">
          {fboLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-amazon-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : fboEnrollments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-amazon-text-secondary">
              <FaBoxOpen size={40} className="opacity-20" />
              <p className="font-medium">No FBO enrollments yet</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-amazon-text-secondary mb-4">{fboEnrollments.filter(e => e.status === "pending").length} pending review</p>
              {fboEnrollments.map((enr, i) => (
                <motion.div
                  key={enr._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-amazon-section rounded-2xl border border-amazon-border p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amazon-accent flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
                        {enr.userId?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-amazon-text">{enr.userId?.name || "Unknown"}</p>
                        <p className="text-xs text-amazon-text-secondary">{enr.userId?.email || "—"}</p>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2">
                          <div>
                            <p className="text-xs font-semibold text-amazon-text-secondary uppercase tracking-wide">Warehouse Address</p>
                            <p className="text-xs text-amazon-text">{enr.warehousePickupAddress}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-amazon-text-secondary uppercase tracking-wide">SKU Count</p>
                            <p className="text-xs text-amazon-text">{enr.skuCount}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-amazon-text-secondary uppercase tracking-wide">Bank Account</p>
                            <p className="text-xs text-amazon-text">{enr.bankAccountNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-amazon-text-secondary uppercase tracking-wide">Applied</p>
                            <p className="text-xs text-amazon-text">{new Date(enr.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                          </div>
                        </div>
                        {enr.rejectionReason && (
                          <p className="text-xs text-red-600 mt-1"><span className="font-semibold">Rejected:</span> {enr.rejectionReason}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${STATUS_STYLES[enr.status] || STATUS_STYLES.pending}`}>
                        {enr.status === "pending" && <FaClock className="inline mr-1" />}
                        {enr.status === "approved" && <FaCheckCircle className="inline mr-1" />}
                        {enr.status === "rejected" && <FaTimesCircle className="inline mr-1" />}
                        {enr.status}
                      </span>
                      {enr.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleFboApprove(enr._id)}
                            disabled={fboApproving[enr._id]}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amazon-accent hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
                          >
                            {fboApproving[enr._id] ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <FaCheckCircle size={11} />}
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectModal({ open: true, id: enr._id, type: "fbo" })}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors"
                          >
                            <FaTimesCircle size={11} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── Payouts Tab ── */}
      {activeTab === "payouts" && (
        <div className="space-y-4">
          <p className="text-xs text-amazon-text-secondary">{payouts.filter(p => p.status === "pending").length} pending payouts</p>
          {payouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-amazon-text-secondary">
              <FaWallet size={40} className="opacity-20" />
              <p className="font-medium">No payouts yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-amazon-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-amazon-section border-b border-amazon-border">
                  <tr className="text-left text-xs text-amazon-text-secondary uppercase tracking-wide">
                    <th className="px-5 py-3">Seller</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p, i) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-amazon-border/50 hover:bg-amazon-section/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-amazon-text text-xs">{p.sellerId?.name || "—"}</p>
                        <p className="text-amazon-text-secondary text-xs">{p.sellerId?.email || "—"}</p>
                      </td>
                      <td className="px-5 py-3.5 text-amazon-text-secondary text-xs">
                        {new Date(p.payoutDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-amazon-text-secondary text-xs">
                        ...{String(p.orderId?._id || p.orderId).slice(-8)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-amazon-text">
                        ₹{(p.amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${p.status === "processed" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {p.status === "pending" ? (
                          <button
                            onClick={() => handleProcessPayout(p._id)}
                            disabled={processing[p._id]}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors mx-auto"
                          >
                            {processing[p._id] ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <FaCheckCircle size={10} />}
                            Process
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-medium">✓ Done</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}
