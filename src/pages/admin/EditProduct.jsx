import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import API from "../../services/api";
import { imgUrl } from "../../utils/imageUrl";

const inputCls = "w-full bg-amazon-section/40 border border-amazon-border rounded-xl px-4 py-3 text-sm font-medium text-amazon-text focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent focus:bg-white transition-all placeholder:text-amazon-text-secondary/60";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName]               = useState("");
  const [price, setPrice]             = useState("");
  const [category, setCategory]       = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock]             = useState("");
  const [discount, setDiscount]       = useState("");
  const [image, setImage]             = useState(null);
  const [preview, setPreview]         = useState(null);
  const [moodTags, setMoodTags]       = useState([]);

  const formRef = useRef(null);

  useEffect(() => {
    (async () => {
      const res = await API.get(`/products/${id}`);
      const p   = res.data;
      setName(p.name || "");
      setPrice(p.price || "");
      setCategory(p.category || "");
      setDescription(p.description || "");
      setStock(p.stock || "");
      setDiscount(p.discount || "");
      if (p.moodTags) setMoodTags(p.moodTags);
      if (p.image) setPreview(p.image.startsWith("http") ? p.image : imgUrl(p.image));
    })();
  }, [id]);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
    }
  }, []);

  const update = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", name);
    form.append("price", price);
    form.append("category", category);
    form.append("description", description);
    form.append("stock", stock);
    form.append("discount", discount);
    moodTags.forEach(tag => form.append("moodTags[]", tag));
    if (image) form.append("image", image);
    await API.put(`/admin/product/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } });
    alert("Product updated ✅");
    navigate("/admin/products");
  };

  const categories = [
    { group: "Electronics",   items: ["Electronics|Mobiles","Electronics|Laptops","Electronics|Headphones","Electronics|Smart Watches","Electronics|Gaming Accessories"] },
    { group: "Men",           items: ["Men|Kurtas","Men|Blazers","Men|Shirts","Men|T-Shirts","Men|Jeans","Men|Lowers","Men|Accessories","Men|Footwear"] },
    { group: "Women",         items: ["Women|Kurtis","Women|Sarees","Women|Western Wear","Women|Jewellery","Women|Accessories","Women|Footwear"] },
    { group: "Kids",          items: ["Kids|Clothing","Kids|Toys","Kids|Accessories","Kids|Footwear"] },
    { group: "Home & Living", items: ["Home & Living|Furniture","Home & Living|Decor","Home & Living|Kitchen","Home & Living|Bedding","Home & Living|Storage"] },
    { group: "Beauty",        items: ["Beauty|Skincare","Beauty|Makeup","Beauty|Haircare","Beauty|Fragrance","Beauty|Personal Care"] },
    { group: "Books",         items: ["Books|Fiction","Books|Academic","Books|Exams","Books|Self-Help","Books|Children"] },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="pb-5 border-b border-amazon-section flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-amazon-text">Edit Product</h2>
          <p className="text-amazon-accent text-sm mt-0.5">Update product details and save changes</p>
        </div>
        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/admin/products")}
          className="px-4 py-2 border border-amazon-border text-amazon-accent text-sm font-bold rounded-xl hover:bg-amazon-section transition">
          ← Back
        </motion.button>
      </div>

      <form ref={formRef} onSubmit={update}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-amazon-section/30 border border-amazon-border rounded-2xl p-6 space-y-5">
              <h3 className="text-sm font-extrabold text-amazon-text flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-amazon-accent inline-block" />
                Core Details
              </h3>
              <div>
                <label className="block text-xs font-bold text-amazon-accent uppercase tracking-widest mb-1.5">Product Name</label>
                <input value={name} onChange={e => setName(e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-amazon-accent uppercase tracking-widest mb-1.5">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className={`${inputCls} resize-none`} />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 space-y-5">

            <div className="bg-amazon-section/30 border border-amazon-border rounded-2xl p-6 space-y-5">
              <h3 className="text-sm font-extrabold text-amazon-text flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-amazon-accent inline-block" />
                Attributes
              </h3>
              <div>
                <label className="block text-xs font-bold text-amazon-accent uppercase tracking-widest mb-1.5">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
                  <option value="">Select Category</option>
                  {categories.map(g => (
                    <optgroup key={g.group} label={g.group}>
                      {g.items.map(c => (
                        <option key={c} value={c}>{c.split("|")[1]}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <p className="text-[10px] text-amazon-text-secondary mt-1 ml-1">Current: <b>{category}</b></p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amazon-accent uppercase tracking-widest mb-1.5">Price (₹)</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amazon-accent uppercase tracking-widest mb-1.5">Stock</label>
                  <input type="number" value={stock} onChange={e => setStock(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-amazon-accent uppercase tracking-widest mb-1.5">Discount (%)</label>
                <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-amazon-accent uppercase tracking-widest mb-1.5">Mood Tags</label>
                <div className="flex gap-3 flex-wrap">
                  {["Casual", "Party", "Fitness"].map(mood => (
                    <label key={mood} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={moodTags.includes(mood)}
                        onChange={e => setMoodTags(prev => e.target.checked ? [...prev, mood] : prev.filter(t => t !== mood))}
                        className="accent-amazon-accent"
                      />
                      <span className="text-sm text-amazon-text font-medium">{mood}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* IMAGE */}
            <div className="bg-amazon-section/30 border border-amazon-border rounded-2xl p-6">
              <h3 className="text-sm font-extrabold text-amazon-text mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-amazon-accent inline-block" />
                Product Image
              </h3>
              {preview && (
                <div className="w-full h-36 bg-amazon-section rounded-xl overflow-hidden mb-3 flex items-center justify-center border border-amazon-border">
                  <img src={preview} alt="preview" className="max-h-full max-w-full object-contain p-2" />
                </div>
              )}
              <div className={`relative w-full h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all
                ${image ? "border-amazon-accent bg-amazon-section/50" : "border-amazon-border hover:border-amazon-border"}`}>
                <p className="text-xs font-bold text-amazon-accent">{image ? image.name : "Click to change image"}</p>
                <input type="file" accept="image/*" onChange={e => {
                  const f = e.target.files[0];
                  if (f) { setImage(f); setPreview(URL.createObjectURL(f)); }
                }} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            {/* SUBMIT */}
            <motion.button type="submit"
              whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(117,132,103,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text font-bold rounded-xl text-sm shadow-lg shadow-black/10">
              💾 Save Changes
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
