"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitEvent,
  setEventFormData,
  resetEventForm,
} from "@/store/slices/eventSlice";
import { toast } from "react-toastify";

export default function CreateEventModal({ onClose }) {
  const dispatch = useDispatch();
  const { formData, loading, status } = useSelector((state) => state.event);

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    dispatch(setEventFormData({ [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      dispatch(setEventFormData({ imageFile: file }));
    }
  };

  const handleSave = () => {
    if (
      !formData.eventName ||
      !formData.description ||
      !formData.venue ||
      !formData.date ||
      !formData.time
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!formData.imageFile) {
      toast.error("Event image is required.");
      return;
    }

    dispatch(submitEvent(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Event created successfully!");
        onClose();
        dispatch(resetEventForm());
      } else {
        const msg =
          res.payload?.message || "Failed to create event. Please try again.";
        toast.error(msg);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg h-[90vh] flex flex-col relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Create Events</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          <div>
            <p className="text-sm font-medium mb-1">Event Image</p>
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center block cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto h-32 rounded-md object-cover"
                />
              ) : (
                <span className="text-blue-500 text-sm">
                  Click here to Upload or drag and drop
                </span>
              )}
            </label>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              placeholder="Enter event name"
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              rows="3"
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Enter venue"
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              />
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              />
            </div>
          </div>

          {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
        </div>

        <div className="flex justify-end p-4 border-t space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}