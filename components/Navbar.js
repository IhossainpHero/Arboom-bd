"use client";

import logo from "@/public/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa"; // WhatsApp icon

export default function Navbar() {
  return (
    <nav className="w-full bg-sky-200/70 backdrop-blur-md shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src={logo} // public ফোল্ডারে logo.png রাখো
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
          </div>

          {/* Middle - WhatsApp Button (Hidden on mobile) */}
          <div className="hidden md:flex flex-1 justify-center">
            <a
              href="https://wa.me/8801534648375" // এখানে তোমার WhatsApp নাম্বার দাও
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-full shadow-md transition duration-200 flex items-center gap-2"
            >
              <FaWhatsapp className="w-5 h-5" />
              WhatsApp
            </a>
          </div>

          {/* Right side - Admin + WhatsApp (mobile only WhatsApp) */}
          <div className="flex items-center gap-2">
            {/* WhatsApp button (mobile only) */}
            <a
              href="https://wa.me/8801999406491"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-full shadow-md transition duration-200 flex items-center justify-center text-lg"
            >
              <FaWhatsapp />
            </a>

            {/* Admin button */}
            <Link
              href="/admin/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-full shadow-md transition duration-200 text-sm"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
