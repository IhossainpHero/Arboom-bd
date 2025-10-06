"use client";

import axios from "axios";
import { useState } from "react";

export default function OrderForm({ product, onClose }) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const orderData = {
        customerName,
        phone,
        address,
        products: [
          {
            name: product.name,
            price: product.offerPrice,
            imageURL: product.imageURL,
          },
        ],
      };

      const res = await axios.post("/api/orders", orderData);

      if (res.data.success) {
        setMessage("আপনার অর্ডারটি সফলভাবে জমা হয়েছে! ধন্যবাদ।");
        setCustomerName("");
        setPhone("");
        setAddress("");
      } else {
        setMessage("অর্ডার জমা দিতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      setMessage("অর্ডার জমা দিতে একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">অর্ডার সম্পন্ন করুন</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl font-bold"
          >
            &times;
          </button>
        </div>

        {message && (
          <p className="text-center mb-4 text-green-600">{message}</p>
        )}

        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-blue-600 font-bold">৳{product.offerPrice}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              আপনার নাম
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ফোন নম্বর
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ঠিকানা
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows="3"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "অর্ডার হচ্ছে..." : "অর্ডার করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}
