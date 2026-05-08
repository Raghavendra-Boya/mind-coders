"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitSectionHeadings } from "../store/slices/SectionHeadingSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const sectionDataInitial = [
  { key: "Programs Section", title: "", subtitle: "" },
  { key: "Speakers Section", title: "", subtitle: "" },
  { key: "About Section", title: "", subtitle: "" },
];

function SectionHeadings() {
  const dispatch = useDispatch();
  const { creating } = useSelector((state) => state.sectionHeadings);

  const [sections, setSections] = useState(sectionDataInitial);
  const [errors, setErrors] = useState({});

  const handleInputChange = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);

    setErrors((prev) => ({
      ...prev,
      [`${index}-${field}`]: "",
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    let valid = true;

    sections.forEach((s, i) => {
      if (!s.title.trim()) {
        newErrors[`${i}-title`] = "Title is required.";
        valid = false;
      }
      if (!s.subtitle.trim()) {
        newErrors[`${i}-subtitle`] = "Subtitle is required.";
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    dispatch(submitSectionHeadings(sections))
      .unwrap()
      .then(() => {
        toast.success("✅ Section Headings Saved Successfully!");

        // Reset ONLY title & subtitle
        setSections(
          sectionDataInitial.map((s) => ({
            ...s,
            title: "",
            subtitle: "",
          }))
        );
      })
      .catch((err) => {
        console.error(err);
        toast.error("❌ Failed to save Section Headings.");
      });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Section Headings</h2>

      {sections.map((section, idx) => (
        <div key={section.key} className="bg-white rounded-lg border p-4 mb-6">
          <div className="font-semibold mb-2">{section.key}</div>

          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleInputChange(idx, "title", e.target.value)}
            className={`w-full border rounded-md px-3 py-2 text-sm ${
              errors[`${idx}-title`] ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors[`${idx}-title`] && (
            <p className="text-red-500 text-xs mt-1">{errors[`${idx}-title`]}</p>
          )}

          <label className="block text-sm mt-3 mb-1">Subtitle</label>
          <textarea
            rows={2}
            value={section.subtitle}
            onChange={(e) =>
              handleInputChange(idx, "subtitle", e.target.value)
            }
            className={`w-full border rounded-md px-3 py-2 text-sm ${
              errors[`${idx}-subtitle`] ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors[`${idx}-subtitle`] && (
            <p className="text-red-500 text-xs mt-1">{errors[`${idx}-subtitle`]}</p>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={creating}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        {creating ? "Saving..." : "Save All"}
      </button>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default SectionHeadings;
