import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VideoSection = () => {
  return (
    <section className="w-full py-10 px-5 md:px-20 bg-gray-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
        <img
          src="/path-to-image.jpg"
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <h2 className="text-4xl font-bold">Jenny Wilson</h2>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
          </p>
        </div>
      </div>

      {/* Videos Section */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-3xl font-bold">Videos</h3>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Video Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((video) => (
          <div key={video} className="relative overflow-hidden bg-white shadow-md rounded-lg">
            <img
              src="/path-to-video-thumbnail.jpg"
              alt="Video Thumbnail"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <img src="/path-to-play-icon.png" alt="Play" className="w-12 h-12" />
            </div>
            <div className="p-4">
              <h4 className="text-lg font-bold">Asalina Prashna Sisalina Javabu</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoSection;