"use client";

import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  insertSpeaker,
  resetSpeakerStatus,
} from "../../store/slices/SpeakerSlice";
import { toast } from "react-toastify";

export default function AddSpeakerModal({ open, onClose, onSave }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.speaker); // ⬅️ status removed
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [speakerFormData, setSpeakerFormData] = useState({
    name: "",
    role: "",
    image: null,
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setSpeakerFormData({ ...speakerFormData, image: files[0] });
    } else {
      setSpeakerFormData({ ...speakerFormData, [name]: value });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSpeakerFormData({
        ...speakerFormData,
        image: e.dataTransfer.files[0],
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // basic validation
    if (!speakerFormData.name.trim() || !speakerFormData.role.trim()) {
      toast.error("Please fill in name and role.");
      return;
    }
    if (!speakerFormData.image) {
      toast.error("Please upload a speaker image.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", speakerFormData.name);
    formDataToSend.append("role", speakerFormData.role);
    if (speakerFormData.image) {
      formDataToSend.append("image", speakerFormData.image);
    }

    const result = await dispatch(insertSpeaker(formDataToSend));

    if (insertSpeaker.fulfilled.match(result)) {
      toast.success("Speaker saved successfully!");

      onSave({
        ...speakerFormData,
        image:
          speakerFormData.image instanceof File
            ? URL.createObjectURL(speakerFormData.image)
            : speakerFormData.image,
      });

      setSpeakerFormData({ name: "", role: "", image: null });
      dispatch(resetSpeakerStatus());
      onClose();
    } else {
      const msg =
        result.payload?.message ||
        result.error?.message ||
        "Failed to save speaker.";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 overflow-auto p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Add Speaker</h2>
          <form className="space-y-4" onSubmit={handleSave}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={speakerFormData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="mt-1 w-full border rounded p-2 focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                type="text"
                name="role"
                value={speakerFormData.role}
                onChange={handleChange}
                placeholder="Enter role"
                className="mt-1 w-full border rounded p-2 focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div
                className={`mt-1 w-full border-dashed border-2 rounded p-4 flex flex-col items-center justify-center cursor-pointer ${
                  dragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                {speakerFormData.image ? (
                  <img
                    src={
                      speakerFormData.image instanceof File
                        ? URL.createObjectURL(speakerFormData.image)
                        : speakerFormData.image
                    }
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full mb-2"
                  />
                ) : (
                  <p className="text-gray-500 text-sm">
                    Drag & drop an image here or click to upload
                  </p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* status removed: toasts now handle feedback */}

            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}