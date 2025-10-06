"use client";
import { useState } from "react";

export default function AdminVideo() {
  const [link, setLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: link }),
    });
    alert("Video saved successfully!");
    setLink("");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        🎥 নতুন ভিডিও যোগ করুন
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="url"
            placeholder="YouTube Link দিন..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white text-gray-800 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02] transition"
        >
          ✅ Save Video
        </button>
      </form>
    </div>
  );
}
