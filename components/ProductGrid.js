"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 📱 Browser Back Press → Close Modal Instead of Page Back
  useEffect(() => {
    if (selectedProduct) {
      // যখন modal খোলে, তখন URL-এ state push করব
      window.history.pushState({ modalOpen: true }, "");
      const handlePopState = () => setSelectedProduct(null);
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [selectedProduct]);

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-gray-500 font-bold text-center mb-8">
          আমাদের পণ্য
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={() => console.log("Added to cart:", product.name)}
              onPreview={() => setSelectedProduct(product)} // ✅ Preview-এ modal খুলবে
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)} // ✅ বাইরে ক্লিক করলে modal বন্ধ হবে
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 animate-fadeIn"
            onClick={(e) => e.stopPropagation()} // ❗ modal content এ ক্লিক করলে বন্ধ হবে না
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl font-bold"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Left: Image */}
              <div className="flex items-center justify-center">
                <img
                  src={selectedProduct.imageURL}
                  alt={selectedProduct.name}
                  className="rounded-xl max-h-[500px] w-auto object-contain"
                />
              </div>

              {/* Right: Details */}
              <div className="flex flex-col justify-center">
                <h3 className="text-3xl text-gray-700 font-bold mb-3">
                  {selectedProduct.name}
                </h3>
                <p className="text-gray-500 line-through text-lg">
                  ৳{selectedProduct.regularPrice}
                </p>
                <p className="text-green-600 text-4xl font-extrabold mb-4">
                  ৳{selectedProduct.offerPrice}
                </p>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedProduct.details}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
