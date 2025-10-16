"use client";

import { useState } from "react";

export default function MyOrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFetchOrders = async () => {
    if (!phone.trim()) {
      setMessage("অনুগ্রহ করে ফোন নাম্বার লিখুন");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/my-orders?phone=${phone}`);
      const data = await res.json();

      if (data?.success && Array.isArray(data.data)) {
        setOrders(data.data);
        if (data.data.length === 0) setMessage("আপনার কোনো অর্ডার নেই।");
      } else {
        setOrders([]);
        setMessage("আপনার কোনো অর্ডার নেই।");
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
      setMessage("অর্ডার লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm("আপনি কি এই অর্ডারটি বাতিল করতে চান?")) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "cancelled" } : o
          )
        );
        alert("অর্ডার বাতিল করা হয়েছে।");
      } else {
        alert("অর্ডার বাতিল করা যায়নি।");
      }
    } catch (err) {
      console.error(err);
      alert("অর্ডার বাতিল করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-tight">
          🛍️ আমার অর্ডার
        </h1>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="📱 আপনার ফোন নাম্বার লিখুন"
            className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={handleFetchOrders}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md active:scale-95"
          >
            {loading ? "লোড হচ্ছে..." : "🔍 অর্ডার দেখুন"}
          </button>
        </div>

        {/* Message */}
        {message && (
          <p className="mb-6 text-center text-red-600 font-semibold bg-red-50 py-2 rounded-lg">
            {message}
          </p>
        )}

        {/* Empty State */}
        {orders.length === 0 && !message && (
          <div className="text-center py-12 text-gray-500">
            <img
              src="/no-orders.svg"
              alt="No orders"
              className="w-40 mx-auto mb-4 opacity-80"
            />
            <p className="text-lg font-medium">কোনো অর্ডার পাওয়া যায়নি</p>
          </div>
        )}

        {/* Orders */}
        {orders.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all shadow-sm hover:shadow-md"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-gray-600">{order.phone}</p>
                    <p className="text-sm text-gray-600">{order.address}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : order.status === "delivered"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Product list */}
                <div className="space-y-3">
                  {order.products?.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 border-b pb-2 last:border-none"
                    >
                      <img
                        src={p.imageURL}
                        alt={p.name}
                        className="w-14 h-14 object-cover rounded-lg border"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{p.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {p.quantity} × ৳{p.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-between items-center">
                  <p className="font-bold text-green-700 text-lg">
                    মোট: ৳{order.totalPrice}
                  </p>
                  {order.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition text-sm font-semibold shadow-sm active:scale-95"
                    >
                      বাতিল করুন
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
