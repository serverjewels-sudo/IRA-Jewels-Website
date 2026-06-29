"use client";

import { useState } from "react";

export default function ProductGallery({ product }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="w-full lg:w-[55%] flex flex-col">
      {/* Main large image */}
      <div className="aspect-square w-full bg-white border border-[#F3F1EC] overflow-hidden relative">
        <img
          src={product.images[activeImageIndex]}
          alt={`${product.name} main view`}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      {/* Row of thumbnails */}
      <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
        {product.images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImageIndex(idx)}
            className={`w-20 h-20 flex-shrink-0 relative overflow-hidden bg-white cursor-pointer transition-all duration-300 ${
              activeImageIndex === idx
                ? "border-2 border-[#CDB38B]"
                : "border border-[#F3F1EC] hover:border-[#CDB38B]/50"
            }`}
            aria-label={`View detail image ${idx + 1}`}
          >
            <img
              src={img}
              alt={`${product.name} view ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
