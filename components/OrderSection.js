"use client";

import Image from "next/image";
import Link from "next/link";

export default function OrdersSection({ orders }) {
  const latestOrders = orders.slice(0, 3);

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">আপনার সাম্প্রতিক অর্ডার</h2>
          <Link
            href="/orders"
            className="text-blue-600 font-semibold hover:underline"
          >
            সব অর্ডার দেখুন
          </Link>
        </div>

        {latestOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="text-gray-500 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <h3 className="font-bold text-lg mb-2">
                  অর্ডার আইডি:{" "}
                  <span className="text-blue-600">
                    {order._id.substring(18)}
                  </span>
                </h3>

                <div className="flex items-center space-x-4">
                  {order.products.slice(0, 1).map((product, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0"
                    >
                      <Image
                        src={product.imageURL}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  ))}
                  <div>
                    <p className="font-medium">{order.products[0]?.name}</p>
                    <p className="text-gray-600">
                      মোট পণ্য: {order.products.length}
                    </p>
                    <p className="text-gray-600">
                      মোট মূল্য: ৳
                      {order.products.reduce((acc, p) => acc + p.price, 0)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-2">কোনো অর্ডার নেই!</h3>
            <p className="text-gray-600">
              এখনই আপনার পছন্দের শাড়ি অর্ডার করুন।
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
