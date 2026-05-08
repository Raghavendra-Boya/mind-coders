"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Pencil, Trash2 } from "lucide-react";

export default function ManageCategoriesModal({ open, onClose, onUpdate }) {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Programs",
      description: "Spiritual programs and series",
      items: 2,
    },
    {
      id: 2,
      name: "Podcasts",
      description: "Audio content and podcasts",
      items: 1,
    },
    {
      id: 3,
      name: "Songs",
      description: "Worship songs and music",
      items: 0,
    },
    {
      id: 4,
      name: "Workshops",
      description: "Educational workshops and training",
      items: 0,
    },
  ]);

  const { programs } = useSelector((state) => state.program || {});

  const programRows = Array.isArray(programs?.ProgramsData)
    ? programs.ProgramsData.map((p) => ({
        name: p.ProgramName,
        programType: p.ProgramType,
      }))
    : [];

  const totalSongItems = programRows.filter((p) =>
    (p.name || "").startsWith("[SONG] ")
  ).length;

  const totalPodcastItems = programRows.filter((p) => {
    const type = (p.programType || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    if (type === "podcast") return true;
    return name.includes("podcast");
  }).length;

  const totalProgramItems = programRows.filter((p) => {
    const name = p.name || "";
    const lowerName = name.toLowerCase();
    const type = (p.programType || "").toLowerCase();

    const isSong = name.startsWith("[SONG] ");
    const isPodcast = type === "podcast" || lowerName.includes("podcast");

    return !isSong && !isPodcast;
  }).length;

  const totalWorkshopItems = programRows.filter((p) => {
    const type = (p.programType || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    if (type === "workshop") return true;
    return name.includes("workshop");
  }).length;

  const getItemCount = (cat) => {
    if (cat.name === "Programs") return totalProgramItems;
    if (cat.name === "Podcasts") return totalPodcastItems;
    if (cat.name === "Songs") return totalSongItems;
    if (cat.name === "Workshops") return totalWorkshopItems;
    return cat.items;
  };

  if (!open) return null;

  const handleDelete = (id) => {
    if (confirm("Delete this category?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  const handleEdit = (id) => {
    const newName = prompt("Edit category name:");
    if (newName) {
      setCategories(
        categories.map((cat) =>
          cat.id === id ? { ...cat, name: newName } : cat
        )
      );
    }
  };

  const handleUpdate = () => {
    onUpdate(categories);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-base font-semibold text-gray-800">
            Manage Categories ({categories.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 max-h-[350px] overflow-y-auto">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="border rounded-lg px-4 py-3 flex justify-between items-start hover:bg-gray-50 transition"
            >
              <div>
                <h3 className="font-medium text-gray-800 flex items-center gap-2">
                  {cat.name}
                  <span className="text-gray-500 text-sm">
                    {getItemCount(cat)} {getItemCount(cat) === 1 ? "item" : "items"}
                  </span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">{cat.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEdit(cat.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-2 border-t px-5 py-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-1.5 bg-[#f25f4c] text-white rounded-md text-sm hover:bg-[#e34e3c]"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
