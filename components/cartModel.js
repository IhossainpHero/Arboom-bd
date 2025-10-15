"use client";

import { useRouter } from "next/navigation";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useCart } from "../app/context/context/CartContext";

export default function CartModal() {
  const { cartItems, isCartOpen, closeCart, updateQuantity, removeFromCart } =
    useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  const total = cartItems.reduce(
    (acc, it) => acc + Number(it.offerPrice) * it.quantity,
    0
  );

  const handleCheckout = () => {
    closeCart(); // Modal বন্ধ হবে
    router.push("/checkout"); // Checkout পেজে যাবে
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Modal Box */}
      <div
        className="
          relative bg-gradient-to-br from-white via-slate-50 to-gray-100
          shadow-2xl rounded-2xl p-5
          w-[92%] sm:w-[420px] md:w-[480px]
          animate-fadeIn border border-gray-200
        "
        style={{
          maxHeight: "80vh",
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeCart}
          className="
            absolute top-3 right-3 z-[120] 
            flex items-center justify-center
            w-9 h-9
            rounded-full
            text-gray-600
            hover:text-white
            hover:bg-red-500
            shadow-md
            transition-all duration-200
            cursor-pointer
          "
          aria-label="Close cart"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center drop-shadow-sm">
          🛒 আপনার কার্ট
        </h2>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center mt-10 text-lg">
            🛍️ আপনার কার্ট খালি আছে
          </p>
        ) : (
          <>
            {/* Scrollable Items */}
            <div
              className="space-y-5 overflow-y-auto pr-1"
              style={{ maxHeight: "55vh" }}
            >
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-3 border rounded-lg p-2 bg-white hover:bg-slate-100 shadow-sm transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageURL}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-md border"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-gray-600 text-xs">
                        ৳{item.offerPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Decrease */}
                    <button
                      onClick={() =>
                        updateQuantity(item._id, Math.max(1, item.quantity - 1))
                      }
                      className="
                        p-2 rounded-full shadow-md
                        bg-gradient-to-r from-orange-500 to-red-500 
                        text-white hover:scale-110 transition-transform
                      "
                    >
                      <FaMinus size={12} />
                    </button>

                    <span className="px-2 font-semibold text-gray-800 min-w-[20px] text-center">
                      {item.quantity}
                    </span>

                    {/* Increase */}
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="
                        p-2 rounded-full shadow-md
                        bg-gradient-to-r from-green-500 to-emerald-600 
                        text-white hover:scale-110 transition-transform
                      "
                    >
                      <FaPlus size={12} />
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="
                        ml-2 text-red-500 hover:text-red-600 
                        p-2 rounded-full hover:bg-red-100 transition
                      "
                    >
                      <FaTrashAlt size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal Section */}
            <div className="pt-4 border-t mt-4 bg-white rounded-lg shadow-inner p-3">
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-gray-700 text-lg">মোট মূল্য</p>
                <p className="font-bold text-green-700 text-xl">
                  ৳{total.toLocaleString()}
                </p>
              </div>

              {/* ✅ Checkout Button (Navigate to Checkout Page) */}
              <button
                className="
                  w-full bg-gradient-to-r from-green-600 to-emerald-500 
                  hover:from-green-700 hover:to-emerald-600
                  text-white py-3 rounded-lg font-semibold 
                  shadow-md hover:shadow-lg transition-all duration-200
                "
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
