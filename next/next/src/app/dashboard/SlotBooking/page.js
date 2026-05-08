"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown } from "lucide-react";
import HeaderBar from "@/components/HeaderBar";
import SlotBookingTable from "@/components/SlotBookingTable";

export default function SlotBookingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("Guest");
  const [isOpen, setIsOpen] = useState(false);

  // Fetch slot bookings
  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/MoreLinks/GetSlotBookings");
        const data = await res.json();

        console.log("🔥 API:", data);

        if (res.ok && data.success) {
          setSlots(data.data || []);
        } else {
          setError(data.message || "Failed to fetch slots");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching slots");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  // Load stored user for top bar
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) setUserName(storedUser.name);
  }, []);

  // Filter using fullName
  const filtered = useMemo(() => {
    return slots.filter((s) =>
      (s.fullName || "").toLowerCase().includes(query.toLowerCase())
    );
  }, [slots, query]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const paged = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col text-[#0b132b] bg-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Slot Bookings</h2>

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
        <div className="flex items-center justify-between mb-6">
          <div />
          <HeaderBar
            title=""
            query={query}
            setQuery={(val) => {
              setQuery(val);
              setPage(1);
            }}
            showCreate={false}
            showSearch={true}
            showFilter={true}
            showProfile={false}
            showNotifications={false}
          />
        </div>

        {loading ? (
          <div className="text-center mt-10 text-gray-600">Loading slots...</div>
        ) : error ? (
          <div className="text-center mt-10 text-red-600">{error}</div>
        ) : (
          <SlotBookingTable
            data={paged}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            start={start}
            filtered={filtered}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        )}
      </main>
    </div>
  );
}
