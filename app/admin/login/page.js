"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double click
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // Optionally store token if backend returns one
        // const data = await res.json();
        // localStorage.setItem("token", data.token);

        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          অ্যাডমিন লগইন
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </button>
        </form>

        {/* Credit Section */}
        <footer className="text-center mt-6 text-sm text-gray-500">
          Copyright © 2025 arBoom bd - Developed by{" "}
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
    </div>
  );
}
