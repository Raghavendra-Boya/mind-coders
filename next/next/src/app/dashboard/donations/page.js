"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown } from "lucide-react";
import HeaderBar from "@/components/HeaderBar";
import { DonationsTable } from "@/components/DonationsTable";
import AddDonationModal from "@/components/Modal/AddDonationModal";

export default function DonationsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [donations, setDonations] = useState(
    Array.from({ length: 50 }).map((_, i) => ({
      id: i + 1,
      name: `Donation ${i + 1}`,
      amount: "200",
      mobilenumber: "9643464384",
      comment: "Lorem Ipsum placeholder text for use in your graphic",
    }))
  );
  const [userName, setUserName] = useState("Guest");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (donation) => {
    const newDonation = { id: donations.length + 1, ...donation };
    setDonations([newDonation, ...donations]);
  };

  // Filtered & paginated data
  const filtered = donations.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );
  const start = (page - 1) * itemsPerPage;
  const paged = filtered.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0b132b]">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Donations</h2>

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
            showSearch={true}
            showFilter={true}
            showCreate={true}
            createLabel="Add Donation"
            query={query}
            setQuery={(val) => {
              setQuery(val);
              setPage(1);
            }}
            showProfile={false}
            showNotifications={false}
            onCreate={() => setModalOpen(true)}
          />
        </div>

        <div className="mt-0 w-full overflow-x-auto">
          <DonationsTable
            data={paged}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            start={start}
            filtered={filtered}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>

        <AddDonationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      </main>
    </div>
  );
}
