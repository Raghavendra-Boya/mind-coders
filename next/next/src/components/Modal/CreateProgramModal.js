"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { insertProgram, resetProgramState } from "@/store/slices/programSlice";
import { Upload, X } from "lucide-react";
import { toast } from "react-toastify";

export default function CreateProgramModal({ 
  open, 
  onClose, 
  onSuccess, 
  mode = "program" 
}) {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.program);

  const [formData, setFormData] = useState({
    programName: "",
    description: "",
    status: "",
    videoLink: "",
    file: null
  });
  const [errors, setErrors] = useState({});

  const isSong = mode === "song";
  const isPodcast = mode === "podcast";
  const isWorkshop = mode === "workshop";
  
  const entityLabel = isSong ? "Song" : 
                     isPodcast ? "Podcast" : 
                     isWorkshop ? "Workshop" : "Program";

  useEffect(() => {
    if (success) {
      toast.success(`${entityLabel} saved successfully!`);
      resetForm();
      onClose();
      if (onSuccess) onSuccess();
    }

    if (error) {
      toast.error(error || `Failed to save ${entityLabel.toLowerCase()}.`);
    }
  }, [success, error, entityLabel, onClose, onSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData(prev => ({ ...prev, file: selectedFile }));
    }
    e.target.value = null;
  };

  const resetForm = () => {
    setFormData({
      programName: "",
      description: "",
      status: "",
      videoLink: "",
      file: null
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    const { programName, description, status, file, videoLink } = formData;

    if (!programName.trim()) newErrors.programName = `${entityLabel} name is required.`;
    if (!description.trim()) newErrors.description = `${entityLabel} description is required.`;
    if (!status) newErrors.status = "Please select a status.";
    if (isSong && !videoLink.trim()) newErrors.videoLink = "Video link is required for songs.";

    if (!file) {
      newErrors.file = `${entityLabel} image is required.`;
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        newErrors.file = "Only JPG and PNG files are allowed.";
      } else if (file.size > 2 * 1024 * 1024) {
        newErrors.file = "File size must be under 2MB.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the highlighted errors.");
      return;
    }

    const formDataToSend = new FormData();
    const { programName, description, status, videoLink, file } = formData;
    
    // Add appropriate prefix based on entity type if not already present
    let nameForApi = programName;
    if (isSong && !programName.startsWith("[SONG] ")) {
      nameForApi = `[SONG] ${programName}`;
    } else if (isPodcast && !programName.startsWith("[PODCAST] ")) {
      nameForApi = `[PODCAST] ${programName}`;
    } else if (isWorkshop && !programName.startsWith("[WORKSHOP] ")) {
      nameForApi = `[WORKSHOP] ${programName}`;
    }

    formDataToSend.append("ProgramName", nameForApi);
    formDataToSend.append("Description", description);
    formDataToSend.append("Status", status);
    formDataToSend.append("ProgramType", entityLabel.toLowerCase());
    formDataToSend.append("VideoLink", videoLink || "");
    if (file) formDataToSend.append("ProgramImage", file);

    await dispatch(insertProgram(formDataToSend));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-md w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Create {entityLabel}</h2>

        <form onSubmit={handleSubmit}>
          {/* Program/Song Name */}
          <label className="block mb-2">
            {entityLabel} Name
            <input
              type="text"
              name="programName"
              value={formData.programName}
              onChange={handleInputChange}
              placeholder={`Enter ${entityLabel.toLowerCase()} name`}
              className={`w-full border p-2 rounded mt-1 ${
                errors.programName ? "border-red-500" : ""
              }`}
            />
            {errors.programName && (
              <p className="text-red-600 text-sm mt-1">{errors.programName}</p>
            )}
          </label>

          {/* Description */}
          <label className="block mb-2">
            {entityLabel} Description
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={`Enter ${entityLabel.toLowerCase()} description`}
              className={`w-full border p-2 rounded mt-1 ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </label>

          {/* Video Link */}
          <label className="block mb-2">
            Video Link
            <input
              type="text"
              name="videoLink"
              value={formData.videoLink}
              onChange={handleInputChange}
              placeholder={
                isSong
                  ? "Enter song video URL (e.g. YouTube link)"
                  : "Optional video URL"
              }
              className={`w-full border p-2 rounded mt-1 ${
                errors.videoLink ? "border-red-500" : ""
              }`}
            />
            {errors.videoLink && (
              <p className="text-red-600 text-sm mt-1">{errors.videoLink}</p>
            )}
          </label>

          {/* Status */}
          <label className="block mb-2">
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`w-full border p-2 rounded mt-1 ${
                errors.status ? "border-red-500" : ""
              }`}
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="text-red-600 text-sm mt-1">{errors.status}</p>
            )}
          </label>

          {/* Image Upload */}
          <label className="block mb-4">
            {entityLabel} Image
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition mt-2 cursor-pointer ${
                errors.file
                  ? "border-red-500 hover:border-red-600"
                  : "border-gray-300 hover:border-blue-400"
              }`}
              onClick={() => document.getElementById("programImage").click()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) setFormData(prev => ({ ...prev, file: droppedFile }));
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-sm text-gray-500">
                <span className="text-blue-600 cursor-pointer hover:underline">
                  Click here to Upload
                </span>{" "}
                or drag and drop
              </p>
              {formData.file && (
                <p className="mt-2 text-green-600">{formData.file.name}</p>
              )}
            </div>
            <input
              type="file"
              id="programImage"
              className="hidden"
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/jpg"
            />
            {errors.file && (
              <p className="text-red-600 text-sm mt-1">{errors.file}</p>
            )}
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-red-500 text-white rounded ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-red-600"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}