"use client";

import axios from "axios";
import { useMemo, useState } from "react";
import { useCart } from "../context/context/CartContext";

const shippingCost = {
  insideDhaka: 80,
  outsideDhaka: 120,
};

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [shipping, setShipping] = useState("insideDhaka");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { subtotal, total, finalShippingCost } = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce(
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
  }, [cartItems, shipping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (cartItems.length === 0) {
      setMessage("❌ আপনার কার্ট খালি!");
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        customerName,
        phone,
        address,
        shipping,
        totalPrice: total,
        products: cartItems.map((p) => ({
          _id: p._id,
          name: p.name,
          price: p.offerPrice,
          quantity: p.quantity,
          imageURL: p.imageURL,
        })),
      };

      const res = await axios.post("/api/orders", orderData);
      if (res.data.success) {
        setMessage("✅ আপনার অর্ডার সফলভাবে জমা হয়েছে!");
        clearCart();
        setCustomerName("");
        setPhone("");
        setAddress("");
      } else {
        setMessage("❌ অর্ডার ব্যর্থ হয়েছে!");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Billing Info */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl space-y-8"
        >
          <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
            📋 বিলিং তথ্য
          </h2>

          {message && (
            <div
              className={`p-4 rounded-xl text-center font-semibold ${
                message.includes("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Inputs */}
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

          {/* Shipping Section */}
          <div className="border-t pt-8 space-y-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              🚚 ডেলিভারি এলাকা
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <label
                className={`flex items-center justify-between px-5 py-3 border rounded-xl cursor-pointer transition-all ${
                  shipping === "insideDhaka"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-300 hover:border-green-400"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shipping"
                    value="insideDhaka"
                    checked={shipping === "insideDhaka"}
                    onChange={(e) => setShipping(e.target.value)}
                    className="w-5 h-5 accent-green-600"
                  />
                  <span className="text-gray-800 font-medium">
                    ঢাকার ভিতরে (৳{shippingCost.insideDhaka})
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center justify-between px-5 py-3 border rounded-xl cursor-pointer transition-all ${
                  shipping === "outsideDhaka"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-300 hover:border-green-400"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shipping"
                    value="outsideDhaka"
                    checked={shipping === "outsideDhaka"}
                    onChange={(e) => setShipping(e.target.value)}
                    className="w-5 h-5 accent-green-600"
                  />
                  <span className="text-gray-800 font-medium">
                    ঢাকার বাইরে (৳{shippingCost.outsideDhaka})
                  </span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className="w-full py-5 text-white bg-green-600 rounded-2xl font-bold text-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "অর্ডার প্রক্রিয়া চলছে..." : `অর্ডার করুন ৳${total}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            📦 আপনার অর্ডার
          </h3>
          <div className="space-y-4 mb-6">
            {cartItems.length > 0 ? (
              cartItems.map((product) => (
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
                      <p className="font-semibold text-base">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        ৳{product.offerPrice} × {product.quantity}
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
                আপনার কার্ট খালি।
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
