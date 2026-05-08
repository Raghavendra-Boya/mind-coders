"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Bell, ChevronDown } from "lucide-react";
import HeaderBar from "@/components/HeaderBar";
import RequestPrayerTable from "@/components/RequestPrayerTable";
import { getRequestPrayers } from "../../../store/slices/requestPrayerSlice";

export default function RequestPrayerList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { list, listLoading, listError } = useSelector(
    (state) => state.requestPrayer
  );

  const [query, setQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [userName, setUserName] = useState("Guest");
  const [isOpen, setIsOpen] = useState(false);

  // Fetch prayer requests on mount
  useEffect(() => {
    dispatch(getRequestPrayers());
  }, [dispatch]);

  // Load stored user for top bar
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) setUserName(storedUser.name);
  }, []);

  // Map API response to table rows
  const rows = useMemo(() => {
    if (!list) return [];

    // list is already an array of UserData objects
    return list.map((user, idx) => ({
      id: user.UserID || idx + 1,
      name: user.FullName || "",
      email: user.Email || "",
      mobilenumber: user.MobileNo || "",
      location: user.Location || "",
      comment: user.Message || "",
    }));
  }, [list]);

  // Filter rows by search query
  const filtered = useMemo(() => {
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.email.toLowerCase().includes(query.toLowerCase()) ||
        r.location.toLowerCase().includes(query.toLowerCase())
    );
  }, [rows, query]);

  // Pagination logic
  const start = (page - 1) * itemsPerPage;
  const paged = filtered.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0b132b]">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Request Prayer</h2>

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

      <main className="flex-1 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div />
          <HeaderBar
            title=""
            showSearch
            showFilter
            showCreate={false}
            createLabel="Add Request Prayer"
            query={query}
            setQuery={(val) => {
              setQuery(val);
              setPage(1); // Reset page on search
            }}
            showProfile={false}
            showNotifications={false}
          />
        </div>

        <div className="mt-0">
          {listLoading && <p>Loading requests...</p>}
          {listError && <p className="text-red-500 mb-2">{listError}</p>}

          {!listLoading && !listError && (
            <RequestPrayerTable
              data={paged}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              start={start}
              filtered={filtered}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={(val) => {
                setItemsPerPage(val);
                setPage(1);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
