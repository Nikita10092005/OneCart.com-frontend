import { motion } from "framer-motion";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function PriceFilter({ priceRange, setPriceRange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="mt-4 bg-white border border-amazon-border rounded-2xl p-4 shadow-sm">
      <p className="text-xs font-bold text-amazon-text uppercase tracking-widest mb-4">Price Range</p>

      <Slider
        range
        min={0}
        max={100000}
        step={500}
        value={priceRange}
        onChange={setPriceRange}
        styles={{
          track: { backgroundColor: "#FF9900" },
          handle: { borderColor: "#FF9900", backgroundColor: "#FF9900", opacity: 1 },
          rail: { backgroundColor: "#DDDDDD" },
        }}
      />

      <div className="flex justify-between mt-3">
        <span className="text-xs font-semibold text-amazon-accent">₹{priceRange[0].toLocaleString()}</span>
        <span className="text-xs font-semibold text-amazon-accent">₹{priceRange[1].toLocaleString()}</span>
      </div>

      <div className="flex gap-2 mt-3 flex-wrap">
        {[[0,1000],[1000,5000],[5000,20000],[20000,100000]].map(([min,max]) => (
          <motion.button key={min}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPriceRange([min, max])}
            className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium
              ${priceRange[0] === min && priceRange[1] === max
                ? "bg-amazon-accent border-amazon-accent text-amazon-text"
                : "bg-amazon-section border-amazon-border text-amazon-accent hover:border-amazon-accent"}`}>
            {min === 0 ? `Under ₹1k` : min === 20000 ? `₹20k+` : `₹${min/1000}k–₹${max/1000}k`}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
