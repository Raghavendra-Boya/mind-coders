"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";

export default function MobileBannerModal({ open, onClose, onSave }) {
  const [description, setDescription] = useState("");
  const [bannerFile, setBannerFile] = useState(null);

  const fileInputRef = React.useRef(null);

  if (!open) return null;

  const handlePick = () => fileInputRef.current?.click();

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setBannerFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setBannerFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Please enter a description.");
      return;
    }

    if (!bannerFile) {
      toast.error("Please upload a banner image.");
      return;
    }

    if (onSave) {
      onSave({ description: description.trim(), bannerFile });
    }

    setDescription("");
    setBannerFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 overflow-auto p-4">
      <div className="bg-white rounded-lg w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>

        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Add Mobile Banner</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write banner description for mobile home page..."
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Banner Image *
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handlePick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && handlePick()
                }
              >
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-500 mb-2" />
                  <p className="text-sm text-gray-500 mb-3">
                    <span
                      className="text-blue-600 cursor-pointer hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePick();
                      }}
                    >
                      Click to choose an image
                    </span>{" "}
                    or drag and drop
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {bannerFile?.name && (
                    <div className="text-xs text-gray-600 mt-2">
                      {bannerFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Save Banner
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
