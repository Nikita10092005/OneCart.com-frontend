const getToken = () => localStorage.getItem('token');
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Ticket, Percent, RotateCcw, CreditCard, Plus, Edit2, Trash2, 
  Check, X, Save, AlertCircle, Globe, Banknote, Power
} from "lucide-react";

import { API_URL } from './../../services/config';

function AdminFinancial() {
  const [activeTab, setActiveTab] = useState("coupons");
  const [, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  /* Coupon State */
  const [coupons, setCoupons] = useState([]);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: 0,
    maxDiscountAmount: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
    isActive: true
  });

  /* Tax State */
  const [taxes, setTaxes] = useState([]);
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [taxForm, setTaxForm] = useState({
    name: "",
    country: "",
    state: "",
    zipCode: "",
    taxRate: "",
    taxType: "vat",
    isActive: true,
    priority: 0
  });

  /* Refund State */
  const [refunds, setRefunds] = useState([]);
  const [refundStats, setRefundStats] = useState(null);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundForm, setRefundForm] = useState({
    status: "",
    adminNotes: "",
    refundTransactionId: ""
  });

  /* Payment Settings State */
  const [paymentSettings, setPaymentSettings] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    provider: "",
    displayName: "",
    isEnabled: false,
    isTestMode: true,
    config: {
      keyId: "",
      keySecret: "",
      publicKey: "",
      privateKey: "",
      webhookSecret: "",
      merchantId: "",
      clientId: "",
      clientSecret: ""
    },
    supportedCurrencies: ["INR"],
    processingFee: 0,
    processingFeeType: "percentage",
    minAmount: 1,
    maxAmount: ""
  });



  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  }, []);



  /* ================ COUPON API ================ */
  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/financial/coupons`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) setCoupons(data.coupons);
    } catch {
      showMessage("error", "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  const createCoupon = async () => {
    try {
      const res = await fetch(`${API_URL}/financial/coupons`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(couponForm)
      });
      const data = await res.json();
      if (data.success) {
        showMessage("success", "Coupon created successfully");
        fetchCoupons();
        setShowCouponForm(false);
        resetCouponForm();
      }
    } catch {
      showMessage("error", "Failed to create coupon");
    }
  };

  const updateCoupon = async () => {
    try {
      const res = await fetch(`${API_URL}/financial/coupons/${editingCoupon._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(couponForm)
      });
      const data = await res.json();
      if (data.success) {
        showMessage("success", "Coupon updated successfully");
        fetchCoupons();
        setShowCouponForm(false);
        setEditingCoupon(null);
        resetCouponForm();
      }
    } catch {
      showMessage("error", "Failed to update coupon");
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`${API_URL}/financial/coupons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        showMessage("success", "Coupon deleted");
        fetchCoupons();
      }
    } catch {
      showMessage("error", "Failed to delete coupon");
    }
  };

  const resetCouponForm = () => {
    setCouponForm({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: 0,
      maxDiscountAmount: "",
      usageLimit: "",
      startDate: "",
      endDate: "",
      isActive: true
    });
  };

  const editCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || "",
      usageLimit: coupon.usageLimit || "",
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split("T")[0] : "",
      endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split("T")[0] : "",
      isActive: coupon.isActive
    });
    setShowCouponForm(true);
  };

  /* ================ TAX API ================ */
  const fetchTaxes = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/financial/taxes`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) setTaxes(data.taxes);
    } catch {
      showMessage("error", "Failed to fetch taxes");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  const createTax = async () => {
    try {
      const res = await fetch(`${API_URL}/financial/taxes`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(taxForm)
      });
      const data = await res.json();
      if (data.success) {
        showMessage("success", "Tax created successfully");
        fetchTaxes();
        setShowTaxForm(false);
        resetTaxForm();
      }
    } catch {
      showMessage("error", "Failed to create tax");
    }
  };

  const updateTax = async () => {
    try {
      const res = await fetch(`${API_URL}/financial/taxes/${editingTax._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(taxForm)
      });
      const data = await res.json();
      if (data.success) {
        showMessage("success", "Tax updated successfully");
        fetchTaxes();
        setShowTaxForm(false);
        setEditingTax(null);
        resetTaxForm();
      }
    } catch {
      showMessage("error", "Failed to update tax");
    }
  };

  const deleteTax = async (id) => {
    if (!confirm("Are you sure you want to delete this tax?")) return;
    try {
      const res = await fetch(`${API_URL}/financial/taxes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        showMessage("success", "Tax deleted");
        fetchTaxes();
      }
    } catch {
      showMessage("error", "Failed to delete tax");
    }
  };

  const resetTaxForm = () => {
    setTaxForm({
      name: "",
      country: "",
      state: "",
      zipCode: "",
      taxRate: "",
      taxType: "vat",
      isActive: true,
      priority: 0
    });
  };

  const editTax = (tax) => {
    setEditingTax(tax);
    setTaxForm({
      name: tax.name,
      country: tax.country,
      state: tax.state || "",
      zipCode: tax.zipCode || "",
      taxRate: tax.taxRate,
      taxType: tax.taxType,
      isActive: tax.isActive,
      priority: tax.priority || 0
    });
    setShowTaxForm(true);
  };

  /* ================ REFUND API ================ */
  const fetchRefunds = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/financial/refunds`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) setRefunds(data.refunds);
    } catch {
      showMessage("error", "Failed to fetch refunds");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  const fetchRefundStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/financial/refunds/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) setRefundStats(data.stats);
    } catch (err) {
      console.error("Failed to fetch refund stats", err);
    }
  }, []);

  const updateRefundStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/financial/refunds/${selectedRefund._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(refundForm)
      });
      const data = await res.json();
      if (data.success) {
        showMessage("success", "Refund status updated");
        fetchRefunds();
        fetchRefundStats();
        setShowRefundModal(false);
        setSelectedRefund(null);
      }
    } catch {
      showMessage("error", "Failed to update refund");
    }
  };

  const openRefundModal = (refund) => {
    setSelectedRefund(refund);
    setRefundForm({
      status: refund.status,
      adminNotes: refund.adminNotes || "",
      refundTransactionId: refund.refundTransactionId || ""
    });
    setShowRefundModal(true);
  };

  /* ================ PAYMENT SETTINGS API ================ */
  const fetchPaymentSettings = useCallback(async () => {
    try {
      let res = await fetch(`${API_URL}/financial/payment-settings`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      let data = await res.json();
      
      if (!data.success || data.settings.length === 0) {
        await fetch(`${API_URL}/financial/payment-settings/init`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        res = await fetch(`${API_URL}/financial/payment-settings`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        data = await res.json();
      }
      
      if (data.success) setPaymentSettings(data.settings);
    } catch {
      showMessage("error", "Failed to fetch payment settings");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  const updatePaymentSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/financial/payment-settings/${editingPayment.provider}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(paymentForm)
      });
      const data = await res.json();
      if (data.success) {
        showMessage("success", "Payment settings updated");
        fetchPaymentSettings();
        setShowPaymentForm(false);
        setEditingPayment(null);
      }
    } catch {
      showMessage("error", "Failed to update payment settings");
    }
  };

  const togglePaymentProvider = async (provider) => {
    try {
      const res = await fetch(`${API_URL}/financial/payment-settings/${provider}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        showMessage("success", `Payment provider ${data.settings.isEnabled ? "enabled" : "disabled"}`);
        fetchPaymentSettings();
      }
    } catch {
      showMessage("error", "Failed to toggle payment provider");
    }
  };

  const editPaymentSettings = (settings) => {
    setEditingPayment(settings);
    setPaymentForm({
      provider: settings.provider,
      displayName: settings.displayName,
      isEnabled: settings.isEnabled,
      isTestMode: settings.isTestMode,
      config: {
        keyId: settings.config?.keyId || "",
        keySecret: settings.config?.keySecret || "",
        publicKey: settings.config?.publicKey || "",
        privateKey: settings.config?.privateKey || "",
        webhookSecret: settings.config?.webhookSecret || "",
        merchantId: settings.config?.merchantId || "",
        clientId: settings.config?.clientId || "",
        clientSecret: settings.config?.clientSecret || ""
      },
      supportedCurrencies: settings.supportedCurrencies || ["INR"],
      processingFee: settings.processingFee || 0,
      processingFeeType: settings.processingFeeType || "percentage",
      minAmount: settings.minAmount || 1,
      maxAmount: settings.maxAmount || ""
    });
    setShowPaymentForm(true);
  };

  /* ================ RENDER HELPERS ================ */
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-blue-100 text-blue-700",
      processing: "bg-purple-100 text-purple-700",
      completed: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700"
    };
    return styles[status] || styles.inactive;
  };

  const getRefundReasonText = (reason) => {
    const reasons = {
      damaged: "Product Damaged",
      wrong_item: "Wrong Item Received",
      not_as_described: "Not as Described",
      changed_mind: "Changed Mind",
      late_delivery: "Late Delivery",
      other: "Other Reason"
    };
    return reasons[reason] || reason;
  };

  const tabs = [
    { id: "coupons", label: "Coupons", icon: <Ticket size={18} /> },
    { id: "taxes", label: "Tax Management", icon: <Percent size={18} /> },
    { id: "refunds", label: "Refunds", icon: <RotateCcw size={18} /> },
    { id: "payments", label: "Payment Gateways", icon: <CreditCard size={18} /> }
  ];

  useEffect(() => {
    if (activeTab === "coupons") fetchCoupons();
    if (activeTab === "taxes") fetchTaxes();
    if (activeTab === "refunds") {
      fetchRefunds();
      fetchRefundStats();
    }
    if (activeTab === "payments") fetchPaymentSettings();
  }, [activeTab, fetchCoupons, fetchTaxes, fetchRefunds, fetchRefundStats, fetchPaymentSettings]);
  return (
    <div className="space-y-6">
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
              message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 border-b border-amazon-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all ${
              activeTab === tab.id
                ? "text-amazon-accent border-b-2 border-amazon-accent"
                : "text-amazon-accent hover:text-amazon-accent"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "coupons" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-amazon-text">Promotional Codes</h3>
            <button
              onClick={() => { setEditingCoupon(null); resetCouponForm(); setShowCouponForm(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-amazon-accent text-white rounded-lg hover:bg-amazon-accent"
            >
              <Plus size={18} /> Create Coupon
            </button>
          </div>

          {showCouponForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-amazon-section rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Coupon Code</label>
                  <input type="text" value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" placeholder="SUMMER2024" />
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Description</label>
                  <input type="text" value={couponForm.description} onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" placeholder="20% off on all items" />
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Discount Type</label>
                  <select value={couponForm.discountType} onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Discount Value</label>
                  <input type="number" value={couponForm.discountValue} onChange={(e) => setCouponForm({ ...couponForm, discountValue: parseFloat(e.target.value) })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" />
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Min Order Amount</label>
                  <input type="number" value={couponForm.minOrderAmount} onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: parseFloat(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Max Discount</label>
                  <input type="number" value={couponForm.maxDiscountAmount} onChange={(e) => setCouponForm({ ...couponForm, maxDiscountAmount: e.target.value ? parseFloat(e.target.value) : "" })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" placeholder="No limit" />
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Usage Limit</label>
                  <input type="number" value={couponForm.usageLimit} onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value ? parseInt(e.target.value) : "" })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" placeholder="Unlimited" />
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Active</label>
                  <select value={couponForm.isActive} onChange={(e) => setCouponForm({ ...couponForm, isActive: e.target.value === "true" })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg">
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Start Date</label>
                  <input type="date" value={couponForm.startDate} onChange={(e) => setCouponForm({ ...couponForm, startDate: e.target.value })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" />
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">End Date</label>
                  <input type="date" value={couponForm.endDate} onChange={(e) => setCouponForm({ ...couponForm, endDate: e.target.value })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={editingCoupon ? updateCoupon : createCoupon} className="flex items-center gap-2 px-4 py-2 bg-amazon-accent text-white rounded-lg"><Save size={18} /> {editingCoupon ? "Update" : "Create"}</button>
                <button onClick={() => { setShowCouponForm(false); setEditingCoupon(null); }} className="px-4 py-2 border border-amazon-border text-amazon-accent rounded-lg">Cancel</button>
              </div>
            </motion.div>
          )}

          <div className="bg-white rounded-xl border border-amazon-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-amazon-section">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Discount</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Usage</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Valid Until</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-amazon-accent uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-t border-amazon-section">
                    <td className="px-4 py-3"><span className="font-mono font-bold text-amazon-text bg-amazon-section px-2 py-1 rounded">{coupon.code}</span></td>
                    <td className="px-4 py-3 text-amazon-text">{coupon.description}</td>
                    <td className="px-4 py-3">{coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}</td>
                    <td className="px-4 py-3 text-amazon-accent">{coupon.usageCount} / {coupon.usageLimit || "∞"}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold ${getStatusBadge(coupon.isActive ? "active" : "inactive")}`}>{coupon.isActive ? "Active" : "Inactive"}</span></td>
                    <td className="px-4 py-3 text-amazon-accent">{new Date(coupon.endDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => editCoupon(coupon)} className="p-1 text-amazon-accent hover:bg-amazon-section rounded"><Edit2 size={16} /></button>
                        <button onClick={() => deleteCoupon(coupon._id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr><td colSpan="7" className="px-4 py-8 text-center text-amazon-accent">No coupons found. Create your first promotional code!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === "taxes" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-amazon-text">Tax Rates by Region</h3>
            <button onClick={() => { setEditingTax(null); resetTaxForm(); setShowTaxForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-amazon-accent text-white rounded-lg"><Plus size={18} /> Add Tax Rate</button>
          </div>

          {showTaxForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-amazon-section rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Tax Name</label>
                  <input type="text" value={taxForm.name} onChange={(e) => setTaxForm({ ...taxForm, name: e.target.value })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" placeholder="GST 18%" />
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Country</label>
                  <input type="text" value={taxForm.country} onChange={(e) => setTaxForm({ ...taxForm, country: e.target.value })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" placeholder="India" />
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">State (Optional)</label>
                  <input type="text" value={taxForm.state} onChange={(e) => setTaxForm({ ...taxForm, state: e.target.value })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" placeholder="All States" />
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Tax Rate (%)</label>
                  <input type="number" step="0.01" value={taxForm.taxRate} onChange={(e) => setTaxForm({ ...taxForm, taxRate: parseFloat(e.target.value) })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" placeholder="18" />
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Tax Type</label>
                  <select value={taxForm.taxType} onChange={(e) => setTaxForm({ ...taxForm, taxType: e.target.value })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg">
                    <option value="vat">VAT</option>
                    <option value="gst">GST</option>
                    <option value="sales_tax">Sales Tax</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Active</label>
                  <select value={taxForm.isActive} onChange={(e) => setTaxForm({ ...taxForm, isActive: e.target.value === "true" })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg">
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={editingTax ? updateTax : createTax} className="flex items-center gap-2 px-4 py-2 bg-amazon-accent text-white rounded-lg"><Save size={18} /> {editingTax ? "Update" : "Add"}</button>
                <button onClick={() => { setShowTaxForm(false); setEditingTax(null); }} className="px-4 py-2 border border-amazon-border text-amazon-accent rounded-lg">Cancel</button>
              </div>
            </motion.div>
          )}

          <div className="bg-white rounded-xl border border-amazon-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-amazon-section">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Region</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-amazon-accent uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {taxes.map((tax) => (
                  <tr key={tax._id} className="border-t border-amazon-section">
                    <td className="px-4 py-3 font-medium text-amazon-text">{tax.name}</td>
                    <td className="px-4 py-3 text-amazon-accent">{tax.country}{tax.state && `, ${tax.state}`}</td>
                    <td className="px-4 py-3 text-amazon-text font-bold">{tax.taxRate}%</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-amazon-section rounded text-xs uppercase">{tax.taxType}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold ${getStatusBadge(tax.isActive ? "active" : "inactive")}`}>{tax.isActive ? "Active" : "Inactive"}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => editTax(tax)} className="p-1 text-amazon-accent hover:bg-amazon-section rounded"><Edit2 size={16} /></button>
                        <button onClick={() => deleteTax(tax._id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {taxes.length === 0 && (
                  <tr><td colSpan="6" className="px-4 py-8 text-center text-amazon-accent">No tax rates configured. Add your first tax rate!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === "refunds" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h3 className="text-lg font-bold text-amazon-text">Refund Management</h3>

          {refundStats && (
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-yellow-50 rounded-xl p-4">
                <p className="text-xs font-bold text-yellow-700 uppercase">Pending</p>
                <p className="text-2xl font-black text-amazon-text">{refundStats.pending}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-700 uppercase">Approved</p>
                <p className="text-2xl font-black text-amazon-text">{refundStats.approved}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-xs font-bold text-purple-700 uppercase">Processing</p>
                <p className="text-2xl font-black text-amazon-text">{refundStats.processing}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs font-bold text-green-700 uppercase">Completed</p>
                <p className="text-2xl font-black text-amazon-text">{refundStats.completed}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-amazon-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-amazon-section">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-amazon-accent uppercase">Date</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-amazon-accent uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((refund) => (
                  <tr key={refund._id} className="border-t border-amazon-section">
                    <td className="px-4 py-3 font-mono text-sm text-amazon-text">#{refund.orderId?._id?.slice(-6) || "N/A"}</td>
                    <td className="px-4 py-3 text-amazon-text">{refund.userId?.name || "Unknown"}</td>
                    <td className="px-4 py-3 font-bold text-amazon-text">${refund.totalRefundAmount?.toFixed(2) || "0.00"}</td>
                    <td className="px-4 py-3 text-amazon-accent text-sm">{getRefundReasonText(refund.reason)}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold ${getStatusBadge(refund.status)}`}>{refund.status}</span></td>
                    <td className="px-4 py-3 text-amazon-accent text-sm">{new Date(refund.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => openRefundModal(refund)} className="px-3 py-1 bg-amazon-accent text-white text-xs rounded hover:bg-amazon-accent">Process</button>
                    </td>
                  </tr>
                ))}
                {refunds.length === 0 && (
                  <tr><td colSpan="7" className="px-4 py-8 text-center text-amazon-accent">No refund requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {showRefundModal && selectedRefund && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90dvh] overflow-y-auto">
                <h4 className="text-lg font-bold text-amazon-text mb-4">Process Refund</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-amazon-accent uppercase">Status</label>
                    <select value={refundForm.status} onChange={(e) => setRefundForm({ ...refundForm, status: e.target.value })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg">
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-amazon-accent uppercase">Refund Transaction ID</label>
                    <input type="text" value={refundForm.refundTransactionId} onChange={(e) => setRefundForm({ ...refundForm, refundTransactionId: e.target.value })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" placeholder="Transaction reference" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-amazon-accent uppercase">Admin Notes</label>
                    <textarea value={refundForm.adminNotes} onChange={(e) => setRefundForm({ ...refundForm, adminNotes: e.target.value })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" rows="3" placeholder="Internal notes about this refund" />
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button onClick={updateRefundStatus} className="flex-1 py-2 bg-amazon-accent text-white rounded-lg hover:bg-amazon-accent">Update Status</button>
                  <button onClick={() => { setShowRefundModal(false); setSelectedRefund(null); }} className="flex-1 py-2 border border-amazon-border text-amazon-accent rounded-lg">Cancel</button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "payments" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h3 className="text-lg font-bold text-amazon-text">Payment Gateway Settings</h3>

          {showPaymentForm && editingPayment && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-amazon-section rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-amazon-text">Configure {paymentForm.displayName}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amazon-accent uppercase">Test Mode</span>
                  <button onClick={() => setPaymentForm({ ...paymentForm, isTestMode: !paymentForm.isTestMode })} className={`w-12 h-6 rounded-full transition-colors ${paymentForm.isTestMode ? "bg-amazon-accent" : "bg-gray-300"}`}>
                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${paymentForm.isTestMode ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(paymentForm.provider === "razorpay" || paymentForm.provider === "stripe") && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-amazon-accent uppercase">Key ID / Public Key</label>
                      <input type="text" value={paymentForm.config.keyId || paymentForm.config.publicKey} onChange={(e) => setPaymentForm({ ...paymentForm, config: { ...paymentForm.config, keyId: e.target.value, publicKey: e.target.value } })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" placeholder="rzp_test_..." />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-amazon-accent uppercase">Key Secret / Private Key</label>
                      <input type="password" value={paymentForm.config.keySecret || paymentForm.config.privateKey} onChange={(e) => setPaymentForm({ ...paymentForm, config: { ...paymentForm.config, keySecret: e.target.value, privateKey: e.target.value } })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" placeholder="Secret key" />
                    </div>
                  </>
                )}
                {paymentForm.provider === "paypal" && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-amazon-accent uppercase">Client ID</label>
                      <input type="text" value={paymentForm.config.clientId} onChange={(e) => setPaymentForm({ ...paymentForm, config: { ...paymentForm.config, clientId: e.target.value } })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-amazon-accent uppercase">Client Secret</label>
                      <input type="password" value={paymentForm.config.clientSecret} onChange={(e) => setPaymentForm({ ...paymentForm, config: { ...paymentForm.config, clientSecret: e.target.value } })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" />
                    </div>
                  </>
                )}
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Processing Fee (%)</label>
                  <input type="number" step="0.01" value={paymentForm.processingFee} onChange={(e) => setPaymentForm({ ...paymentForm, processingFee: parseFloat(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" placeholder="2.5" />
                </div>
                <div>
                  <label className="text-xs font-bold text-amazon-accent uppercase">Min Amount</label>
                  <input type="number" value={paymentForm.minAmount} onChange={(e) => setPaymentForm({ ...paymentForm, minAmount: parseFloat(e.target.value) || 1 })} className="w-full mt-1 px-3 py-2 border border-amazon-border rounded-lg" placeholder="1" />
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={updatePaymentSettings} className="flex items-center gap-2 px-4 py-2 bg-amazon-accent text-white rounded-lg"><Save size={18} /> Save Settings</button>
                <button onClick={() => { setShowPaymentForm(false); setEditingPayment(null); }} className="px-4 py-2 border border-amazon-border text-amazon-accent rounded-lg">Cancel</button>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentSettings.map((settings) => (
              <div key={settings._id} className={`bg-white rounded-xl border p-4 ${settings.isEnabled ? "border-amazon-accent" : "border-amazon-border"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${settings.isEnabled ? "bg-amazon-accent text-white" : "bg-amazon-section text-amazon-accent"}`}>
                      {settings.provider === "cash_on_delivery" ? <Banknote size={20} /> : settings.provider === "bank_transfer" ? <Globe size={20} /> : <CreditCard size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-amazon-text">{settings.displayName}</h4>
                      <p className="text-xs text-amazon-accent">{settings.isTestMode ? "Test Mode" : "Live Mode"}</p>
                    </div>
                  </div>
                  <button onClick={() => togglePaymentProvider(settings.provider)} className={`p-2 rounded-lg transition-colors ${settings.isEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    <Power size={18} />
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-amazon-section">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-amazon-accent">Processing Fee</span>
                    <span className="font-bold text-amazon-text">{settings.processingFee}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-amazon-accent">Currencies</span>
                    <span className="font-bold text-amazon-text">{settings.supportedCurrencies?.join(", ") || "INR"}</span>
                  </div>
                </div>
                <button onClick={() => editPaymentSettings(settings)} className="w-full mt-4 py-2 border border-amazon-border text-amazon-accent rounded-lg hover:bg-amazon-section text-sm font-medium">Configure</button>
              </div>
            ))}
            {paymentSettings.length === 0 && (
              <div className="col-span-2 text-center py-8 text-amazon-accent">Loading payment settings...</div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default AdminFinancial;
