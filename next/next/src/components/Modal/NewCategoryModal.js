"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategoryFormData,
  resetCategoryForm,
  insertCategory,
} from "../../store/slices/categorySlice";
import { toast } from "react-toastify";

export default function NewCategoryModal({ open, onClose, onSave }) {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const { loading, status } = useSelector((state) => state.category);

  if (!open) return null;

  const handleSave = () => {
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const newCategory = { categoryName, description };

    dispatch(insertCategory(newCategory))
      .unwrap()
      .then(() => {
        toast.success("Category created successfully");
        setCategoryName("");
        setDescription("");
        if (onSave) onSave(newCategory);
        onClose();
      })
      .catch(() => {
        toast.error("Failed to create category");
      });
  };

  const handleCancel = () => {
    setCategoryName("");
    setDescription("");
    dispatch(resetCategoryForm());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-base font-semibold text-gray-800">
            Add New Category
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
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter program name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f25f4c]/50"
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
              className="w-full border rounded-md px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-[#f25f4c]/50"
            />
          </div>
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

        {/* Status Message */}
        {status && (
          <p
            className={`text-center text-sm font-medium py-2 ${
              status.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}