"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { insertMobileSection, resetStatus } from "../../store/slices/MobileSectionSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { toast } from "react-toastify";

export default function AddSectionModal({ open, onClose, onSave }) {
  const dispatch = useDispatch();

  const { items: categories, loading: categoriesLoading } = useSelector(
    (state) => state.category
  );

  const { loading, error, successMessage } = useSelector(
    (state) => state.mobileSections
  );

  const [form, setForm] = useState({
    categoryID: 0,
    positionNumber: "",
  });

  // Fetch categories when modal opens
  useEffect(() => {
    if (open) dispatch(fetchCategories());
  }, [open, dispatch]);

  // Reset form when modal opens or categories change
  useEffect(() => {
    if (!open) return;
    setForm({
      categoryID: categories[0]?.id || 0,
      positionNumber: "",
    });
    dispatch(resetStatus());
  }, [open, categories, dispatch]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "categoryID" ? Number(value) : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.categoryID || form.categoryID === 0) {
      toast.error("Please select a category.");
      return;
    }

    if (!form.positionNumber || Number(form.positionNumber) <= 0) {
      toast.error("Please enter a valid position number.");
      return;
    }

    const payload = {
      categoryID: form.categoryID,
      positionNumber: Number(form.positionNumber) || 0,
    };

    const result = await dispatch(insertMobileSection(payload));

    if (insertMobileSection.fulfilled.match(result)) {
      toast.success("Section added successfully!");
      if (onSave) onSave({ ...form, ...payload });
      onClose();
    } else {
      const msg =
        result.payload?.message ||
        result.error?.message ||
        "Failed to add section.";
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
          <h2 className="text-lg font-semibold mb-4">Add Section</h2>

          <form className="space-y-4" onSubmit={handleSave}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Category
              </label>
              {categoriesLoading ? (
                <p className="text-gray-500 mt-1">Loading categories...</p>
              ) : (
                <select
                  name="categoryID"
                  value={form.categoryID}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded p-2"
                >
                  {categories.length ? (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.categoryName}
                      </option>
                    ))
                  ) : (
                    <option value={0} disabled>
                      No categories found
                    </option>
                  )}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position Number
              </label>
              <input
                type="number"
                name="positionNumber"
                value={form.positionNumber}
                onChange={handleChange}
                className="mt-1 w-full border rounded p-2"
              />
            </div>

            {(error || successMessage) && (
              <div
                className={`text-sm mt-2 ${
                  successMessage ? "text-green-600" : "text-red-600"
                }`}
              >
                {successMessage || error}
              </div>
            )}

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