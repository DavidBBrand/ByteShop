import React from "react";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image_url}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-slate-700 backdrop-blur-sm">
            {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-sm font-bold text-slate-800 line-clamp-1">
            {product.title}
          </h3>
          <span className="text-lg font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <p className="mb-4 text-xs text-slate-500 line-clamp-2">
          {product.description}
        </p>

        {/* Action Button */}
        <button
          onClick={() => addToCart(product)}
          className="w-full mt-4 py-3 px-6 rounded-xl font-bold text-white 
             bg-gradient-to-r from-orange-500 via-orange-600 to-rose-600 
             hover:from-orange-400 hover:via-orange-500 hover:to-rose-500 
             active:scale-95 transition-all duration-200 
             shadow-[0_4px_15px_rgba(249,115,22,0.4)] 
             hover:shadow-[0_6px_20px_rgba(249,115,22,0.6)]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
