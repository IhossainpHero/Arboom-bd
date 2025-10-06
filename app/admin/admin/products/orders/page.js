"use client";

import { useEffect, useMemo, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data?.success) setOrders(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const withStatus = useMemo(
    () =>
      orders.map((o) => ({
        status: o.status || "pending",
        ...o,
      })),
    [orders]
  );

  const filtered = useMemo(() => {
    return withStatus.filter((o) => {
      const keyword = q.trim().toLowerCase();
      const hit =
        !keyword ||
        o.customerName?.toLowerCase().includes(keyword) ||
        o.phone?.toLowerCase().includes(keyword) ||
        o.address?.toLowerCase().includes(keyword) ||
        o.products?.some((p) => p.name?.toLowerCase().includes(keyword));

      const statusOk = statusFilter === "all" || o.status === statusFilter;
      return hit && statusOk;
    });
  }, [withStatus, q, statusFilter]);

  const badgeClass = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "delivered":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white text-gray-700 px-6 py-4 rounded-xl shadow">
          লোড হচ্ছে...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Customer Orders
            </h1>
            <p className="text-gray-600 mt-1">
              মোট অর্ডার:{" "}
              <span className="font-semibold text-gray-800">
                {filtered.length}
              </span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <a
                href="/admin/dashboard"
                className="text-sm text-blue-600 hover:underline mt-4 inline-block"
              >
                &larr; ড্যাশবোর্ডে ফিরে যান
              </a>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search: name, phone, address, product..."
                className="w-full sm:w-80 rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder:text-gray-400"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔎
              </span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gradient-to-r from-green-600 to-emerald-600 text-white sticky top-0">
                <tr>
                  <th className="p-4 text-sm font-semibold">Customer</th>
                  <th className="p-4 text-sm font-semibold">Phone</th>
                  <th className="p-4 text-sm font-semibold min-w-[220px]">
                    Address
                  </th>
                  <th className="p-4 text-sm font-semibold min-w-[320px]">
                    Products
                  </th>
                  <th className="p-4 text-sm font-semibold">Shipping</th>
                  <th className="p-4 text-sm font-semibold">Status</th>
                  <th className="p-4 text-sm font-semibold">Total</th>
                  <th className="p-4 text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={
                      idx % 2 === 0
                        ? "bg-white hover:bg-gray-50"
                        : "bg-gray-50 hover:bg-gray-100"
                    }
                  >
                    {/* Customer */}
                    <td className="p-4 align-top">
                      <div className="font-semibold">{order.customerName}</div>
                      <div className="text-xs text-gray-500">
                        #{order._id?.slice(-6)}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-800">{order.phone}</span>
                        <button
                          type="button"
                          onClick={() =>
                            navigator.clipboard?.writeText(order.phone || "")
                          }
                          className="text-xs px-2 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                          title="Copy"
                        >
                          Copy
                        </button>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="p-4 align-top">
                      <div className="max-w-xs truncate text-gray-700">
                        {order.address}
                      </div>
                    </td>

                    {/* Products */}
                    <td className="p-4 align-top">
                      <ul className="space-y-3">
                        {order.products?.map((p, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden ring-1 ring-gray-200 flex-shrink-0">
                              <img
                                src={p.imageURL}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {p.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                Qty: {p.quantity} × ৳{p.price}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </td>

                    {/* Shipping */}
                    <td className="p-4 align-top">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium text-gray-700 border-gray-300 bg-gray-100">
                        {order.shipping === "insideDhaka"
                          ? "ঢাকার ভিতরে"
                          : "ঢাকার বাইরে"}
                      </span>
                    </td>

                    {/* Status (select) */}
                    <td className="p-4 align-top">
                      <select
                        value={order.status || "pending"}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            const res = await fetch(
                              `/api/orders/${order._id}`,
                              {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ status: newStatus }),
                              }
                            );
                            const data = await res.json();
                            if (data.success) {
                              setOrders((prev) =>
                                prev.map((o) =>
                                  o._id === order._id
                                    ? { ...o, status: newStatus }
                                    : o
                                )
                              );
                            } else {
                              alert("Failed to update status");
                            }
                          } catch (err) {
                            console.error(err);
                            alert("Error updating status");
                          }
                        }}
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeClass(
                          order.status || "pending"
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Total */}
                    <td className="p-4 align-top">
                      <div className="font-bold text-green-700">
                        ৳{order.totalPrice}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-4 align-top text-gray-700">
                      {new Date(order.createdAt).toLocaleString("bn-BD")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function escapeCSV(value) {
  const v = value ?? "";
  const needsQuotes = /[",\n]/.test(String(v));
  const escaped = String(v).replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}
