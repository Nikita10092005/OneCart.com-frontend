import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api";
import { FaTrash, FaSave, FaBoxOpen } from "react-icons/fa";

function stockHealth(stock) {
  const s = Number(stock);
  if (s === 0) return { label: "Out", cls: "bg-red-100 text-red-700 border-red-200" };
  if (s <= 10) return { label: "Low", cls: "bg-amber-100 text-amber-700 border-amber-200" };
  if (s <= 50) return { label: "Medium", cls: "bg-yellow-100 text-yellow-700 border-yellow-200" };
  return { label: "Healthy", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" };
}

function DeleteModal({ product, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4"
      >
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
          <FaTrash className="text-red-500 text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Delete Product?</h3>
        <p className="text-sm text-gray-500 mb-5">
          "<span className="font-medium text-gray-700">{product?.name}</span>" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition">
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function InventoryTab({ restockAlertActive }) {
  const [products, setProducts] = useState([]);
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    API.get("/seller/inventory")
      .then(r => {
        const data = r.data || [];
        setProducts(data);
        const initial = {};
        data.forEach(p => {
          initial[p._id] = { stock: p.stock, price: p.price, discount: p.discount || 0, description: p.description || "" };
        });
        setEdits(initial);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (id, field, value) => {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSave = async (id) => {
    setSaving(prev => ({ ...prev, [id]: true }));
    try {
      const res = await API.put(`/seller/inventory/${id}`, edits[id]);
      setProducts(prev => prev.map(p => p._id === id ? { ...p, ...res.data } : p));
      showToast("Product updated successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed", "error");
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/seller/inventory/${deleteTarget._id}`);
      setProducts(prev => prev.filter(p => p._id !== deleteTarget._id));
      showToast("Product deleted");
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-amazon-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!products.length) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
          <FaBoxOpen className="text-3xl text-amber-400" />
        </div>
        <p className="text-gray-500 font-medium">No products in inventory</p>
        <p className="text-sm text-gray-400">Upload products via Bulk Upload or add them manually</p>
      </motion.div>
    );
  }

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal product={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-amazon-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Health</th>
                <th className="px-4 py-3">Price (₹)</th>
                <th className="px-4 py-3">Discount (%)</th>
                <th className="px-4 py-3 min-w-[160px]">Description</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const edit = edits[p._id] || {};
                const health = stockHealth(edit.stock ?? p.stock);
                const isLowStock = Number(edit.stock ?? p.stock) <= 10;
                return (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-all ${restockAlertActive && isLowStock ? "ring-2 ring-red-400 ring-inset animate-pulse" : ""}`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-700 max-w-[160px] truncate">{p.name}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        value={edit.stock ?? p.stock}
                        onChange={e => handleEdit(p._id, "stock", e.target.value)}
                        className="w-20 px-2 py-1 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-amazon-accent focus:ring-1 focus:ring-amazon-accent/30"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${health.cls}`}>
                        {health.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={edit.price ?? p.price}
                        onChange={e => handleEdit(p._id, "price", e.target.value)}
                        className="w-24 px-2 py-1 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-amazon-accent focus:ring-1 focus:ring-amazon-accent/30"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={edit.discount ?? p.discount ?? 0}
                        onChange={e => handleEdit(p._id, "discount", e.target.value)}
                        className="w-20 px-2 py-1 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-amazon-accent focus:ring-1 focus:ring-amazon-accent/30"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={edit.description ?? p.description ?? ""}
                        onChange={e => handleEdit(p._id, "description", e.target.value)}
                        className="w-full min-w-[140px] px-2 py-1 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-amazon-accent focus:ring-1 focus:ring-amazon-accent/30"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleSave(p._id)}
                          disabled={saving[p._id]}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amazon-accent text-white text-xs font-bold hover:bg-amber-500 disabled:opacity-50 transition"
                        >
                          {saving[p._id] ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <FaSave size={10} />}
                          Save
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 border border-red-200 transition"
                        >
                          <FaTrash size={10} />
                          Del
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
