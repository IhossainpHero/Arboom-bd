"use client";

import { useCart } from "../app/context/context/CartContext";

export default function ProductCard({ product, onPreview }) {
  const { addToCart, cartItems } = useCart();

  // Check if product is already in cart
  const isInCart = cartItems.some((item) => item._id === product._id);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-200">
      {/* Image */}
      <div
        className="w-full cursor-pointer"
        onClick={() => onPreview?.(product)}
      >
        <img
          src={product.imageURL}
          alt={product.name}
          className="w-full h-44 object-contain rounded-t-lg bg-gray-50"
        />
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-sm sm:text-base font-bold text-gray-700 mb-1">
          {product.name}
        </h3>

        <p className="text-gray-400 line-through text-xs sm:text-sm">
          ৳{product.regularPrice}
        </p>
        <p className="text-green-600 text-lg sm:text-xl font-bold mb-3">
          ৳{product.offerPrice}
        </p>

        {/* Buttons */}
        <div className="flex gap-2 justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={isInCart}
            className={`flex-1 text-white font-semibold py-1 text-xs rounded-lg shadow transition-colors ${
              isInCart
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-400 hover:bg-amber-500"
            }`}
          >
            {isInCart ? "Already Selected" : "🛒 Add to Cart"}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview?.(product);
            }}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 text-xs rounded-lg shadow transition-colors"
          >
            👁 Preview
          </button>
        </div>
      </div>
    </div>
  );
}
