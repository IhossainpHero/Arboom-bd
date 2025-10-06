"use client";

import Image from "next/image";

export default function YourOrders({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center p-10 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">কোনো অর্ডার পাওয়া যায়নি।</h2>
        <p className="text-gray-600">আপনি এখনো কোনো অর্ডার করেননি।</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h3 className="text-xl font-bold">
                অর্ডার আইডি:{" "}
                <span className="text-blue-600">{order._id.substring(18)}</span>
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                তারিখ: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">ক্রেতার তথ্য</h4>
              <p>
                <strong>নাম:</strong> {order.customerName}
              </p>
              <p>
                <strong>ফোন:</strong> {order.phone}
              </p>
              <p>
                <strong>ঠিকানা:</strong> {order.address}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">ক্রয়কৃত পণ্য</h4>
              {order.products.map((product, index) => (
                <div key={index} className="flex items-center space-x-4 mt-2">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                    <Image
                      src={product.imageURL}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-gray-600">৳{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
