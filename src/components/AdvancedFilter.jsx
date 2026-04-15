import { useState } from "react";

function AdvancedFilter({ setFilters }) {

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [rating, setRating] = useState(0);

  // HANDLE SIZE
  const toggleSize = (size) => {
    let updated = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];

    setSelectedSizes(updated);
    setFilters(prev => ({ ...prev, sizes: updated }));
  };

  // HANDLE BRAND
  const toggleBrand = (brand) => {
    let updated = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];

    setSelectedBrands(updated);
    setFilters(prev => ({ ...prev, brands: updated }));
  };

  // HANDLE RATING
  const handleRating = (value) => {
    setRating(value);
    setFilters(prev => ({ ...prev, rating: value }));
  };

  return (
    <div style={styles.box}>

      <h3>Filters</h3>

      {/* SIZE */}
      <div>
        <h4>Size</h4>
        {["S", "M", "L", "XL"].map(size => (
          <button
            key={size}
            onClick={() => toggleSize(size)}
            style={{
              ...styles.btn,
              background: selectedSizes.includes(size) ? "#00b4d8" : "#eee",
              color: selectedSizes.includes(size) ? "white" : "black"
            }}
          >
            {size}
          </button>
        ))}
      </div>

      {/* BRAND */}
      <div>
        <h4>Brand</h4>
        {["Nike", "Adidas", "Puma", "Zara"].map(brand => (
          <button
            key={brand}
            onClick={() => toggleBrand(brand)}
            style={{
              ...styles.btn,
              background: selectedBrands.includes(brand) ? "#ff4d6d" : "#eee",
              color: selectedBrands.includes(brand) ? "white" : "black"
            }}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* RATING */}
      <div>
        <h4>Rating</h4>
        {[5,4,3,2].map(r => (
          <div key={r} onClick={() => handleRating(r)} style={styles.rating}>
            ⭐ {r} & above
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdvancedFilter;

const styles = {
  box: {
    marginTop: "20px",
    padding: "15px",
    background: "var(--card)",
    borderRadius: "10px"
  },

  btn: {
    margin: "5px",
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  rating: {
    cursor: "pointer",
    padding: "5px 0"
  }
};