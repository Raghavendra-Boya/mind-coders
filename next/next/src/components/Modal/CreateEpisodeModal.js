"use client";

import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  insertProgramEpisode,
  resetEpisodeForm,
  fetchProgramEpisodes,
} from "@/store/slices/programEpisodeSlice";
import { fetchPrograms } from "@/store/slices/programSlice";
import { toast } from "react-toastify";

export default function CreateEpisodeModal({
  open,
  onClose,
  defaultProgramId,
  defaultCategoryId,
}) {
  const dispatch = useDispatch();
  const { loading, status, error } = useSelector(
    (state) => state.programEpisode
  );

  const [episodeName, setEpisodeName] = useState("");
  const [description, setDescription] = useState("");
  const [statusValue, setStatusValue] = useState("Active");
  const [episodeImage, setEpisodeImage] = useState(null);
  const [episodeLink, setEpisodeLink] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setEpisodeName("");
      setDescription("");
      setEpisodeImage(null);
      setEpisodeLink("");
      setStatusValue("Active");
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation for required text fields
    if (!episodeName.trim() || !description.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!defaultProgramId || !defaultCategoryId) {
      console.warn("ProgramID or CategoryID missing!", {
        defaultProgramId,
        defaultCategoryId,
      });
    }

    if (!episodeImage) {
      toast.error("Episode image is required");
      return;
    }

    if (!episodeLink) {
      toast.error("Episode link is required");
      return;
    }

    const formData = new FormData();
    formData.append("CategoryID", defaultCategoryId);
    formData.append("ProgramID", defaultProgramId);
    formData.append("EpisodeName", episodeName);
    formData.append("Description", description);
    formData.append("Status", statusValue);
    formData.append("EpisodeImage", episodeImage);
    formData.append("EpisodeLink", episodeLink);

    console.log("Submitting episode:", {
      ProgramID: defaultProgramId,
      CategoryID: defaultCategoryId,
      EpisodeName: episodeName,
      Description: description,
      Status: statusValue,
      EpisodeLink: episodeLink,
      episodeImage,
    });

    const resultAction = await dispatch(insertProgramEpisode(formData));

    if (insertProgramEpisode.fulfilled.match(resultAction)) {
      if (defaultProgramId) {
        await dispatch(fetchProgramEpisodes(defaultProgramId));
      }
      // Refresh programs so EpisodeCount in the dashboard updates
      dispatch(fetchPrograms());
      dispatch(resetEpisodeForm());

      toast.success("Episode created successfully");

      onClose();

      setEpisodeName("");
      setDescription("");
      setEpisodeImage(null);
      setEpisodeLink("");
      setStatusValue("Active");
    } else {
      console.error(
        "Insert episode failed:",
        resultAction.payload || resultAction.error
      );
      toast.error("Failed to create episode");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Create Episode</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Episode Name */}
          <div>
            <label>Episode Name</label>
            <input
              type="text"
              value={episodeName}
              onChange={(e) => setEpisodeName(e.target.value)}
              className="mt-1 p-2 border w-full rounded"
            />
          </div>

          {/* Description */}
          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 border w-full rounded"
            />
          </div>

          {/* Status */}
          <div>
            <label>Status</label>
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              className="mt-1 p-2 border w-full rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Episode Link */}
          <div>
            <label>Episode Link</label>
            <input
              type="text"
              value={episodeLink}
              onChange={(e) => setEpisodeLink(e.target.value)}
              className="mt-1 p-2 border w-full rounded"
              placeholder="Enter video URL"
            />
          </div>

          {/* Episode Image */}
          <label className="block mb-4">
            Episode Image
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400"
              onClick={() =>
                document.getElementById("episodeImageInput").click()
              }
            >
              <Upload className="w-8 h-8 text-blue-500 mb-2" />
              <p>
                {episodeImage ? episodeImage.name : "Click to upload image"}
              </p>
            </div>
            <input
              type="file"
              id="episodeImageInput"
              className="hidden"
              accept="image/*"
              onChange={(e) => setEpisodeImage(e.target.files[0])}
            />
          </label>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>

          {/* Status/Error messages */}
          {status && <p className="text-green-600 mt-2">{status}</p>}
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}