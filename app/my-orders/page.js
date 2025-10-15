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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">আমার অর্ডার</h1>

        <div className="flex gap-3 mb-6">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="আপনার ফোন নাম্বার লিখুন"
            className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleFetchOrders}
            className="px-5 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
          >
            {loading ? "লোড হচ্ছে..." : "অর্ডার দেখুন"}
          </button>
        </div>

        {message && (
          <p className="mb-6 text-center text-red-600 font-semibold">
            {message}
          </p>
        )}

        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border p-4 rounded-xl shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.phone}</p>
                    <p className="text-sm text-gray-600">{order.address}</p>
                  </div>
                  <div>
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
                </div>

                <div className="mt-3">
                  <ul className="space-y-2">
                    {order.products?.map((p, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <img
                          src={p.imageURL}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{p.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {p.quantity} × ৳{p.price}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <p className="font-bold text-green-700">
                    মোট: ৳{order.totalPrice}
                  </p>
                  {order.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="px-3 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600 transition text-sm"
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
