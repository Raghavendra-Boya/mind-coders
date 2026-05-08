"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  submitTestimonial,
  fetchTestimonials,
} from "@/store/slices/TestimonialSlice";
import { toast } from "react-toastify";

export default function CreateTestimonialModal({ onClose }) {
  const dispatch = useDispatch();
  const creating = useSelector((s) => s.testimonials?.creating);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [personImageFile, setPersonImageFile] = useState(null);
  const [formData, setFormData] = useState({
    TestimonialName: "",
    TestimonialText: "",
  });
  const [errors, setErrors] = useState({});

  const overlayRef = useRef(null);
  const allowedTypes = useMemo(
    () => ["image/jpeg", "image/png", "image/jpg"],
    []
  );

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [onClose, previewUrl]);

  const closeOnOverlay = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setErrors((p) => ({
        ...p,
        PersonImage: "Only JPG and PNG files are allowed.",
      }));
      toast.error("Only JPG and PNG files are allowed.");
      e.target.value = null;
      return;
    }

    setErrors((p) => ({ ...p, PersonImage: undefined }));
    setPersonImageFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
    e.target.value = null;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.TestimonialName.trim())
      newErrors.TestimonialName = "Testimonial name is required.";
    if (!formData.TestimonialText.trim())
      newErrors.TestimonialText = "Testimonial text is required.";
    if (!personImageFile)
      newErrors.PersonImage = "Person image is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted errors.");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const res = await dispatch(
      submitTestimonial({
        TestimonialName: formData.TestimonialName.trim(),
        TestimonialText: formData.TestimonialText.trim(),
        PersonImage: personImageFile,
      })
    );

    if (submitTestimonial.fulfilled.match(res)) {
      toast.success("Testimonial saved successfully!");
      await dispatch(fetchTestimonials());
      onClose?.();
    } else {
      const msg =
        res.payload?.message ||
        res.error?.message ||
        "Failed to save testimonial.";
      toast.error(msg);
    }
  };

  const modal = (
    <div
      ref={overlayRef}
      onMouseDown={closeOnOverlay}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Testimonial</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name="TestimonialName"
              value={formData.TestimonialName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
              placeholder="Enter name"
              required
            />
            {errors.TestimonialName && (
              <p className="text-red-600 text-sm mt-1">
                {errors.TestimonialName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Text</label>
            <textarea
              name="TestimonialText"
              value={formData.TestimonialText}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
              placeholder="Enter testimonial"
              rows={4}
              required
            />
            {errors.TestimonialText && (
              <p className="text-red-600 text-sm mt-1">
                {errors.TestimonialText}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Person Image</label>
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 mt-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-28 w-28 rounded-full object-cover border mb-2"
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-blue-500 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v8m0-8l-4 4m4-4l4 4m-4-4V4"
                    />
                  </svg>
                  <span className="text-blue-500 text-sm">
                    Click here to Upload
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    or drag and drop
                  </p>
                </>
              )}
            </label>
            {errors.PersonImage && (
              <p className="text-red-600 text-sm mt-1">
                {errors.PersonImage}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 disabled:opacity-50"
            >
              {creating ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (typeof window === "undefined") return null;
  return createPortal(modal, document.body);
}