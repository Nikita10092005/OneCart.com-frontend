import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const inputCls = "w-full bg-amazon-section/50 border border-amazon-border text-amazon-text placeholder-amazon-text-secondary text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent focus:bg-white transition";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchCartCount } = useCart();

  const [name, setName]       = useState(user?.name || "");
  const [phone, setPhone]     = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("razorpay");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Coupon state
  const [couponCode, setCouponCode]       = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponData, setCouponData]       = useState(null); // { code, discountAmount, discountType, discountValue }
  const [couponError, setCouponError]     = useState("");

  // Tax state
  const [taxAmount, setTaxAmount] = useState(0);
  const [taxRate, setTaxRate]     = useState(0);
  const [taxLoading, setTaxLoading] = useState(false);

  // Wallet state
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);

  const headerRef = useRef(null);
  const leftRef   = useRef(null);
  const rightRef  = useRef(null);

  useEffect(() => {
    if (!user?._id) return;
    API.get(`/cart?userId=${user._id}`).then(r => setCartItems(r.data)).catch(() => {});
  }, [user]);

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(leftRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, delay: 0.1, ease: "power3.out" }
      );
      gsap.fromTo(rightRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, delay: 0.15, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  // Fetch wallet balance on mount
  useEffect(() => {
    if (!user?._id) return;
    API.get("/wallet/balance")
      .then(r => setWalletBalance(r.data.balance || 0))
      .catch(() => setWalletBalance(0))
      .finally(() => setWalletLoading(false));
  }, [user]);

  // Fetch applicable taxes on mount
  useEffect(() => {
    const fetchTax = async () => {
      setTaxLoading(true);
      try {
        const { data } = await API.post("/financial/taxes/calculate", {
          country: "IN",
          amount: 1000, // placeholder, we'll recalculate with real amount
        });
        if (data.success) {
          setTaxRate(data.taxRate || 0);
        }
      } catch {
        // No taxes configured — that's fine
      } finally {
        setTaxLoading(false);
      }
    };
    fetchTax();
  }, []);

  const subtotal   = cartItems.reduce((s, i) => {
    const price = Number(i.productId?.price) || 0;
    const qty   = Number(i.quantity) || 1;
    return s + price * qty;
  }, 0);
  const delivery   = subtotal > 0 ? 49 : 0;
  const discount   = couponData?.discountAmount || 0;
  const taxBase    = subtotal - discount;
  const tax        = taxRate > 0 ? Math.round((taxBase * taxRate) / 100) : 0;
  const total      = subtotal + delivery - discount + tax;

  const walletApplied    = payment === "wallet" ? Math.min(walletBalance, total) : 0;
  const razorpayRequired = payment === "wallet" ? total - walletApplied : 0;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    setCouponData(null);
    try {
      const { data } = await API.post("/financial/coupons/validate", {
        code: couponCode.trim().toUpperCase(),
        orderAmount: subtotal,
      });
      if (data.success) {
        setCouponData(data.coupon);
      } else {
        setCouponError(data.message || "Invalid coupon");
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponData(null);
    setCouponCode("");
    setCouponError("");
  };

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handleRazorpay = async () => {
    setErrorMsg("");

    // Guard: total must be a valid positive number
    const safeTotal = Math.round(Number(total));
    if (!safeTotal || safeTotal <= 0 || isNaN(safeTotal)) {
      setErrorMsg("Order total is invalid. Please refresh and try again.");
      setLoading(false);
      return;
    }

    const loaded = await loadRazorpay();
    if (!loaded) {
      setErrorMsg("Could not load payment gateway. Check your internet connection.");
      setLoading(false);
      return;
    }

    let razorpayOrder;
    try {
      const { data } = await API.post("/payment/create-order", { amount: safeTotal });
      if (!data.success) throw new Error(data.message);
      razorpayOrder = data.order;
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to initiate payment. Please try again.");
      setLoading(false);
      return;
    }

    // Guard: order_id must be present
    if (!razorpayOrder?.id) {
      setErrorMsg("Payment order creation failed. Please try again.");
      setLoading(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "OneCart.com",
      description: "Order Payment",
      order_id: razorpayOrder.id,
      handler: async (response) => {
        try {
          const verify = await API.post("/payment/verify", {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          });
          if (verify.data.success) {
            const orderRes = await API.post("/orders", {
              name, phone, address,
              payment: "Razorpay",
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              couponCode: couponData?.code,
              discount,
              tax,
            });
            fetchCartCount();
            navigate("/payment-success", {
              state: {
                paymentId: response.razorpay_payment_id,
                orderId: orderRes.data._id,
                amount: total,
              },
            });
          } else {
            setErrorMsg(verify.data.message || "Payment verification failed. Contact support.");
          }
        } catch (err) {
          setErrorMsg(err.response?.data?.message || "Payment verification failed. Contact support.");
        } finally {
          setLoading(false);
        }
      },
      prefill: { name, contact: phone, email: user?.email || "" },
      theme: { color: "#FF9900" },
      modal: {
        ondismiss: () => {
          setErrorMsg("Payment cancelled. You can try again.");
          setLoading(false);
        },
      },
    };

    new window.Razorpay(options).open();
  };

  const handleWallet = async () => {
    setErrorMsg("");
    if (razorpayRequired === 0) {
      // Wallet-only payment
      const orderRes = await API.post("/orders", {
        name, phone, address,
        payment: "Wallet",
        walletAmount: walletApplied,
        couponCode: couponData?.code,
        discount,
        tax,
      });
      fetchCartCount();
      navigate("/payment-success", { state: { orderId: orderRes.data._id, amount: total } });
    } else {
      // Partial wallet + Razorpay for the shortfall
      const safeRequired = Math.round(Number(razorpayRequired));
      const loaded = await loadRazorpay();
      if (!loaded) {
        setErrorMsg("Could not load payment gateway. Check your internet connection.");
        setLoading(false);
        return;
      }

      let razorpayOrder;
      try {
        const { data } = await API.post("/payment/create-order", { amount: safeRequired });
        if (!data.success) throw new Error(data.message);
        razorpayOrder = data.order;
      } catch (err) {
        setErrorMsg(err.response?.data?.message || err.message || "Failed to initiate payment. Please try again.");
        setLoading(false);
        return;
      }

      if (!razorpayOrder?.id) {
        setErrorMsg("Payment order creation failed. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "OneCart.com",
        description: "Order Payment (Partial Wallet)",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            const verify = await API.post("/payment/verify", {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            if (verify.data.success) {
              const orderRes = await API.post("/orders", {
                name, phone, address,
                payment: "Wallet+Razorpay",
                walletAmount: walletApplied,
                paymentId: response.razorpay_payment_id,
                couponCode: couponData?.code,
                discount,
                tax,
              });
              fetchCartCount();
              navigate("/payment-success", {
                state: {
                  paymentId: response.razorpay_payment_id,
                  orderId: orderRes.data._id,
                  amount: total,
                },
              });
            } else {
              setErrorMsg(verify.data.message || "Payment verification failed. Contact support.");
            }
          } catch (err) {
            setErrorMsg(err.response?.data?.message || "Payment verification failed. Contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: { name, contact: phone, email: user?.email || "" },
        theme: { color: "#6366f1" },
        modal: {
          ondismiss: () => {
            setErrorMsg("Payment cancelled. You can try again.");
            setLoading(false);
          },
        },
      };

      new window.Razorpay(options).open();
    }
  };

  const handleCOD = async () => {
    const orderRes = await API.post("/orders", {
      name, phone, address, payment: "COD",
      couponCode: couponData?.code,
      discount,
      tax,
    });
    fetchCartCount();
    navigate("/payment-success", { state: { orderId: orderRes.data._id, amount: total } });
  };

  const placeOrder = async () => {
    if (!name || !phone || !address) {
      setErrorMsg("Please fill in all delivery details.");
      return;
    }
    setErrorMsg("");
    setLoading(true);
    try {
      if (payment === "razorpay") await handleRazorpay();
      else if (payment === "wallet") await handleWallet();
      else { await handleCOD(); setLoading(false); }
    } catch (e) {
      setErrorMsg(e.response?.data?.message || "Order failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amazon-section py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div ref={headerRef} className="flex items-center gap-3 mb-8">
          <div className="w-1 h-7 rounded-full bg-amazon-accent" />
          <h1 className="text-2xl font-extrabold text-amazon-text">Checkout</h1>
        </div>

        {/* ERROR BANNER */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5">
              <span className="text-lg">⚠️</span>
              <p className="text-sm font-medium flex-1">{errorMsg}</p>
              <button onClick={() => setErrorMsg("")} className="text-red-400 hover:text-red-600 transition text-lg leading-none">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div ref={leftRef} className="lg:col-span-2 space-y-5">

            {/* DELIVERY DETAILS */}
            <div className="bg-white border border-amazon-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-amazon-text mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amazon-section text-amazon-accent flex items-center justify-center text-xs font-black border border-amazon-border">1</span>
                Delivery Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-amazon-text uppercase tracking-widest mb-1.5">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Pankaj Kumar" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amazon-text uppercase tracking-widest mb-1.5">Phone Number</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amazon-text uppercase tracking-widest mb-1.5">Full Address</label>
                  <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3}
                    placeholder="House No, Street, City, State, Pincode" className={`${inputCls} resize-none`} />
                </div>
              </div>
            </div>

            {/* COUPON CODE */}
            <div className="bg-white border border-amazon-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-amazon-text mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amazon-section text-amazon-accent flex items-center justify-center text-xs font-black border border-amazon-border">2</span>
                Promo Code
              </h2>

              <AnimatePresence mode="wait">
                {couponData ? (
                  <motion.div key="applied"
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 text-lg">🎉</span>
                      <div>
                        <p className="text-sm font-bold text-emerald-700">{couponData.code} applied!</p>
                        <p className="text-xs text-emerald-600">
                          You save ₹{couponData.discountAmount.toLocaleString()}
                          {couponData.discountType === "percentage" ? ` (${couponData.discountValue}% off)` : ""}
                        </p>
                      </div>
                    </div>
                    <button onClick={removeCoupon}
                      className="text-xs text-emerald-600 hover:text-red-500 font-bold border border-emerald-200 hover:border-red-200 px-2.5 py-1 rounded-lg transition">
                      Remove
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                        onKeyDown={e => e.key === "Enter" && applyCoupon()}
                        placeholder="Enter coupon code (e.g. SAVE10)"
                        className={`${inputCls} flex-1 uppercase font-mono tracking-widest`} />
                      <motion.button
                        onClick={applyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        whileHover={!couponLoading ? { scale: 1.02 } : {}}
                        whileTap={!couponLoading ? { scale: 0.97 } : {}}
                        className="px-5 py-3 bg-amazon-accent text-amazon-text font-bold rounded-xl text-sm disabled:opacity-50 flex-shrink-0 hover:bg-amazon-accent-hover">
                        {couponLoading
                          ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                              className="w-4 h-4 border-2 border-amazon-text border-t-transparent rounded-full" />
                          : "Apply"
                        }
                      </motion.button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                        <span>⚠️</span> {couponError}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-white border border-amazon-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-amazon-text mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amazon-section text-amazon-accent flex items-center justify-center text-xs font-black border border-amazon-border">3</span>
                Payment Method
              </h2>
              <div className="space-y-3">
                {/* RAZORPAY */}
                <motion.label whileHover={{ scale: 1.01 }} onClick={() => setPayment("razorpay")}
                  animate={payment === "razorpay"
                    ? { borderColor: "#FF9900", backgroundColor: "rgba(255,153,0,0.06)" }
                    : { borderColor: "#D5D9D9", backgroundColor: "#ffffff" }}
                  className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${payment === "razorpay" ? "border-amazon-accent" : "border-amazon-border"}`}>
                    <AnimatePresence>
                      {payment === "razorpay" && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                          className="w-2.5 h-2.5 rounded-full bg-amazon-accent" />
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-amazon-text">💳 Razorpay</p>
                    <p className="text-xs text-amazon-accent mt-0.5">Credit/Debit Card, UPI, Net Banking, Wallets</p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {["VISA", "UPI", "GPay", "NB"].map(b => (
                      <span key={b} className="text-xs bg-amazon-section border border-amazon-border text-amazon-accent px-2 py-0.5 rounded-md font-semibold">{b}</span>
                    ))}
                  </div>
                </motion.label>

                {/* COD */}
                <motion.label whileHover={{ scale: 1.01 }} onClick={() => setPayment("cod")}
                  animate={payment === "cod"
                    ? { borderColor: "#10b981", backgroundColor: "rgba(16,185,129,0.05)" }
                    : { borderColor: "#D5D9D9", backgroundColor: "#ffffff" }}
                  className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${payment === "cod" ? "border-emerald-500" : "border-amazon-border"}`}>
                    <AnimatePresence>
                      {payment === "cod" && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                          className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amazon-text">💵 Cash on Delivery</p>
                    <p className="text-xs text-amazon-accent mt-0.5">Pay when your order arrives</p>
                  </div>
                </motion.label>

                {/* WALLET */}
                {walletBalance > 0 && (
                  <>
                    <motion.label whileHover={{ scale: 1.01 }} onClick={() => setPayment("wallet")}
                      animate={payment === "wallet"
                        ? { borderColor: "#6366f1", backgroundColor: "rgba(99,102,241,0.05)" }
                        : { borderColor: "#D5D9D9", backgroundColor: "#ffffff" }}
                      className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${payment === "wallet" ? "border-indigo-500" : "border-amazon-border"}`}>
                        <AnimatePresence>
                          {payment === "wallet" && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                              className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                          )}
                        </AnimatePresence>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amazon-text">👛 OneCart Wallet</p>
                        <p className="text-xs text-indigo-500 mt-0.5">Available: ₹{walletBalance.toLocaleString()}</p>
                      </div>
                    </motion.label>
                    {payment === "wallet" && razorpayRequired > 0 && (
                      <p className="text-xs text-indigo-500 mt-1 px-1">
                        ₹{razorpayRequired.toLocaleString()} will be charged via Razorpay
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div ref={rightRef}>
            <div className="bg-white border border-amazon-border rounded-2xl p-6 sticky top-24 shadow-sm">
              <h2 className="text-base font-bold text-amazon-text mb-5 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-amazon-accent inline-block" />
                Order Summary
              </h2>

              {/* CART ITEMS */}
              <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <p className="text-amazon-text-secondary text-sm text-center py-4">Cart is empty</p>
                ) : cartItems.map((item, i) => (
                  <motion.div key={item._id}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3">
                    <img
                      src={item.productId?.image
                        ? item.productId.image.startsWith("http")
                          ? item.productId.image
                          : `${import.meta.env.VITE_API_URL}/uploads/${item.productId.image}`
                        : null}
                      alt={item.productId?.name || ""}
                      onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                      className="w-12 h-12 rounded-xl object-contain bg-amazon-section border border-amazon-border p-1 flex-shrink-0" />
                    <div className="w-12 h-12 rounded-xl bg-amazon-section border border-amazon-border flex-shrink-0 items-center justify-center text-lg hidden">🛍️</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-amazon-text truncate">{item.productId?.name}</p>
                      <p className="text-xs text-amazon-accent">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-amazon-price flex-shrink-0">
                      ₹{((item.productId?.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* PRICE BREAKDOWN */}
              <div className="border-t border-amazon-border pt-4 space-y-2.5">
                <div className="flex justify-between text-sm text-amazon-text">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-amazon-text">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? "text-emerald-600 font-semibold" : ""}>
                    {delivery === 0 ? "Free" : `₹${delivery}`}
                  </span>
                </div>

                {/* COUPON DISCOUNT */}
                <AnimatePresence>
                  {discount > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between text-sm text-emerald-600 font-semibold">
                      <span>🎉 Coupon ({couponData?.code})</span>
                      <span>−₹{discount.toLocaleString()}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* TAX */}
                <AnimatePresence>
                  {tax > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between text-sm text-amazon-text">
                      <span>Tax ({taxRate}% GST)</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* WALLET APPLIED */}
                <AnimatePresence>
                  {walletApplied > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between text-sm text-indigo-600 font-semibold">
                      <span>👛 Wallet Applied</span>
                      <span>−₹{walletApplied.toLocaleString()}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between text-base font-extrabold text-amazon-text border-t border-amazon-border pt-3 mt-1">
                  <span>Total</span>
                  <span className="text-amazon-price">₹{total.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <p className="text-xs text-emerald-600 font-semibold text-center bg-emerald-50 rounded-lg py-1.5">
                    🎉 You're saving ₹{discount.toLocaleString()} on this order!
                  </p>
                )}
              </div>

              {/* PAY BUTTON */}
              <motion.button
                onClick={placeOrder}
                disabled={loading || cartItems.length === 0}
                whileHover={!loading && cartItems.length > 0 ? { scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" } : {}}
                whileTap={!loading && cartItems.length > 0 ? { scale: 0.97 } : {}}
                className={`w-full mt-5 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg
                  ${payment === "razorpay"
                    ? "bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text shadow-black/10"
                    : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-emerald-500/20"}
                  disabled:opacity-50 disabled:cursor-not-allowed`}>
                {loading
                  ? <span className="flex items-center justify-center gap-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                      Processing...
                    </span>
                  : payment === "razorpay"
                    ? `💳 Pay ₹${total.toLocaleString()}`
                    : `🚀 Place Order (COD)`
                }
              </motion.button>

              <p className="text-center text-xs text-amazon-text-secondary mt-3">
                🔒 Secured by Razorpay · 256-bit SSL
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LOADING OVERLAY */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-12 h-12 border-4 border-white border-t-transparent rounded-full" />
            <p className="text-white font-semibold text-sm tracking-wide">Processing your payment...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
