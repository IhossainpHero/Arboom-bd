"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

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
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 animate-fadeIn">
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
