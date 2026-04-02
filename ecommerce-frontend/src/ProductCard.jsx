import React from "react";
import { useCart } from "./useCart";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-sm transition-all hover:shadow-md hover:border-orange-500/50">
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-900">
        <img
          src={product.image_url}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-sm font-bold text-white line-clamp-1">
            {product.title}
          </h3>
          <span className="text-lg font-bold text-orange-400">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <p className="mb-4 text-xs text-gray-400 line-clamp-2 italic">
          {product.description}
        </p>

        {/* Stock Status Section - Now properly placed below description */}
        <div className="flex items-center justify-between mb-4 mt-auto">
          {product.stock_quantity > 0 ? (
            <div className="flex flex-col">
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                In Stock
              </span>
              <span
                className={`text-xs font-medium ${
                  product.stock_quantity < 5 ? "text-rose-400 animate-pulse" : "text-gray-500"
                }`}
              >
                {product.stock_quantity} units available
              </span>
            </div>
          ) : (
            <span className="text-rose-600 text-[10px] font-black uppercase tracking-widest">
              Out of Stock
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock_quantity === 0}
          className={`w-full py-3 px-6 rounded-xl text-white transition-all duration-200 
            ${
              product.stock_quantity === 0
                ? "bg-gray-700 cursor-not-allowed opacity-50 text-gray-500"
                : "bg-linear-to-r from-rose-800  to-violet-1000 hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
            }`}
        >
          {product.stock_quantity === 0 ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
