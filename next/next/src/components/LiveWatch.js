import { useState } from 'react';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaBackward, FaForward, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress, FaEllipsisH, FaComment } from 'react-icons/fa';

const WatchLive = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(40);
  const [currentTime, setCurrentTime] = useState('47:38');
  const [totalTime, setTotalTime] = useState('1:52:32');
  const [volume, setVolume] = useState(1);

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const toggleMute = () => setIsMuted((prev) => !prev);
  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  const handleSeek = (e) => {
    const seekBar = e.currentTarget;
    const newProgress = (e.clientX - seekBar.getBoundingClientRect().left) / seekBar.offsetWidth;
    setProgress(newProgress * 100);
  };

  const seekForward = () => {
    setProgress((prev) => prev + 10); // Just simulate forward seek by increasing progress
  };

  const seekBackward = () => {
    setProgress((prev) => prev - 10); // Just simulate backward seek by decreasing progress
  };

  const handleProgress = ({ playedSeconds, loadedSeconds }) => {
    setProgress(playedSeconds * 100 / loadedSeconds); // Calculate the progress
    setCurrentTime(formatTime(playedSeconds));
    setTotalTime(formatTime(loadedSeconds));
  };

  return (
    <div className="relative shadow-xl transition-all duration-300 w-full rounded-2xl p-6 flex justify-center items-center bg-gradient-to-r from-pink-100 via-white to-blue-100 flex items-center justify-center min-h-screen">
      <div className="absolute top-8 left-0 right-0 text-black text-center font-bold py-2 text-lg ">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center">
          <i className="fas fa-broadcast-tower text-red-500"></i>
          Live
        </h1>
      </div>
      <div className={`relative w-4/5 ${isFullscreen ? 'h-[80vh]' : 'h-[65vh]'} bg-black rounded-lg overflow-hidden flex justify-center items-center`}>
        <ReactPlayer
          url="https://6n3yopznd9ok-hls-live.5centscdn.com/RAKSHANA/271ddf829afeece44d8732757fba1a66.sdp/playlist.m3u8"
          playing={isPlaying}
          muted={isMuted}
          volume={volume}
          width="100%"
          height="100%"
          className="rounded-lg overflow-hidden"
          onProgress={handleProgress} // Handle progress
        />

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4 rounded-b-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold">Cold Little Heart</div>
            <div className="text-sm">
              {currentTime} / {totalTime}
            </div>
          </div>
          <div className="relative w-full h-2 bg-gray-600 rounded-full cursor-pointer" onClick={handleSeek}>
            <div className="absolute top-0 left-0 h-2 bg-white rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center space-x-4 text-xl">
              <button onClick={togglePlay} className="hover:text-gray-400 transition">
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={seekBackward} className="hover:text-gray-400 transition">
                <FaBackward />
              </button>
              <button onClick={seekForward} className="hover:text-gray-400 transition">
                <FaForward />
              </button>
            </div>
            <div className="flex items-center space-x-4 text-xl">
              <button className="hover:text-gray-400 transition">
                <FaComment />
              </button>
              <button onClick={toggleMute} className="hover:text-gray-400 transition">
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <button onClick={toggleFullscreen} className="hover:text-gray-400 transition">
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
              <button className="hover:text-gray-400 transition">
                <FaEllipsisH />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default WatchLive;
