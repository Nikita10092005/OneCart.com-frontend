import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api";
import { imgUrl } from "../../utils/imageUrl";

const STOCK_BADGE = (stock) => {
  if (stock === 0) return { label: "Out of Stock", cls: "bg-red-50 text-red-500 border-red-200" };
  if (stock < 10) return { label: "Low Stock", cls: "bg-amber-50 text-amber-600 border-amber-200" };
  return { label: "In Stock", cls: "bg-emerald-50 text-emerald-600 border-emerald-200" };
};

function StatCard({ label, value, color = "text-amazon-accent" }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }}
      className="bg-white border border-amazon-border rounded-2xl px-5 py-4 min-w-[120px]">
      <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </motion.div>
  );
}

function ProductImage({ src, name }) {
  const [err, setErr] = useState(false);
  const url = err ? null : (src?.startsWith("http") ? src : imgUrl(src));
  return url ? (
    <img src={url} alt={name} onError={() => setErr(true)}
      className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-3xl text-amazon-text-secondary">📦</div>
  );
}

function QuickView({ product, onClose }) {
  const badge = STOCK_BADGE(product.stock ?? 0);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="h-52 bg-amazon-section flex items-center justify-center overflow-hidden">
          <ProductImage src={product.image} name={product.name} />
        </div>
        <div className="p-6 space-y-3">
          <div className="flex justify-between items-start gap-3">
            <h3 className="text-lg font-black text-amazon-text">{product.name}</h3>
            <button onClick={onClose} className="text-amazon-text-secondary hover:text-amazon-text text-xl leading-none">✕</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-amazon-section border border-amazon-border px-2 py-1 rounded-lg text-amazon-accent font-medium">{product.category}</span>
            <span className={`text-xs border px-2 py-1 rounded-lg font-medium ${badge.cls}`}>{badge.label} ({product.stock ?? 0})</span>
            {product.discount > 0 && (
              <span className="text-xs bg-red-50 border border-red-200 text-red-500 px-2 py-1 rounded-lg font-medium">{product.discount}% OFF</span>
            )}
            {product.moodTags?.map(t => (
              <span key={t} className="text-xs bg-purple-50 border border-purple-200 text-purple-600 px-2 py-1 rounded-lg font-medium">{t}</span>
            ))}
          </div>
          <p className="text-2xl font-black text-amazon-accent">
            ₹{product.price?.toLocaleString()}
            {product.discount > 0 && (
              <span className="text-sm text-amazon-text-secondary line-through ml-2">
                ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
              </span>
            )}
          </p>
          {product.description && <p className="text-sm text-amazon-text-secondary leading-relaxed">{product.description}</p>}
          <p className="text-xs text-amazon-text-secondary">Added: {new Date(product.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductCard({ p, selected, onSelect, onEdit, onDelete, onQuickView }) {
  const badge = STOCK_BADGE(p.stock ?? 0);
  const discountedPrice = p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      whileHover={{ y: -3, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
      className={`bg-white border rounded-2xl overflow-hidden group transition-all ${selected ? "border-amazon-accent ring-2 ring-amazon-accent/30" : "border-amazon-border"}`}
    >
      {/* Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input type="checkbox" checked={selected} onChange={() => onSelect(p._id)}
          className="w-4 h-4 accent-amazon-accent cursor-pointer" />
      </div>

      {/* Image */}
      <div className="relative w-full h-40 bg-amazon-section overflow-hidden cursor-pointer" onClick={() => onQuickView(p)}>
        <ProductImage src={p.image} name={p.name} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full transition-all">
            Quick View
          </span>
        </div>
        {p.discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            -{p.discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-bold text-amazon-text line-clamp-2 flex-1">{p.name}</h4>
        </div>
        <p className="text-[11px] text-amazon-text-secondary mb-2">{p.category}</p>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div>
            <span className="text-base font-extrabold text-amazon-accent">
              ₹{discountedPrice ? discountedPrice.toLocaleString() : p.price?.toLocaleString()}
            </span>
            {discountedPrice && (
              <span className="text-xs text-amazon-text-secondary line-through ml-1.5">₹{p.price?.toLocaleString()}</span>
            )}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.cls}`}>{badge.label}</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-amazon-text-secondary mb-3">
          <span>Stock: <strong className="text-amazon-text">{p.stock ?? 0}</strong></span>
          <span>{new Date(p.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
        </div>

        <div className="flex gap-2">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => onEdit(p._id)}
            className="flex-1 py-2 rounded-xl bg-amazon-section text-amazon-accent text-xs font-bold border border-amazon-border hover:bg-amazon-border transition">
            ✏️ Edit
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => onDelete(p._id)}
            className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold border border-red-200 hover:bg-red-100 transition">
            🗑 Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductRow({ p, selected, onSelect, onEdit, onDelete, onQuickView }) {
  const badge = STOCK_BADGE(p.stock ?? 0);
  const discountedPrice = p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : null;

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className={`bg-white border rounded-xl flex items-center gap-4 px-4 py-3 transition-all ${selected ? "border-amazon-accent ring-2 ring-amazon-accent/20" : "border-amazon-border"}`}>
      <input type="checkbox" checked={selected} onChange={() => onSelect(p._id)}
        className="w-4 h-4 accent-amazon-accent cursor-pointer shrink-0" />
      <div className="w-12 h-12 bg-amazon-section rounded-lg overflow-hidden shrink-0 cursor-pointer" onClick={() => onQuickView(p)}>
        <ProductImage src={p.image} name={p.name} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-amazon-text truncate">{p.name}</p>
        <p className="text-xs text-amazon-text-secondary">{p.category}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-extrabold text-amazon-accent">₹{discountedPrice ? discountedPrice.toLocaleString() : p.price?.toLocaleString()}</p>
        {discountedPrice && <p className="text-xs text-amazon-text-secondary line-through">₹{p.price?.toLocaleString()}</p>}
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full border shrink-0 ${badge.cls}`}>{badge.label}</span>
      <span className="text-xs text-amazon-text-secondary shrink-0 w-14 text-center">Stock: {p.stock ?? 0}</span>
      {p.discount > 0 && <span className="text-[10px] bg-red-50 border border-red-200 text-red-500 px-2 py-0.5 rounded-full font-bold shrink-0">-{p.discount}%</span>}
      <div className="flex gap-2 shrink-0">
        <button onClick={() => onEdit(p._id)}
          className="px-3 py-1.5 rounded-lg bg-amazon-section text-amazon-accent text-xs font-bold border border-amazon-border hover:bg-amazon-border transition">
          ✏️ Edit
        </button>
        <button onClick={() => onDelete(p._id)}
          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold border border-red-200 hover:bg-red-100 transition">
          🗑
        </button>
      </div>
    </motion.div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStock, setFilterStock] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [selected, setSelected] = useState(new Set());
  const [quickView, setQuickView] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/products");
        const data = Array.isArray(res.data) ? res.data : (res.data.products || []);
        setProducts(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
    return ["All", ...cats];
  }, [products]);

  const stats = useMemo(() => ({
    total: products.length,
    totalValue: products.reduce((s, p) => s + (p.price * (p.stock ?? 0)), 0),
    outOfStock: products.filter(p => (p.stock ?? 0) === 0).length,
    lowStock: products.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 10).length,
    discounted: products.filter(p => p.discount > 0).length,
  }), [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (filterCategory !== "All") list = list.filter(p => p.category === filterCategory);
    if (filterStock === "out") list = list.filter(p => (p.stock ?? 0) === 0);
    else if (filterStock === "low") list = list.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 10);
    else if (filterStock === "in") list = list.filter(p => (p.stock ?? 0) >= 10);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
    }
    if (sortBy === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "oldest") list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "stock-low") list.sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));
    else if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, filterCategory, filterStock, search, sortBy]);

  const toggleSelect = (id) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(p => p._id)));
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/admin/product/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    } catch { alert("Delete failed"); }
  };

  const bulkDelete = async () => {
    if (!selected.size) return;
    if (!window.confirm(`Delete ${selected.size} product(s)?`)) return;
    for (const id of selected) {
      try { await API.delete(`/admin/product/${id}`); } catch {}
    }
    setProducts(prev => prev.filter(p => !selected.has(p._id)));
    setSelected(new Set());
  };

  if (loading) return (
    <div className="flex h-60 items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="w-10 h-10 border-4 border-amazon-border border-t-amazon-accent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-amazon-section">
        <div>
          <h2 className="text-3xl font-black text-amazon-text">Manage Products<span className="text-amazon-accent">.</span></h2>
          <p className="text-amazon-accent text-sm mt-0.5">{products.length} products in store</p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/admin/add-product")}
          className="px-5 py-2.5 bg-amazon-accent hover:bg-amazon-accent-hover text-white font-bold text-sm rounded-xl shadow-md">
          ➕ Add Product
        </motion.button>
      </div>

      {/* STATS */}
      <div className="flex flex-wrap gap-3">
        <StatCard label="Total Products" value={stats.total} />
        <StatCard label="Inventory Value" value={`₹${stats.totalValue.toLocaleString()}`} />
        <StatCard label="Out of Stock" value={stats.outOfStock} color="text-red-500" />
        <StatCard label="Low Stock" value={stats.lowStock} color="text-amber-500" />
        <StatCard label="On Discount" value={stats.discounted} color="text-purple-600" />
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amazon-accent text-sm">🔍</span>
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-amazon-border rounded-xl text-sm text-amazon-text placeholder-amazon-text-secondary focus:outline-none focus:ring-2 focus:ring-amazon-accent/30" />
        </div>

        {/* Category */}
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="bg-white border border-amazon-border text-amazon-text text-sm font-medium px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amazon-accent/30">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>

        {/* Stock filter */}
        <select value={filterStock} onChange={e => setFilterStock(e.target.value)}
          className="bg-white border border-amazon-border text-amazon-text text-sm font-medium px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amazon-accent/30">
          <option value="All">All Stock</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="bg-white border border-amazon-border text-amazon-text text-sm font-medium px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amazon-accent/30">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-high">Price: High → Low</option>
          <option value="price-low">Price: Low → High</option>
          <option value="stock-low">Stock: Low → High</option>
          <option value="name">Name A–Z</option>
        </select>

        {/* View toggle */}
        <div className="flex bg-amazon-section border border-amazon-border rounded-xl overflow-hidden">
          {[["grid", "⊞"], ["list", "☰"]].map(([mode, icon]) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={`px-3 py-2 text-sm font-bold transition-all ${viewMode === mode ? "bg-amazon-accent text-white" : "text-amazon-text-secondary hover:bg-amazon-border"}`}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* BULK ACTIONS */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-amazon-text cursor-pointer">
            <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
              onChange={toggleSelectAll} className="w-4 h-4 accent-amazon-accent" />
            Select all ({filtered.length})
          </label>
          {selected.size > 0 && (
            <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              onClick={bulkDelete}
              className="px-3 py-1.5 bg-red-50 text-red-500 border border-red-200 text-xs font-bold rounded-lg hover:bg-red-100 transition">
              🗑 Delete {selected.size} selected
            </motion.button>
          )}
        </div>
        <p className="text-xs text-amazon-accent font-medium">Showing {filtered.length} of {products.length}</p>
      </div>

      {/* PRODUCT LIST */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-amazon-border rounded-2xl">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-amazon-text font-bold">No products found</p>
          <p className="text-sm text-amazon-accent mt-1">Try adjusting your filters</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 relative">
          <AnimatePresence>
            {filtered.map(p => (
              <div key={p._id} className="relative">
                <ProductCard p={p} selected={selected.has(p._id)}
                  onSelect={toggleSelect}
                  onEdit={id => navigate(`/admin/product/${id}/edit`)}
                  onDelete={remove}
                  onQuickView={setQuickView} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map(p => (
              <ProductRow key={p._id} p={p} selected={selected.has(p._id)}
                onSelect={toggleSelect}
                onEdit={id => navigate(`/admin/product/${id}/edit`)}
                onDelete={remove}
                onQuickView={setQuickView} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
      </AnimatePresence>
    </div>
  );
}

export default AdminProducts;
