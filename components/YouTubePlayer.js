"use client";
import { useEffect, useState } from "react";

function extractYouTubeId(url) {
  if (!url) return null;
  const regExp =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

const App = () => {
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      async function fetchVideo() {
        setLoading(true);
        try {
          const response = await fetch(window.location.origin + "/api/video"); // সার্ভার থেকে ভিডিও ডেটা ফেচ করা হচ্ছে
          if (!response.ok) {
            throw new Error("Failed to fetch video");
          }
          const data = await response.json();

          if (data && data.url) {
            const videoId = extractYouTubeId(data.url);
            setCurrentVideoId(videoId);
          } else {
            setCurrentVideoId(null);
          }
        } catch (error) {
          console.error("Fetch Error:", error);
          setCurrentVideoId(null);
        } finally {
          setLoading(false);
        }
      }
      fetchVideo();
    }
  }, [isMounted]); // isMounted স্টেট পরিবর্তনের সাথে সাথে এই হুকটি আবার চলবে

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen bg-gray-100 p-4 font-inter">
        <p>ভিডিও লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 font-inter">
      {currentVideoId ? (
        <div className="relative w-full max-w-4xl h-0 pb-[56.25%] bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${currentVideoId}`}
            title="YouTube Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full max-w-4xl bg-gray-800 text-white rounded-xl shadow-2xl overflow-hidden min-h-[300px] text-center p-4">
          <p>সার্ভারে কোনো বৈধ ইউটিউব লিংক পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
  );
};

export default App;
