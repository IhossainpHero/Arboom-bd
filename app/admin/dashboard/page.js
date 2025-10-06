"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          অ্যাডমিন ড্যাশবোর্ড
        </h1>

        <p className="text-lg text-gray-700 text-center mb-8">
          এখানে আপনি আপনার ব্যবসার গুরুত্বপূর্ণ তথ্যগুলো দেখতে পারবেন।
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/products/add"
            className="block p-6 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <h2 className="text-xl font-semibold mb-2">নতুন পণ্য যোগ করুন</h2>
            <p className="text-sm">
              নতুন শাড়ি আপলোড করুন এবং তালিকাভুক্ত করুন।
            </p>
          </Link>

          <Link
            href="/admin/products/orders"
            className="block p-6 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors duration-200"
          >
            <h2 className="text-xl font-semibold mb-2">অর্ডার দেখুন</h2>
            <p className="text-sm">
              সব অর্ডারের তালিকা এবং তাদের স্ট্যাটাস দেখুন।
            </p>
          </Link>

          <div className="block p-6 bg-gray-500 text-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">স্ট্যাটাস</h2>
            <p className="text-sm">এই সেকশনে ব্যবসার পরিসংখ্যান দেখা যাবে।</p>
          </div>
        </div>
      </div>
      {/* Credit Section */}
      <footer className="text-center mt-6 text-sm text-gray-500">
        Copyright © 2025 alpha bazar - Developed by{" "}
        <a
          href="https://imran-hossain-portfolio.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-600 hover:underline"
        >
          Imran
        </a>
      </footer>
    </div>
  );
}
