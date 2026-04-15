import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import API from "../../services/api";
import { imgUrl } from "../../utils/imageUrl";

const inputCls = "w-full bg-white border border-amazon-border rounded-xl px-4 py-3 text-sm font-medium text-amazon-text focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent transition-all placeholder:text-amazon-text-secondary/60";

const CATEGORIES = [
  { group: "Electronics",   items: ["Electronics|Mobiles","Electronics|Laptops","Electronics|Headphones","Electronics|Smart Watches","Electronics|Gaming Accessories"] },
  { group: "Men",           items: ["Men|Kurtas","Men|Blazers","Men|Shirts","Men|T-Shirts","Men|Jeans","Men|Lowers","Men|Accessories","Men|Footwear"] },
  { group: "Women",         items: ["Women|Kurtis","Women|Sarees","Women|Western Wear","Women|Jewellery","Women|Accessories","Women|Footwear"] },
  { group: "Kids",          items: ["Kids|Clothing","Kids|Toys","Kids|Accessories","Kids|Footwear"] },
  { group: "Home & Living", items: ["Home & Living|Furniture","Home & Living|Decor","Home & Living|Kitchen","Home & Living|Bedding","Home & Living|Storage"] },
  { group: "Beauty",        items: ["Beauty|Skincare","Beauty|Makeup","Beauty|Haircare","Beauty|Fragrance","Beauty|Personal Care"] },
  { group: "Books",         items: ["Books|Fiction","Books|Academic","Books|Exams","Books|Self-Help","Books|Children"] },
];

const MOOD_TAGS = ["Casual", "Party", "Fitness"];

const EMPTY = { name: "", price: "", category: "", description: "", stock: "", discount: "", moodTags: [] };

function Field({ label, error, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-black text-amazon-text-secondary uppercase tracking-widest mb-1.5">{label}</label>
      {children}
      {hint && !error && <p className="text-[11px] text-amazon-text-secondary mt-1">{hint}</p>}
      {error && <p className="text-[11px] text-red-500 mt-1 font-medium">⚠ {error}</p>}
    </div>
  );
}

