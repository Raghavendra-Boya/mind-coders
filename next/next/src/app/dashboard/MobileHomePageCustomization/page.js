"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { MoreVertical, Bell, ChevronDown } from "lucide-react";
import HeaderBar from "@/components/HeaderBar";
import AddSectionModal from "@/components/Modal/AddSectionModal";
import {
  fetchMobileSections,
  insertMobileSection,
} from "../../../store/slices/MobileSectionSlice";
import { fetchCategories } from "../../../store/slices/categorySlice";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items: sections, loading, error } = useSelector(
    (state) => state.mobileSections
  );
  const { items: categories } = useSelector((state) => state.category);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [userName, setUserName] = React.useState("Guest");
  const [isOpen, setIsOpen] = React.useState(false);

  // fetch sections and categories on mount 
  useEffect(() => {
    dispatch(fetchMobileSections());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Load stored user for top bar
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) setUserName(storedUser.name);
  }, []);

  const getCategoryName = (categoryId) => {
    if (!categoryId) return "";
    const idNum = Number(categoryId);
    const match = categories.find((c) => c.id === idNum);
    return match?.CategoryName || String(categoryId);
  };

  const getStaticHeading = (section) => {
    const name = getCategoryName(section.categoryId).toLowerCase();

    // handle singular/plural and small spelling differences
    if (name.includes("program")) {
      return "Top Programs for you";
    }
    if (name.includes("podcast")) {
      return "Podcasts";
    }
    if (name.includes("workshop")) {
      // You can change this to "Top Songs" for a different Workshop section
      return "Popular Songs";
    }

    // fallback: show the category name itself
    return getCategoryName(section.categoryId);
  };

  const handleSave = (newSection) => {
    // adapt body shape to what your API expects
    dispatch(
      insertMobileSection({
        categoryID: newSection.categoryId,
        positionNumber: newSection.positionNumber,
      })
    ).then(() => {
      // reload list after insert
      dispatch(fetchMobileSections());
      setIsModalOpen(false);
    });
  };

  // Apply filtering based on HeaderBar search
  const filteredSections = sections.filter((section) => {
    const cat = getCategoryName(section.categoryId).toLowerCase();
    const heading = getStaticHeading(section).toLowerCase();
    const q = query.toLowerCase();
    return cat.includes(q) || heading.includes(q);
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0b132b]">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Mobile Home Page Customization</h2>

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
            <span className="text-sm font-medium text-gray-800">{userName}</span>
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

      <main className="flex-1 p-6 sm:p-8 border-b">
        <div className="flex items-center justify-between mb-4">
          <div />
          <HeaderBar
            title=""
            showSearch={true}
            showFilter={false}
            showCreate={true}
            createLabel="Add Section"
            query={query}
            setQuery={(val) => setQuery(val)}
            showProfile={false}
            showNotifications={false}
            onCreate={() => setIsModalOpen(true)}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          {loading && <p>Loading sections...</p>}
          {error && <p className="text-red-500">{String(error)}</p>}

          <div className="space-y-4">
            {filteredSections.map((section) => (
              <div
                key={section.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center "
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 w-full sm:w-auto mb-3 sm:mb-0">
                  <span className="text-xs font-medium bg-red-100 text-red-500 px-2 py-1 rounded-full w-fit mb-2 sm:mb-0">
                    {getCategoryName(section.categoryId)}
                  </span>
                  <h2 className="text-blue-600 text-sm sm:text-base font-medium cursor-pointer hover:underline">
                    {getStaticHeading(section)}
                  </h2>
                </div>

                <div className="flex items-center w-full sm:w-auto space-x-2">
                  <input
                    type="number"
                    placeholder="Position"
                    className="border rounded-md px-3 py-2 w-full sm:w-48 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    defaultValue={section.positionNumber}
                  />
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <AddSectionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}