"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import HeaderBar from "@/components/HeaderBar";
import { Bell, ChevronDown } from "lucide-react";
import CreateProgramModal from "@/components/Modal/CreateProgramModal";
import NewCategoryModal from "@/components/Modal/NewCategoryModal";
import ManageCategoriesModal from "@/components/Modal/ManageCategoriesModal";
import ChangePasswordModal from "@/components/Modal/ChangePasswordModal";
import { fetchPrograms } from "@/store/slices/programSlice";
import { fetchCategories } from "@/store/slices/categorySlice";
import ProgramTable from "@/components/DashboardTable";

export default function WorkshopsDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { programs, loading, error } = useSelector((state) => state.program);
  const { items: categories = [] } = useSelector((state) => state.category || {});

  const [userName, setUserName] = useState("Guest");
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryModalOpens, setCategoryModalOpens] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) setUserName(storedUser.name);
  }, []);

  // Reuse programs API for Workshops view + fetch categories
  useEffect(() => {
    dispatch(fetchPrograms());
    dispatch(fetchCategories());
  }, [dispatch]);

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

  // Workshops dashboard: ProgramType === "Workshop" OR name includes "workshop"
  const workshopRows = allPrograms.filter((row) => {
    const type = (row.programType || "").toLowerCase();
    const name = (row.name || "").toLowerCase();
    if (type === "workshop") return true;
    return name.includes("workshop");
  });

  const filtered = workshopRows.filter((row) =>
    row.name.toLowerCase().includes(query.toLowerCase())
  );
  const start = (page - 1) * itemsPerPage;
  const paged = filtered.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);

    const lower = (value || "").toLowerCase();
    if (lower === "programs" || lower === "program") {
      router.push("/dashboard");
    } else if (lower === "songs") {
      router.push("/dashboard/songs");
    } else if (lower === "podcast" || lower === "podcasts") {
      router.push("/dashboard/podcast");
    } else if (lower === "workshop" || lower === "workshops") {
      router.push("/dashboard/workshops");
    }
  };

  const handlePassword = () => {
    setChangePasswordOpen(true);
    setIsOpen(false);
  };

  const handleSaveCategory = () => {
    dispatch(fetchCategories());
  };

  return (
    <>
      <div className="min-h-screen flex flex-col text-[#0b132b] bg-white">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Library</h2>

          {/* Bell + Profile */}
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
        <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b bg-white">
          <label className="font-medium text-sm">Categories:</label>

          <select
            value={category}
            onChange={handleCategoryChange}
            className="border rounded-md px-3 py-2 bg-white text-sm"
          >
            <option value="">Select</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          <button
            onClick={() => setCategoryModalOpen(true)}
            className="border border-gray-400 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
          >
            Manage Categories
          </button>

          <button
            onClick={() => setCategoryModalOpens(true)}
            className="bg-[#f25f4c] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#e34e3c] transition"
          >
            Add New Category
          </button>
        </div>

        {/* Workshops Section (reusing Programs data) */}
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Workshops</h2>

            <HeaderBar
              title=""
              query={query}
              setQuery={(val) => {
                setQuery(val);
                setPage(1);
              }}
              showFilter={true}
              showCreate={true}
              createLabel="Add Workshop"
              showProfile={false}
              showNotifications={false}
              onCreate={() => setShowModal(true)}
            />
            {showModal && (
              <CreateProgramModal
                open={showModal}
                onClose={() => setShowModal(false)}
                mode="workshop"
              />
            )}
          </div>

          {loading ? (
            <p>Loading workshops...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : paged.length > 0 ? (
            <ProgramTable
              data={paged}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              start={start}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              entityLabel="Workshop"
            />
          ) : (
            <p className="text-gray-500">No workshops found.</p>
          )}
        </main>
      </div>

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
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </>
  );
}