function LivePreviewCard({ form, imagePreview }) {
  const discounted = form.price && form.discount
    ? Math.round(Number(form.price) * (1 - Number(form.discount) / 100))
    : null;

  return (
    <motion.div layout className="bg-white border border-amazon-border rounded-2xl overflow-hidden shadow-sm">
      <div className="h-44 bg-amazon-section flex items-center justify-center overflow-hidden">
        {imagePreview
          ? <img src={imagePreview} alt="preview" className="w-full h-full object-contain p-3" />
          : <div className="text-4xl opacity-30">📦</div>
        }
      </div>
      <div className="p-4 space-y-2">
        <p className="text-sm font-black text-amazon-text line-clamp-2">{form.name || <span className="text-amazon-text-secondary italic">Product name</span>}</p>
        <p className="text-xs text-amazon-text-secondary">{form.category?.split("|")[1] || "Category"}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-amazon-accent">
            ₹{discounted ? discounted.toLocaleString() : (form.price ? Number(form.price).toLocaleString() : "—")}
          </span>
          {discounted && <span className="text-xs text-amazon-text-secondary line-through">₹{Number(form.price).toLocaleString()}</span>}
          {form.discount > 0 && <span className="text-xs bg-red-50 text-red-500 border border-red-200 px-1.5 py-0.5 rounded-full font-bold">-{form.discount}%</span>}
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {form.stock !== "" && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              Number(form.stock) === 0 ? "bg-red-50 text-red-500 border-red-200"
              : Number(form.stock) < 10 ? "bg-amber-50 text-amber-600 border-amber-200"
              : "bg-emerald-50 text-emerald-600 border-emerald-200"
            }`}>
              {Number(form.stock) === 0 ? "Out of Stock" : Number(form.stock) < 10 ? `Low Stock (${form.stock})` : `In Stock (${form.stock})`}
            </span>
          )}
          {form.moodTags.map(t => (
            <span key={t} className="text-[10px] bg-purple-50 border border-purple-200 text-purple-600 px-2 py-0.5 rounded-full font-bold">{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AddProduct() {
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,  { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
      gsap.fromTo(rightRef.current, { x: 30,  opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, []);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleImage = (file) => {
    if (!file) return;
    // revoke previous blob URL to avoid memory leaks
    if (imagePreview && imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    else if (form.name.length < 3) e.name = "Name must be at least 3 characters";
    if (!form.price || Number(form.price) <= 0) e.price = "Enter a valid price";
    if (!form.category) e.category = "Select a category";
    if (form.stock !== "" && Number(form.stock) < 0) e.stock = "Stock cannot be negative";
    if (form.discount !== "" && (Number(form.discount) < 0 || Number(form.discount) > 99)) e.discount = "Discount must be 0–99%";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "moodTags") v.forEach(t => fd.append("moodTags[]", t));
        else fd.append(k, v);
      });
      if (image) fd.append("image", image);
      await API.post("/admin/product", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(true);
      setForm(EMPTY);
      setImage(null);
      setImagePreview(null);
      setTimeout(() => setSuccess(false), 4000);
    } catch { alert("Error adding product"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between pb-5 border-b border-amazon-section">
        <div>
          <h2 className="text-3xl font-black text-amazon-text">Add Product<span className="text-amazon-accent">.</span></h2>
          <p className="text-amazon-accent text-sm mt-0.5">Fill in the details to publish a new product to the store</p>
        </div>
        <div className="text-3xl">🛍️</div>
      </div>

      {/* SUCCESS BANNER */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-5 py-3 font-semibold">
            <span className="text-xl">✅</span> Product published successfully! It's now live in the store.
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── LEFT COLUMN ── */}
          <div ref={leftRef} className="lg:col-span-7 space-y-5">

            {/* Core Details */}
            <div className="bg-white border border-amazon-border rounded-2xl p-6 space-y-5 shadow-sm">
              <h3 className="text-sm font-black text-amazon-text flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-amazon-accent inline-block" /> Core Details
              </h3>

              <Field label="Product Name" error={errors.name}>
                <input value={form.name} onChange={set("name")} placeholder="e.g. Sony WH-1000XM6"
                  className={`${inputCls} ${errors.name ? "border-red-300 focus:ring-red-200" : ""}`} />
                <p className="text-[11px] text-amazon-text-secondary mt-1 text-right">{form.name.length}/100</p>
              </Field>

              <Field label="Description" hint="Describe key features, specs, and benefits">
                <textarea value={form.description} onChange={set("description")} rows={5}
                  placeholder="Describe the product features, materials, dimensions..."
                  className={`${inputCls} resize-none`} />
                <p className="text-[11px] text-amazon-text-secondary mt-1 text-right">{form.description.length} chars</p>
              </Field>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white border border-amazon-border rounded-2xl p-6 space-y-5 shadow-sm">
              <h3 className="text-sm font-black text-amazon-text flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-amazon-accent inline-block" /> Pricing & Inventory
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Price (₹)" error={errors.price}>
                  <input type="number" min="0" value={form.price} onChange={set("price")} placeholder="0"
                    className={`${inputCls} ${errors.price ? "border-red-300" : ""}`} />
                </Field>
                <Field label="Stock" error={errors.stock}>
                  <input type="number" min="0" value={form.stock} onChange={set("stock")} placeholder="0"
                    className={`${inputCls} ${errors.stock ? "border-red-300" : ""}`} />
                </Field>
                <Field label="Discount %" error={errors.discount} hint="0 = no discount">
                  <input type="number" min="0" max="99" value={form.discount} onChange={set("discount")} placeholder="0"
                    className={`${inputCls} ${errors.discount ? "border-red-300" : ""}`} />
                </Field>
              </div>
              {form.price && form.discount > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm">
                  <span className="text-emerald-600 font-black">
                    Final Price: ₹{Math.round(Number(form.price) * (1 - Number(form.discount) / 100)).toLocaleString()}
                  </span>
                  <span className="text-amazon-text-secondary line-through text-xs">₹{Number(form.price).toLocaleString()}</span>
                  <span className="ml-auto text-xs text-emerald-600 font-bold">Save ₹{(Number(form.price) - Math.round(Number(form.price) * (1 - Number(form.discount) / 100))).toLocaleString()}</span>
                </motion.div>
              )}
            </div>

            {/* Category & Tags */}
            <div className="bg-white border border-amazon-border rounded-2xl p-6 space-y-5 shadow-sm">
              <h3 className="text-sm font-black text-amazon-text flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-amazon-accent inline-block" /> Category & Tags
              </h3>
              <Field label="Category" error={errors.category}>
                <select value={form.category} onChange={set("category")}
                  className={`${inputCls} ${errors.category ? "border-red-300" : ""}`}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map(g => (
                    <optgroup key={g.group} label={g.group}>
                      {g.items.map(c => <option key={c} value={c}>{c.split("|")[1]}</option>)}
                    </optgroup>
                  ))}
                </select>
              </Field>
              <Field label="Mood Tags" hint="Select all that apply">
                <div className="flex gap-3 flex-wrap mt-1">
                  {MOOD_TAGS.map(mood => {
                    const active = form.moodTags.includes(mood);
                    return (
                      <button type="button" key={mood}
                        onClick={() => setForm(f => ({
                          ...f,
                          moodTags: active ? f.moodTags.filter(t => t !== mood) : [...f.moodTags, mood]
                        }))}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                          active ? "bg-amazon-accent text-white border-amazon-accent" : "bg-white text-amazon-text-secondary border-amazon-border hover:border-amazon-accent"
                        }`}>
                        {mood === "Casual" ? "👕" : mood === "Party" ? "🎉" : "💪"} {mood}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div ref={rightRef} className="lg:col-span-5 space-y-5">

            {/* Live Preview */}
            <div className="bg-white border border-amazon-border rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-black text-amazon-text flex items-center gap-2 mb-4">
                <span className="w-1 h-5 rounded-full bg-amazon-accent inline-block" /> Live Preview
              </h3>
              <LivePreviewCard form={form} imagePreview={imagePreview} />
            </div>

            {/* Image Upload */}
            <div className="bg-white border border-amazon-border rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-black text-amazon-text flex items-center gap-2 mb-4">
                <span className="w-1 h-5 rounded-full bg-amazon-accent inline-block" /> Product Image
              </h3>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleImage(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current?.click()}
                className={`relative w-full h-44 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                  ${dragOver ? "border-amazon-accent bg-amazon-section/60 scale-[1.01]" : image ? "border-amazon-accent bg-amazon-section/30" : "border-amazon-border bg-amazon-section/20 hover:border-amazon-accent hover:bg-amazon-section/40"}`}>
                {image ? (
                  <>
                    <img src={imagePreview} alt="preview" className="w-full h-full object-contain p-2 rounded-xl" />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all rounded-xl flex items-center justify-center">
                      <span className="opacity-0 hover:opacity-100 text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">Change Image</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-amazon-section rounded-xl border border-amazon-border flex items-center justify-center text-2xl">🖼</div>
                    <p className="text-xs font-bold text-amazon-accent">Drop image here or click to upload</p>
                    <p className="text-[10px] text-amazon-text-secondary">PNG, JPG, WEBP — max 10MB</p>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={e => handleImage(e.target.files[0])} className="hidden" />
              </div>
              {image && (
                <div className="flex items-center justify-between mt-2 px-1">
                  <p className="text-xs text-amazon-accent font-medium truncate max-w-[200px]">📎 {image.name}</p>
                  <button type="button" onClick={() => { setImage(null); setImagePreview(null); }}
                    className="text-xs text-red-400 hover:text-red-600 font-bold">Remove</button>
                </div>
              )}
            </div>

            {/* Submit */}
            <motion.button type="submit" disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.97 }}
              className="w-full py-4 bg-amazon-accent hover:bg-amazon-accent-hover text-white font-black rounded-xl text-sm shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Publishing...
                </>
              ) : "🚀 Publish Product"}
            </motion.button>

            {/* Error summary */}
            {Object.keys(errors).length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600 space-y-1">
                <p className="font-bold">Please fix the following:</p>
                {Object.values(errors).map((e, i) => <p key={i}>• {e}</p>)}
              </motion.div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
