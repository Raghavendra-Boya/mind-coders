"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Upload } from "lucide-react";
import { submitAboutSection } from "@/store/slices/AboutSectionSlice";
import { toast } from "react-toastify";

const sectionDataInitial = [
  {
    key: "About Section",
    title: "",
    subtitle: "",
    image: null,
  },
];

function SectionAbout() {
  const [sections, setSections] = useState(sectionDataInitial);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();

  const handleInputChange = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const handleImageChange = (index, file) => {
    const updated = [...sections];
    updated[index].image = file;
    setSections(updated);
  };

  const handleSubmit = async () => {
    const data = sections[0];

    const result = await dispatch(
      submitAboutSection({
        Heading: data.title,
        Description: data.subtitle,
        Image: data.image,
      })
    );

    const res = result?.payload;

    // SUCCESS CHECK
    if (
      res?.Status == 200 ||
      res?.Status == "200" ||
      res?.success === true ||
      res?.Message?.toLowerCase()?.includes("success")
    ) {
      // inline success
      setSuccessMessage("About Section submitted successfully!");
      // toast success
      toast.success("About Section submitted successfully!");

      // reset form
      setSections([
        {
          key: "About Section",
          title: "",
          subtitle: "",
          image: null,
        },
      ]);

      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      // toast error (if backend indicates failure)
      toast.error(
        res?.Message || "Failed to submit About Section. Please try again."
      );
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">About Section</h2>

      {/* Success message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {sections.map((section, idx) => (
        <div
          key={`${section.key}-${idx}`}
          className="bg-white rounded-lg border p-4 mb-6"
        >
          <div className="font-semibold mb-2">{section.key}</div>

          {/* Heading */}
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              value={section.title}
              placeholder="Enter heading"
              onChange={(e) => handleInputChange(idx, "title", e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={section.subtitle}
              placeholder="Enter description"
              onChange={(e) =>
                handleInputChange(idx, "subtitle", e.target.value)
              }
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">
              About Section Image
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-blue-400"
              onClick={() =>
                document.getElementById(`aboutImage-${idx}`).click()
              }
            >
              <Upload className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-sm text-gray-500">
                <span className="text-blue-600 underline">
                  Click here to Upload
                </span>{" "}
                or drag and drop
              </p>
              {section.image && (
                <p className="mt-2 text-green-600">{section.image.name}</p>
              )}
            </div>

            <input
              type="file"
              id={`aboutImage-${idx}`}
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                handleImageChange(idx, e.target.files?.[0] || null)
              }
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Save Section
          </button>
        </div>
      ))}
    </div>
  );
}

export default SectionAbout;