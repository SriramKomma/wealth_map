import React from "react";
import "./index.css";

const PriceFilter = ({ priceRange, setPriceRange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Price Range: ${priceRange[0].toLocaleString()} - $
        {priceRange[1].toLocaleString()}
      </label>
      <input
        type="range"
        min="0"
        max="2000000"
        step="10000"
        value={priceRange[0]}
        onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
        className="w-full"
      />
      <input
        type="range"
        min="0"
        max="2000000"
        step="10000"
        value={priceRange[1]}
        onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
        className="w-full"
      />
    </div>
  );
};

export default PriceFilter;
