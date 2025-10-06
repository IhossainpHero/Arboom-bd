"use client";
import YouTubePlayer from "@/components/YouTubePlayer";
import { useEffect, useState } from "react";

export default function VideoPage() {
  const [video, setVideo] = useState(null);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch("/api/video"); // relative path should work
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        console.log("Fetched video:", data); // ✅ check console
        setVideo(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchVideo();
  }, []);

  if (!video) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {video?.url ? (
        <YouTubePlayer url={video.url} />
      ) : (
        <p>No video available</p>
      )}
    </div>
  );
}
