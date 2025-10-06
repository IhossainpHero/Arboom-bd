"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";

// Shipping costs are defined here for easy modification
const shippingCost = {
  insideDhaka: 80,
  outsideDhaka: 120,
};

export default function ProductOrderForm({ products: initialProducts }) {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [shipping, setShipping] = useState("insideDhaka");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Initialize products
  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  // Handle product selection
  const handleProductSelection = (product) => {
    const isSelected = selectedProducts.some((p) => p._id === product._id);
    if (isSelected) {
      setSelectedProducts(
        selectedProducts.filter((p) => p._id !== product._id)
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p._id === productId ? { ...p, quantity: parseInt(newQuantity) || 1 } : p
      )
    );
  };

  // Calculate totals
  const { subtotal, total, finalShippingCost } = useMemo(() => {
    const calculatedSubtotal = selectedProducts.reduce(
      (acc, p) => acc + p.offerPrice * p.quantity,
      0
    );
    const calculatedShippingCost =
      shipping === "insideDhaka"
        ? shippingCost.insideDhaka
        : shippingCost.outsideDhaka;
    return {
      subtotal: calculatedSubtotal,
      total: calculatedSubtotal + calculatedShippingCost,
      finalShippingCost: calculatedShippingCost,
    };
  }, [selectedProducts, shipping]);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (selectedProducts.length === 0) {
      setMessage("অনুগ্রহ করে অন্তত একটি পণ্য নির্বাচন করুন।");
      setLoading(false);
      return;
    }
    if (!customerName || !phone || !address) {
      setMessage("⚠️ অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।");
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        customerName,
        phone,
        address,
        products: selectedProducts.map((p) => ({
          _id: p._id,
          name: p.name,
          price: p.offerPrice,
          imageURL: p.imageURL,
          quantity: p.quantity || 1,
        })),
        shipping,
        totalPrice: total,
      };

      const res = await axios.post("/api/orders", orderData);

      if (res.data.success) {
        setMessage("✅ আপনার অর্ডার সফলভাবে জমা হয়েছে!");
        setSelectedProducts([]);
        setCustomerName("");
        setPhone("");
        setAddress("");
      } else {
        setMessage("❌ অর্ডার জমা দিতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      setMessage("⚠️ অর্ডার জমা দিতে একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Title Section */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center mb-10">
          <h2 className="text-4xl font-extrabold text-green-700 leading-tight">
            অর্ডার করার জন্য নিচের ফর্মটি পূরণ করুন
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            আপনার পছন্দের পণ্যগুলো নির্বাচন করে আপনার তথ্য দিন।
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-5 rounded-2xl mb-8 text-center font-medium transition-all duration-300 ${
              message.includes("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-10">
            {/* Product Selection */}
            <div className="bg-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                🛒 পণ্য নির্বাচন করুন
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {products.map((product) => {
                  const isSelected = selectedProducts.some(
                    (p) => p._id === product._id
                  );
                  const currentQuantity = isSelected
                    ? selectedProducts.find((p) => p._id === product._id)
                        .quantity
                    : 1;

                  return (
                    <div
                      key={product._id}
                      className={`border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                        isSelected
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleProductSelection(product)}
                    >
                      <div className="flex items-center space-x-5">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={product.imageURL}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <p className="font-semibold text-lg text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            ৳{product.offerPrice}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Section */}
                      {isSelected && (
                        <div className="mt-6 flex items-center justify-between">
                          <p className="text-gray-700 font-medium">সংখ্যা:</p>
                          <div className="flex items-center space-x-2">
                            {/* ➖ Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (currentQuantity > 1) {
                                  handleQuantityChange(
                                    product._id,
                                    currentQuantity - 1
                                  );
                                }
                              }}
                              className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 active:scale-95 transition"
                            >
                              ➖
                            </button>

                            {/* Input */}
                            <input
                              type="number"
                              min="1"
                              value={currentQuantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  product._id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-16 text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />

                            {/* ➕ Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(
                                  product._id,
                                  currentQuantity + 1
                                );
                              }}
                              className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 active:scale-95 transition"
                            >
                              ➕
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Billing Info */}
            <div className="bg-white p-8 rounded-3xl shadow-xl space-y-8">
              <h3 className="text-2xl font-bold text-gray-800">
                📋 বিলিং তথ্য
              </h3>
              <div className="space-y-6">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  placeholder="আপনার নাম"
                  className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="01712345678"
                  className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows="4"
                  placeholder="ঠিকানা লিখুন"
                  className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>

              {/* Shipping */}
              <div className="border-t pt-8 space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  🚚 ডেলিভারি চার্জ
                </h3>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value="insideDhaka"
                    checked={shipping === "insideDhaka"}
                    onChange={(e) => setShipping(e.target.value)}
                    className="h-5 w-5 text-green-600"
                  />
                  <span>ঢাকার ভিতরে (৳{shippingCost.insideDhaka})</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value="outsideDhaka"
                    checked={shipping === "outsideDhaka"}
                    onChange={(e) => setShipping(e.target.value)}
                    className="h-5 w-5 text-green-600"
                  />
                  <span>ঢাকার বাইরে (৳{shippingCost.outsideDhaka})</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Section (Summary) */}
          <div className="lg:col-span-1 space-y-8 sticky top-8 self-start">
            <div className="bg-white p-8 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                📦 আপনার অর্ডার
              </h3>
              <div className="space-y-4 mb-6">
                {selectedProducts.length > 0 ? (
                  selectedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between py-2 border-b"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-md overflow-hidden">
                          <img
                            src={product.imageURL}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-base">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ৳{product.offerPrice} x {product.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-medium text-green-600">
                        ৳{product.offerPrice * product.quantity}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-lg text-center py-6">
                    কোনো পণ্য নির্বাচন করা হয়নি।
                  </p>
                )}
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="flex justify-between">
                  <span>সাবটোটাল</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ</span>
                  <span>৳{finalShippingCost}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold border-t pt-4 mt-4 text-green-700">
                  <span>মোট</span>
                  <span>৳{total}</span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || selectedProducts.length === 0}
              className="w-full py-5 text-white bg-green-600 rounded-2xl font-bold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "অর্ডার প্রক্রিয়া চলছে..." : `অর্ডার করুন ৳${total}`}
            </button>
          </div>
        </form>
      </div>
      {/* Credit Section */}
      <footer className="mt-10 bg-black text-white py-6 shadow-inner">
        <div className="text-center text-sm">
          <p className="text-gray-400">
            Copyright © 2025{" "}
            <span className="font-semibold tracking-wide text-white">
              arBoom bd
            </span>{" "}
            - Developed by{" "}
            <a
              href="https://imran-hossain-portfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:from-pink-400 hover:via-yellow-300 hover:to-blue-400 transition-colors duration-500"
            >
              Imran
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
