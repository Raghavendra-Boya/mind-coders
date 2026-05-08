"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import {
  FaPlay,
  FaPause,
  FaBackward,
  FaForward,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaEllipsisH,
  FaComment,
} from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DownloadApp from "../download/page";
import { fetchLiveBroadcastLink } from "@/store/slices/liveBroadcastSlice";

const WatchLive = () => {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [totalTime, setTotalTime] = useState("00:00");
  const [volume, setVolume] = useState(1);

  const playerContainerRef = useRef(null);

  const pathname = usePathname();
  const dispatch = useDispatch();
  const { videoLink, loading } = useSelector((state) => state.liveBroadcast);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      dispatch(fetchLiveBroadcastLink());
    }
  }, [mounted, dispatch]);

  // Sync fullscreen state
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const toggleMute = () => setIsMuted((prev) => !prev);

  const toggleFullscreen = () => {
    const el = playerContainerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleSeek = (e) => {
    const seekBar = e.currentTarget;
    const newProgress =
      (e.clientX - seekBar.getBoundingClientRect().left) / seekBar.offsetWidth;
    setProgress(newProgress * 100);
  };

  const seekForward = () => setProgress((prev) => Math.min(prev + 10, 100));
  const seekBackward = () => setProgress((prev) => Math.max(prev - 10, 0));

  const handleProgress = ({ playedSeconds, loadedSeconds }) => {
    if (!loadedSeconds) return;
    setProgress((playedSeconds * 100) / loadedSeconds);
    setCurrentTime(formatTime(playedSeconds));
    setTotalTime(formatTime(loadedSeconds));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const finalUrl =
    videoLink ||
    "https://6n3yopznd9ok-hls-live.5centscdn.com/RAKSHANA/271ddf829afeece44d8732757fba1a66.sdp/playlist.m3u8";

  return (
    <>
      <div
        className="relative w-full flex flex-col items-center justify-start px-4 lg:px-[100px] min-h-screen"
        style={{
          backgroundImage: pathname === "/WatchLive" ? "url('asset/watch_Live_bg.png')" : 'none',
          backgroundSize: pathname === "/WatchLive" ? "cover" : 'auto',
          backgroundPosition: pathname === "/WatchLive" ? "center" : 'top',
          backgroundRepeat: pathname === "/WatchLive" ? "no-repeat" : 'repeat',
          paddingTop: '120px',
          position: 'relative',
          paddingBottom: pathname === "/WatchLive" ? '2rem' : '2rem',
          overflow: 'hidden',
          backgroundAttachment: pathname === "/WatchLive" ? 'fixed' : 'scroll'
        }}
      >
        {pathname === "/WatchLive" && <Navbar />}

        {/* Live Heading */}
        <div
          className={`relative z-10 w-full text-center ${pathname === "/WatchLive" ? "mb-8" : "mb-4"}`}
          style={{
            marginTop: pathname === "/WatchLive" ? '0rem' : '0rem',
            marginBottom: pathname === "/WatchLive" ? '0.5rem' : '0.5rem'
          }}
        >
          <div className="flex items-center justify-center gap-4">
            <img
              src="/asset/Live.png"
              alt="Live"
              className="w-10 sm:w-12 md:w-14 object-contain"
            />
            <span
              className="font-extrabold"
              style={{
                fontFamily: "Fustat",
                fontWeight: "800",
                fontStyle: "ExtraBold",
                fontSize: "50px",
                lineHeight: "100%",
                textAlign: "center",
              }}
            >
              Live
            </span>
          </div>
        </div>

        {/* RESPONSIVE PLAYER WRAPPER */}
        <div className="relative mx-auto w-full max-w-[1280px] mt-2 flex justify-center">
          {/* Decorative Image */}
          <img
            src="/asset/misc-13 1.png"
            alt="Decorative strokes"
            className="
              absolute
              -top-7 left-2
              sm:-top-6 sm:left-2
              md:-top-8 md:left-4
              w-10 sm:w-12 md:w-14
              pointer-events-none select-none
            "
            style={{
              marginTop: '3px',
              marginLeft: '-42px'
            }}
            onError={(e) => {
              console.log('Image failed to load:', e.target.src);
              e.target.style.display = 'none';
            }}
            onLoad={(e) => {
              console.log('Image loaded successfully:', e.target.src);
            }}
          />

          {/* Player Card */}
          <div
            ref={playerContainerRef}
            className={`
              relative
              w-full
              max-w-[1100px]
              ${pathname === "/WatchLive" ? "mt-8" : "mt-4"}
              aspect-video
              bg-black
              rounded-3xl
              shadow-2xl
              overflow-hidden
              flex items-center justify-center
              ${isFullscreen ? "h-[80vh]" : ""}
            `}
          >
            {loading && !videoLink ? (
              <div className="text-white">Loading live stream...</div>
            ) : (
              <ReactPlayer
                url={finalUrl}
                playing={isPlaying}
                muted={isMuted}
                volume={volume}
                width="100%"
                height="100%"
                className="absolute inset-0 rounded-3xl overflow-hidden"
                onProgress={handleProgress}
                config={{
                  file: {
                    attributes: {
                      style: { objectFit: "cover" },
                    },
                  },
                }}
              />
            )}

            {/* Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-3 sm:p-4 rounded-b-3xl">
              <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-semibold">Cold Little Heart</div>
                <div className="text-sm">
                  {currentTime} / {totalTime}
                </div>
              </div>

              <div
                className="relative w-full h-2 bg-gray-600 rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div
                  className="absolute top-0 left-0 h-2 bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center space-x-4 text-xl">
                  <button onClick={togglePlay}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <button onClick={seekBackward}>
                    <FaBackward />
                  </button>
                  <button onClick={seekForward}>
                    <FaForward />
                  </button>
                </div>

                <div className="flex items-center space-x-4 text-xl">
                  <FaComment />
                  <button onClick={toggleMute}>
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <button onClick={toggleFullscreen}>
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </button>
                  <FaEllipsisH />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {mounted && pathname === "/WatchLive" && (
        <>
          <DownloadApp />
          <Footer />
        </>
      )}
    </>
  );
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export default WatchLive;
