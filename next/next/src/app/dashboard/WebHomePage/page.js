"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Upload, Bell, ChevronDown } from "lucide-react";

import SectionHeadings from "@/components/SectionHeadings";
import SectionAbout from "@/components/SectionAbout";
import SectionLeaders from "@/components/SectionLeaders";
import SectionSpeakers from "@/components/SectionSpeakers";
import AppstoreSection from "@/components/AppstoreSection";
import {
  setHeroSectionFormData,
  submitHeroSection,
} from "../../../store/slices/HerosectionSlice";
import SocialMediaLink from "@/components/socialMediaLink.";
import { toast } from "react-toastify";

export default function WebHomePagePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { formData, creating, status } = useSelector((s) => s.heroSection);
  const fileInputRef = React.useRef(null);
  const [userName, setUserName] = React.useState("Guest");
  const [isOpen, setIsOpen] = React.useState(false);

  const tabs = [
    "Hero Section",
    "Headings",
    "About",
    "Leaders",
    "Speakers",
    "Social Media",
    "App Store",
  ];
  const [activeTab, setActiveTab] = React.useState("Hero Section");

  // Load stored user for top bar
  React.useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) setUserName(storedUser.name);
  }, []);

  const handlePick = () => fileInputRef.current?.click();
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      dispatch(setHeroSectionFormData({ UploadFile: file }));
    }
  };

  const onChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      dispatch(setHeroSectionFormData({ [name]: files?.[0] || null }));
    } else {
      dispatch(setHeroSectionFormData({ [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const {
      Title,
      SubTitle,
      ButtonText,
      BackgroundMediaType,
      UploadFile,
      Image2,
      Image3,
      VideoURL,
    } = formData;

    // Validation with toasts
    if (!Title || !SubTitle || !ButtonText) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!UploadFile) {
      toast.error("Please upload an image file.");
      return;
    }

    try {
      const resultAction = await dispatch(
        submitHeroSection({
          Title,
          SubTitle,
          ButtonText,
          BackgroundMediaType: "Image",
          UploadFile,
          Image2,
          Image3,
          // Backend currently requires a non-empty VideoURL even for image hero.
          // Use existing value if provided, otherwise send a harmless placeholder.
          VideoURL: VideoURL || "image-hero-placeholder",
        })
      );

      if (submitHeroSection.fulfilled.match(resultAction)) {
        toast.success("Hero section saved successfully!");
      } else {
        const msg =
          resultAction.payload?.message ||
          resultAction.error?.message ||
          "Failed to save hero section.";
        toast.error(msg);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0b132b] flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-lg font-semibold">Web Home Page</h1>

        <div className="flex items-center gap-6 relative">
          <button
            onClick={() => router.push("/dashboard/notifications")}
            className="relative text-gray-600 hover:text-gray-900"
          >
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt="Profile"
              className="w-8 h-8 rounded-full border"
            />
            <span className="text-sm font-medium text-gray-800">
              {userName}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
          </div>

          {isOpen && (
            <div className="absolute right-0 top-12 w-40 bg-white border rounded shadow-md z-50">
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  router.push("/login");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center sm:justify-start px-3 sm:px-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 sm:px-4 py-2 text-sm font-medium transition whitespace-nowrap ${activeTab === tab
              ? "text-red-500 border-b-2 border-red-500"
              : "text-gray-600 hover:text-gray-800"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <main className="p-4 sm:p-6 flex-1">
        {activeTab === "Hero Section" && (
          <form
            onSubmit={onSubmit}
            className="bg-white rounded-lg border p-4 sm:p-6 shadow-sm max-w-5xl mx-auto w-full space-y-4"
          >
            <h2 style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: '17px',
              lineHeight: '140%',
              letterSpacing: '0%',
              width: '108px',
              height: '24px',
              margin: 0,
              padding: 0
            }}>
              Hero Section
            </h2>
            {/* Title */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Title *
              </label>
<input
  type="text"
  name="Title"
  value={formData.Title}
  onChange={onChange}
  placeholder="Rakshana Television – Your Channel for Divine Truth"
  style={{
    width: '900px',
    height: '40px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #09090F',
    outline: 'none',
    fontFamily: 'Manrope, sans-serif',
    fontSize: '14px',
    lineHeight: '20px'
  }}
  className="placeholder:font-medium placeholder:leading-[100%] placeholder:tracking-[0%]"
  required
/>
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                SubTitle *
              </label>
              <textarea
                rows={3}
                name="SubTitle"
                value={formData.SubTitle}
                onChange={onChange}
                placeholder="Tune in for uplifting messages..."
                style={{
                  width: '900px',
                  height: '70px',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #09090F',
                  outline: 'none',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '14px',
                  lineHeight: '20px',
                  resize: 'none'
                }}
                required
              />
            </div>

            {/* Button Text */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                ButtonText *
              </label>
              <input
                type="text"
                name="ButtonText"
                value={formData.ButtonText}
                onChange={onChange}
                placeholder="Watch Now"
                style={{
                  width: '900px',
                  height: '40px',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #09090F',
                  outline: 'none',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '14px',
                  lineHeight: '20px'
                }}
                required
              />
            </div>

            {/* Background Media Type */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Background Media Type
              </label>

            </div>

            {/* Additional images: Image2 and Image3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Image2 (optional)
                </label>
                <label className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-5 flex flex-col items-center justify-center text-center text-sm text-gray-500 hover:border-blue-400 cursor-pointer transition">
                  <Upload className="w-5 h-5 text-blue-500 mb-1" />
                  <span className="text-xs sm:text-sm">
                    {formData?.Image2?.name || "Click to choose image"}
                  </span>
                  <input
                    type="file"
                    name="Image2"
                    accept="image/*"
                    onChange={onChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Image3 (optional)
                </label>
                <label className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-5 flex flex-col items-center justify-center text-center text-sm text-gray-500 hover:border-blue-400 cursor-pointer transition">
                  <Upload className="w-5 h-5 text-blue-500 mb-1" />
                  <span className="text-xs sm:text-sm">
                    {formData?.Image3?.name || "Click to choose image"}
                  </span>
                  <input
                    type="file"
                    name="Image3"
                    accept="image/*"
                    onChange={onChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Upload / Dropzone for main background (UploadFile) */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-blue-400 transition"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handlePick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && handlePick()
              }
            >
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-sm sm:text-base text-gray-500 mb-3">
                  <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePick();
                    }}
                  >
                    Click to choose a file
                  </span>{" "}
                  or drag and drop
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  name="UploadFile"
                  accept="image/*"
                  onChange={onChange}
                  className="hidden"
                />

                {formData?.UploadFile?.name ? (
                  <div className="text-xs text-gray-600 mt-2">
                    {formData.UploadFile.name}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Status */}
            {status && <div className="text-sm">{status}</div>}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-60"
              >
                {creating ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}

        {activeTab === "Headings" && (
          <div className="max-w-5xl mx-auto w-full">
            <SectionHeadings />
          </div>
        )}

        {activeTab === "About" && (
          <div className="max-w-5xl mx-auto w-full">
            <SectionAbout />
          </div>
        )}

        {activeTab === "Leaders" && (
          <div className="max-w-5xl mx-auto w-full">
            <SectionLeaders />
          </div>
        )}

        {activeTab === "Speakers" && (
          <div className="max-w-5xl mx-auto w-full">
            <SectionSpeakers />
          </div>
        )}

        {activeTab === "Social Media" && (
          <div className="max-w-5xl mx-auto w-full">
            <SocialMediaLink />
          </div>
        )}

        {activeTab === "App Store" && (
          <div className="max-w-5xl mx-auto w-full">
            <AppstoreSection />
          </div>
        )}
      </main>
    </div>
  );
}