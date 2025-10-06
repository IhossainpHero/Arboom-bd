"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // এখানে আপনার লগইন লজিক যুক্ত করুন।
    // যেমন, Firebase বা অন্য কোনো ব্যাকএন্ডের সাথে যাচাই করুন।
    console.log("Login attempt with:", { email, password });

    // ডেমো হিসেবে, লগইন সফল হলে ড্যাশবোর্ডে রিডাইরেক্ট করুন।
    const loginSuccessful = true; // এখানে আপনার আসল যাচাইয়ের ফলাফল থাকবে।

    if (loginSuccessful) {
      alert("লগইন সফল! আপনাকে অ্যাডমিন ড্যাশবোর্ডে পাঠানো হচ্ছে।");
      // "next/navigation" মডিউলটি ব্যবহার না করে সরাসরি রিডাইরেক্ট করা হচ্ছে।
      window.location.href = "/admin/dashboard";
    } else {
      alert("লগইন ব্যর্থ। ইমেল বা পাসওয়ার্ড ভুল।");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          অ্যাডমিন লগইন
        </h1>
        <p className="text-center text-gray-500 mb-8">
          আপনার অ্যাডমিন অ্যাকাউন্টে প্রবেশ করুন।
        </p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              ইমেল
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="আপনার ইমেল লিখুন"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              লগইন করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
