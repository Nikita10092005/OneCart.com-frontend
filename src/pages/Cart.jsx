import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from '../context/CartContext';
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { imgUrl } from "../utils/imageUrl";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {fetchCartCount} = useCart();
  const [error,setError] = useState('');

  const fetchCart = useCallback(async () => {
    try {const res = await API.get('/cart');setCart(res.data);setError('');}
    catch(e) {setError(e.response?.data?.message || 'Unable to load cart');}
    finally {setLoading(false);}
  },[]);
  useEffect(() => {fetchCart();},[fetchCart]);
  const change = async action => {try {await action();await fetchCart();await fetchCartCount();} catch(e) {setError(e.response?.data?.message || 'Unable to update cart');}};
  const increase = item => change(()=>API.put('/cart/'+item._id,{quantity:item.quantity+1}));
  const decrease = item => item.quantity > 1 && change(()=>API.put('/cart/'+item._id,{quantity:item.quantity-1}));
  const removeItem = id => change(()=>API.delete('/cart/'+id));
  const subtotal = cart.reduce((acc, item) => acc + (item.productId?.price || 0) * item.quantity, 0);
  const delivery = subtotal > 0 ? 49 : 0;
  const total = subtotal + delivery;

  if (loading) return (
    <div className="min-h-screen bg-amazon-section flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="w-10 h-10 border-4 border-amazon-border border-t-amazon-accent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-amazon-section py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8">
          <div className="w-1 h-7 rounded-full bg-amazon-accent" />
          <h1 className="text-2xl font-extrabold text-amazon-text">
            Your Cart
            {cart.length > 0 && (
              <span className="ml-3 text-sm font-semibold bg-amazon-accent/15 text-amazon-accent border border-amazon-border/40 px-2.5 py-0.5 rounded-full">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </span>
            )}
          </h1>
        </motion.div>

        {cart.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-6xl mb-5">🛒</p>
            <h2 className="text-xl font-bold text-amazon-text mb-2">Your cart is empty</h2>
            <p className="text-amazon-accent text-sm mb-8">Add some products to get started</p>
            <motion.button onClick={() => navigate("/home")}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-3 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold rounded-xl shadow-lg shadow-black/10">
              Continue Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* CART ITEMS */}
            <div className="flex-1 space-y-4">
              <AnimatePresence>
                {cart.map((item, i) => (
                  <motion.div key={item._id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30, height: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}
                    className="bg-white border border-amazon-border rounded-2xl p-5 flex gap-5 group">

                    <div className="w-24 h-24 flex-shrink-0 bg-amazon-section rounded-xl flex items-center justify-center overflow-hidden border border-amazon-border">
                      <motion.img
                        src={imgUrl(item.productId?.image)}
                        alt={item.productId?.name}
                        whileHover={{ scale: 1.08 }}
                        onError={e => { e.target.src = ""; e.target.style.display = "none"; }}
                        className="w-full h-full object-contain p-2" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-amazon-text mb-1 line-clamp-2">{item.productId?.name}</h3>
                      <p className="text-xs text-amazon-accent mb-3">{item.productId?.category}</p>
                      <p className="text-lg font-extrabold text-amazon-price">
                        ₹{((item.productId?.price || 0) * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-amazon-accent mt-0.5">₹{item.productId?.price?.toLocaleString()} each</p>
                    </div>

                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      <motion.button onClick={() => removeItem(item._id)} whileHover={{ scale: 1.05 }}
                        className="text-xs text-amazon-accent hover:text-red-400 transition px-2 py-1 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200">
                        ✕ Remove
                      </motion.button>

                      <div className="flex items-center gap-2 bg-amazon-section border border-amazon-border rounded-xl p-1">
                        <motion.button onClick={() => decrease(item)} whileTap={{ scale: 0.85 }}
                          className="w-8 h-8 rounded-lg bg-white text-amazon-accent hover:bg-amazon-accent hover:text-amazon-text font-bold text-lg flex items-center justify-center transition shadow-sm">
                          −
                        </motion.button>
                        <span className="w-8 text-center text-sm font-bold text-amazon-text">{item.quantity}</span>
                        <motion.button onClick={() => increase(item)} whileTap={{ scale: 0.85 }}
                          className="w-8 h-8 rounded-lg bg-white text-amazon-accent hover:bg-amazon-accent hover:text-amazon-text font-bold text-lg flex items-center justify-center transition shadow-sm">
                          +
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ORDER SUMMARY */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white border border-amazon-border rounded-2xl p-6 sticky top-24 shadow-sm">
                <h2 className="text-base font-bold text-amazon-text mb-5 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-amazon-accent inline-block" />
                  Order Summary
                </h2>

                <div className="space-y-3 mb-5 max-h-48 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item._id} className="flex justify-between items-center text-sm">
                      <span className="text-amazon-accent truncate max-w-[160px]">
                        {item.productId?.name} × {item.quantity}
                      </span>
                      <span className="text-amazon-text font-semibold flex-shrink-0 ml-2">
                        ₹{((item.productId?.price || 0) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-amazon-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm text-amazon-text">
                    <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-amazon-text">
                    <span>Delivery</span>
                    <span className="text-emerald-600">₹{delivery}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-amazon-text border-t border-amazon-border pt-3">
                    <span>Total</span>
                    <span className="text-amazon-price">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <motion.button onClick={() => navigate("/checkout")}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-3.5 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold rounded-xl text-sm shadow-lg shadow-black/10">
                  Proceed to Checkout →
                </motion.button>

                <motion.button onClick={() => navigate("/home")} whileHover={{ scale: 1.01 }}
                  className="w-full mt-3 py-2.5 bg-transparent border border-amazon-border text-amazon-accent hover:border-amazon-accent font-semibold rounded-xl transition text-sm">
                  Continue Shopping
                </motion.button>

                <p className="text-center text-xs text-amazon-text-secondary mt-4">🔒 Secure checkout</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
