"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { submitAppstoreLink } from "@/store/slices/AppstoreSlice";
import { toast } from "react-toastify";

const initialForm = {
  appName: "",
  description: "",
  link: "",
};

function AppstoreSection() {
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialForm);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.appName.trim() || !form.link.trim()) {
      toast.error("Please fill App Name and Link");
      return;
    }

    const result = await dispatch(
      submitAppstoreLink({
        appName: form.appName,
        description: form.description,
        link: form.link,
      })
    );

    const res = result?.payload;

    if (
      res?.Status === 200 ||
      res?.success === true ||
      res?.Message?.toLowerCase()?.includes("success")
    ) {
      toast.success("Link saved successfully 🎉");
      setForm(initialForm);
    } else {
      toast.error(res?.Message || "Failed to save link");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        App / Play Store & Network Channel Links
      </h2>

      <div className="bg-white rounded-lg border p-4 shadow-sm max-w-xl">
        {/* App Name */}
        <div className="mb-3">
          <label className="block text-sm mb-1">App Name</label>
          <input
            type="text"
            value={form.appName}
            onChange={(e) => handleChange("appName", e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="App / Play Store / Channel name"
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm h-20"
            placeholder="Short description"
          />
        </div>

        {/* Link */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Link</label>
          <input
            type="url"
            value={form.link}
            onChange={(e) => handleChange("link", e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </div>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
        >
          Save Link
        </button>
      </div>
    </div>
  );
}

export default AppstoreSection;
