"use client";
import { useState } from "react";
import { X, Upload } from "lucide-react";

export function CreateSongModal({ onClose }) {
  const [songImage, setSongImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSongImage(URL.createObjectURL(file));
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSongImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create Songs</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {/* Song Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Song Name</label>
            <input
              type="text"
              placeholder="Enter song name"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-100"
            />
          </div>

          {/* Song Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Song Image</label>
            <div
              className={`border-2 border-dashed rounded-md p-4 text-center text-sm cursor-pointer transition ${
                dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("songImageInput").click()}
            >
              {songImage ? (
                <div className="flex flex-col items-center space-y-2">
                  <img
                    src={songImage}
                    alt="Song Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <p className="text-gray-500 text-xs">Click to change image</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-gray-500">
                  <Upload className="w-6 h-6 text-blue-500" />
                  <p>
                    <span className="text-blue-600 font-medium">Click here to Upload</span> or drag and drop
                  </p>
                </div>
              )}
              <input
                id="songImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Song Link */
}
          <div>
            <label className="block text-sm font-medium mb-1">Song Link</label>
            <input
              type="text"
              placeholder="Enter song link"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-100"
            />
          </div>

               <div>
            <label className="block text-sm font-medium mb-1">Song file</label>
            <div
              className={`border-2 border-dashed rounded-md p-4 text-center text-sm cursor-pointer transition ${
                dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("songImageInput").click()}
            >
              {songImage ? (
                <div className="flex flex-col items-center space-y-2">
                  <img
                    src={songImage}
                    alt="Song Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <p className="text-gray-500 text-xs">Click to change image</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-gray-500">
                  <Upload className="w-6 h-6 text-blue-500" />
                  <p>
                    <span className="text-blue-600 font-medium">Click here to Upload</span> or drag and drop
                  </p>
                </div>
              )}
              <input
                id="songImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 text-sm border border-gray-300 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
