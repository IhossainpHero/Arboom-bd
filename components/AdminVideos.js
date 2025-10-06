"use client";
import YouTubePlayer from "@/components/YouTubePlayer";
import { useState } from "react";

const AdminVideos = () => {
  const [link, setLink] = useState("");
  const [savedLink, setSavedLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedLink(link); // 👉 এখানে তুমি চাইলে DB তে POST করতে পারো
    setLink("");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">
        নতুন YouTube ভিডিও যোগ করুন
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="url"
          placeholder="YouTube Link দিন"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Video
        </button>
      </form>

      {savedLink && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Preview:</h3>
          <YouTubePlayer url={savedLink} />
        </div>
      )}
    </div>
  );
};

export default AdminVideos;
