"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetLeaderStatus } from "../../store/slices/LeaderSlice";
import { toast } from "react-toastify";

export default function NewLeaderModal({ open, onClose, onSave }) {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [leaderImage, setLeaderImage] = useState(null);
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const { loading, error, status } = useSelector((state) => state.leader);

  useEffect(() => {
    if (!open) {
      setName("");
      setDesignation("");
      setDescription("");
      setLeaderImage(null);
      setLocalError("");
      dispatch(resetLeaderStatus());
    }
  }, [open, dispatch]);

  // toast for API error/success from Redux
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (status) {
      toast.success(status);
    }
  }, [error, status]);

  const handleSave = () => {
    if (!name.trim()) {
      setLocalError("Leader name is required");
      toast.error("Leader name is required");
      return;
    }
    setLocalError("");
    if (onSave) {
      onSave({ name, designation, description, leaderImage });
    }
  };

  const handleCancel = () => {
    setName("");
    setDesignation("");
    setDescription("");
    setLeaderImage(null);
    setLocalError("");
    dispatch(resetLeaderStatus());
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-base font-semibold text-gray-800">
            Add New Leader
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Leader Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Leader Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setLeaderImage(file);
              }}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Designation
            </label>
            <input
              type="text"
              placeholder="Enter designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm h-20 resize-none"
            />
          </div>

          {localError && (
            <p className="text-red-600 text-sm">{localError}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-2 border-t px-5 py-3">
          <button
            onClick={handleCancel}
            className="px-4 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-1.5 bg-[#f25f4c] text-white rounded-md text-sm hover:bg-[#e34e3c]"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {(error || status) && (
          <p
            className={`text-center text-sm py-2 ${
              error ? "text-red-600" : "text-green-600"
            }`}
          >
            {error || status}
          </p>
        )}
      </div>
    </div>
  );
}