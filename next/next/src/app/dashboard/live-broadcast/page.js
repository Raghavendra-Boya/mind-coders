"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Bell, ChevronDown } from "lucide-react";
import { submitLiveBroadcast, setLiveBroadcastData } from "@/store/slices/liveBroadcastSlice";

export default function LiveBroadcastPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, status } = useSelector((state) => state.liveBroadcast);

  const [satelliteOn, setSatelliteOn] = useState(false);
  const [youtubeOn, setYoutubeOn] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) setUserName(storedUser.name);
  }, []);

  const handleStart = () => {
    const payload = {
      videoLink: youtubeOn
        ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // <- replace with your real video/live URL
        : "https://6n3yopznd9ok-hls-live.5centscdn.com/RAKSHANA/271ddf829afeece44d8732757fba1a66.sdp/playlist.m3u8",
      linkType: youtubeOn ? "2" : "1",
    };
    dispatch(submitLiveBroadcast(payload));
  };
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: '20px',
            lineHeight: '140%',
            letterSpacing: '0%',
            color: '#1E293B',
            margin: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          Live Broadcast
        </h1>

        <div className="flex items-center gap-6 relative">
          <button
            onClick={() => router.push("/dashboard/notifications")}
            className="relative text-gray-600 hover:text-gray-900"
          >
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt="Profile"
              className="w-8 h-8 rounded-full border"
            />
            <span className="text-sm font-medium text-gray-800">{userName}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
          </div>

          {isOpen && (
            <div className="absolute right-0 top-12 w-40 bg-white border rounded shadow-md z-50">
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  router.push("/login");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 mt-4 max-w-4xl mx-auto w-full px-4 sm:px-0">
        {/* Satellite Live */}
        <div>
          <h2
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800,
              fontSize: '20px',
              lineHeight: '140%',
              letterSpacing: '0%',
              color: '#1E293B',
              margin: 0,
              padding: 0,
              width: '100%',  // Changed from fixed width
              height: '28px',
              opacity: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',  // Added for spacing
              marginBottom: '8px'
            }}
          >
            <span>Satellite Live</span>
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-100 rounded-md p-4 gap-3">
            <a href="#" className="text-blue-600 font-medium hover:underline text-sm sm:text-base">
              Satellite channel
            </a>
            <label className="relative inline-flex items-center cursor-pointer self-start sm:self-center">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={satelliteOn}
                onChange={(e) => {
                  setSatelliteOn(e.target.checked);
                  setYoutubeOn(false);
                  dispatch(setLiveBroadcastData({ linkType: "Satellite" }));
                }}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-red-500 transition-colors"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>

        {/* YouTube Live */}
        <div>
          <h2
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800,
              fontSize: '20px',
              lineHeight: '140%',
              letterSpacing: '0%',
              color: '#1E293B',
              margin: 0,
              padding: 0,
              width: '100%',
              height: '28px',
              opacity: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}
          >
            <span>YouTube Live</span>
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-100 rounded-md p-4 gap-3">
            <a href="#" className="text-blue-600 font-medium hover:underline text-sm sm:text-base">
              Program One
            </a>
            <label className="relative inline-flex items-center cursor-pointer self-start sm:self-center">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={youtubeOn}
                onChange={(e) => {
                  setYoutubeOn(e.target.checked);
                  setSatelliteOn(false);
                  dispatch(setLiveBroadcastData({ linkType: "YouTube" }));
                }}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-gray-900 transition-colors"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center sm:justify-end">
          <button
            onClick={handleStart}
            disabled={loading}
            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition w-full sm:w-auto"
          >
            {loading ? "Saving..." : "Start"}
          </button>
        </div>

        {status && <p className="text-center text-gray-700 mt-2">{status}</p>}
      </div>
    </div>
  );
}
