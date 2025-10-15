"use client";

import LOGO from "@/public/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaClipboardList,
  FaShoppingCart,
  FaUserShield,
  FaWhatsapp,
} from "react-icons/fa"; // FaClipboardList used for My Orders
import { useCart } from "../app/context/context/CartContext";

export default function Navbar() {
  const { cartItems, toggleCart } = useCart();
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  const whatsappNumber = "+8801534648375"; // আপনার WhatsApp নাম্বার
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

  return (
    <nav className="w-full bg-sky-200/70 backdrop-blur-md fixed top-0 left-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src={LOGO}
              alt="Logo"
              className="object-contain h-10 md:h-12 lg:h-14"
              priority
            />
          </Link>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-sky-300 transition"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp size={24} className="text-green-600" />
          </a>

          {/* My Orders */}
          <Link
            href="/my-orders"
            className="p-2 rounded-full hover:bg-sky-300 transition"
            aria-label="My Orders"
          >
            <FaClipboardList size={24} className="text-gray-800" />
          </Link>

          {/* Cart */}
          <button
            className="relative p-2 rounded-full hover:bg-sky-300 transition"
            onClick={toggleCart}
            aria-label="Open cart"
          >
            <FaShoppingCart size={24} className="text-gray-800" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* Admin */}
          <Link
            href="/admin/dashboard"
            className="p-2 rounded-full hover:bg-sky-300 transition"
            aria-label="Admin dashboard"
          >
            <FaUserShield size={24} className="text-gray-800" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
