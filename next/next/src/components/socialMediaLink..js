"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { insertSocialMediaLink } from "@/store/slices/SocialMediaSlice";
import { toast } from "react-toastify";

const initialForm = {
  socialMediaName: "",
  socialMediaLink: "",
  socialMediaIcon: null,
};

function SocialMediaLink() {
  const [form, setForm] = useState(initialForm);

  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // basic validation
    if (!form.socialMediaName.trim() || !form.socialMediaLink.trim()) {
      toast.error("Please fill in both name and link.");
      return;
    }

    const result = await dispatch(
      insertSocialMediaLink({
        socialMediaName: form.socialMediaName,
        socialMediaLink: form.socialMediaLink,
        socialMediaIcon: form.socialMediaIcon,
      })
    );

    const res = result && result.payload;

    if (
      res?.Status == 200 ||
      res?.Status == "200" ||
      res?.success === true ||
      res?.Message?.toLowerCase()?.includes("success")
    ) {
      setSuccessMessage("Social media link added successfully!");
      toast.success("Social media link added successfully!");

      setForm(initialForm);
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      const msg =
        res?.Message || "Failed to add social media link. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Social Media Links</h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg border p-4 mb-6">
        {/* Social Media Name */}
        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-1">
            Social Media Name
          </label>
          <input
            type="text"
            value={form.socialMediaName}
            placeholder="e.g. Facebook, Instagram"
            onChange={(e) => handleChange("socialMediaName", e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Social Media Link */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">
            Social Media Link
          </label>
          <input
            type="url"
            value={form.socialMediaLink}
            placeholder="https://..."
            onChange={(e) => handleChange("socialMediaLink", e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Social Media Icon */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">
            Social Media Icon
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleChange("socialMediaIcon", e.target.files?.[0] || null)
            }
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Save Link
        </button>
      </div>
    </div>
  );
}

export default SocialMediaLink;