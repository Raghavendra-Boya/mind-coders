"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Bell, ChevronDown } from "lucide-react";
import HeaderBar from "@/components/HeaderBar";
import ChangePasswordModal from "@/components/Modal/ChangePasswordModal"; // ✅ added
import CreateProgramModal from "@/components/Modal/CreateProgramModal";
import NewCategoryModal from "@/components/Modal/NewCategoryModal";
import ManageCategoriesModal from "@/components/Modal/ManageCategoriesModal";
import { fetchPrograms } from "@/store/slices/programSlice";
import { fetchCategories } from "@/store/slices/categorySlice";
import DashboardTable from "@/components/DashboardTable";

export default function ProgramsDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { programs, loading, error } = useSelector((state) => state.program);
  const { items: categories = [], loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.category || {});

  // Debug: Log categories and loading state
  console.log('Categories from Redux:', categories);
  console.log('Categories loading:', categoriesLoading);
  console.log('Categories error:', categoriesError);

  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [userName, setUserName] = useState("Guest");
  const [isOpen, setIsOpen] = useState(false);
  // empty string so the select shows the top "Select" option by default
  const [category, setCategory] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryModalOpens, setCategoryModalOpens] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false); // ✅ for modal

  // Function to determine mode based on category
  const getModeFromCategory = (category) => {
    if (!category) return "program";
    const lowerCategory = category.toLowerCase();
    if (lowerCategory === "songs") return "song";
    if (lowerCategory === "podcasts" || lowerCategory === "podcast") return "podcast";
    if (lowerCategory === "workshops" || lowerCategory === "workshop") return "workshop";
    return "program";
  };

  // ✅ Fetch programs & categories on mount
  useEffect(() => {
    dispatch(fetchPrograms());
    dispatch(fetchCategories());
  }, [dispatch]);

  // ✅ Load stored user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) setUserName(storedUser.name);
  }, []);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    setPage(1); // Reset to first page when changing categories
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleSaveCategory = () => {
    // After a new category is created, refresh the list so the dropdown updates
    dispatch(fetchCategories());
  };

  const handlePassword = () => {
    setShowChangePassword(true);
    setIsOpen(false);
  };

  const allPrograms = Array.isArray(programs?.ProgramsData)
    ? programs.ProgramsData.map((p, index) => ({
      id: p.SNo || index,
      name: p.ProgramName,
      episodeCount: p.EpisodeCount || 0,
      status: p.Status,
      createdAt: p.TrDate ? new Date(p.TrDate).toLocaleDateString() : "—",
      programType: p.ProgramType,
    }))
    : [];

  // Debug: Log the raw categories data
  console.log('Raw categories from Redux:', categories);

  // Get unique categories from programs
  const programCategories = [
    { id: 'program', name: 'Programs' },
    { id: 'song', name: 'Songs' },
    { id: 'podcast', name: 'Podcasts' },
    { id: 'workshop', name: 'Workshops' }
  ];

  // For now, use the static categories until we fix the API response
  const filteredCategories = programCategories;

  // Log the final categories being used
  console.log('Using categories:', filteredCategories);

  // Filter programs based on selected category
  const baseRows = allPrograms.filter((row) => {
    const name = (row.name || "").toLowerCase();
    const type = (row.programType || "").toLowerCase();
    const lowerCategory = (category || "").toLowerCase();

    // Always exclude Spokes Person items from all views
    if (type === "spokes" || name.includes("spokes") || name.includes("spokesperson")) {
      return false;
    }

    if (!lowerCategory || lowerCategory === "program" || lowerCategory === "programs") {
      // Show programs (non-song, non-podcast, non-workshop, non-spokes)
      return !name.startsWith("[song] ") &&
        type !== "podcast" &&
        !name.includes("podcast") &&
        type !== "workshop" &&
        !name.includes("workshop");
    } else if (lowerCategory === "songs") {
      // Show only songs
      return name.startsWith("[song] ");
    } else if (lowerCategory === "podcast" || lowerCategory === "podcasts") {
      // Show only podcasts
      return type === "podcast" || name.includes("podcast");
    } else if (lowerCategory === "workshop" || lowerCategory === "workshops") {
      // Show only workshops
      return type === "workshop" || name.includes("workshop");
    }

    // For other categories, show items that match the category name
    return name.includes(lowerCategory) || type === lowerCategory;
  });

  // ✅ Filter + paginate
  const filtered = baseRows.filter((row) =>
    row.name.toLowerCase().includes(query.toLowerCase())
  );
  const start = (page - 1) * itemsPerPage;
  const paged = filtered.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  return (
    <>
      <div className="min-h-screen flex flex-col text-[#0b132b] bg-white">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800,
              fontSize: '20px',
              lineHeight: '140%',
              letterSpacing: '0%',
              margin: 0,
              padding: 0,
              color: '#0b132b'
            }}
          >
            Library
          </h2>

          {/* Notifications + Profile */}
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
                  onClick={handlePassword}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b">
          <label
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '140%',
              letterSpacing: '0%',
              color: '#0b132b',
              width: '90px',
              height: '22px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Categories:
          </label>
          <select
            style={{
              width: '146px',
              height: '32px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #D1D5DC',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '14px',
              lineHeight: '140%',
              color: '#1F2937',
              outline: 'none',
              cursor: 'pointer'
            }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={categoriesLoading}
          >
            <option value="">All Categories</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {categoriesLoading && <span className="ml-2 text-gray-500">Loading categories...</span>}
          {categoriesError && <span className="ml-2 text-red-500">Error loading categories</span>}

          <button
            onClick={() => setCategoryModalOpen(true)}
            style={{
              width: '155px',
              height: '32px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #D1D5DC',
              backgroundColor: 'white',
              color: '#1F2937',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '140%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Manage Categories
          </button>

          <button
            onClick={() => setCategoryModalOpens(true)}
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '140%',
              letterSpacing: '0%',
              backgroundColor: '#f25f4c',
              color: 'white',
              borderRadius: '6px',
              padding: '6px 16px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e34e3c'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f25f4c'}
          >
            Add New Category
          </button>
        </div>

        {/* Programs / Songs Section (depends on selected category) */}
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {category === "songs" ? "Songs" :
                category === "podcasts" || category === "podcast" ? "Podcasts" :
                  category === "workshops" || category === "workshop" ? "Workshops" :
                    category || "Programs"}
            </h2>

            <HeaderBar
              title=""
              query={query}
              setQuery={(val) => {
                setQuery(val);
                setPage(1);
              }}
              showFilter={true}
              showCreate={true}
              createLabel={
                category === "songs" ? "Add Song" :
                  category === "podcast" || category === "podcasts" ? "Add Podcast" :
                    category === "workshop" || category === "workshops" ? "Add Workshop" :
                      category === "spokes person" ? "Add Spokes Person" :
                        `Add ${category || "Program"}`
              }
              showProfile={false}
              showNotifications={false}
              onCreate={() => setModalOpen(true)}
            />
          </div>

          {loading ? (
            <p>Loading programs...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : paged.length > 0 ? (
            <DashboardTable
              key={`table-${category}`}  // Force re-render on category change
              data={paged}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              start={start}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              entityLabel={
                category === "songs" ? "Song" :
                  category === "podcasts" || category === "podcast" ? "Podcast" :
                    category === "workshops" || category === "workshop" ? "Workshop" :
                      "Program"
              }
            />
          ) : (
            <p className="text-gray-500">No programs found.</p>
          )}
        </main>
      </div>

      {/* 🔐 Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      {/* Other Modals */}
      <CreateProgramModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={getModeFromCategory(category)}
        onSuccess={() => {
          dispatch(fetchPrograms());
        }}
      />
      <NewCategoryModal
        open={categoryModalOpens}
        onClose={() => setCategoryModalOpens(false)}
        onSave={handleSaveCategory}
      />
      <ManageCategoriesModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />
    </>
  );
}
