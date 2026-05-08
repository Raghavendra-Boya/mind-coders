"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, MoreVertical, ChevronDown } from "lucide-react";
import ChangePasswordModal from "@/components/Modal/ChangePasswordModal";

export default function NotificationsPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false); // ✅ for modal
  const [userName] = useState("John Doe"); // Replace with dynamic data if needed

  const handleLogout = () => {
    console.log("User logged out");
    router.push("/login");
  };

  const handlePassword = () => {
    setShowChangePassword(true);
    setIsOpen(false);
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Event Booked",
      message: 'John Doe booked a ticket for "Apostle Joshua Selman Program"',
      time: "5 minutes ago",
      unread: true,
    },
    {
      id: 2,
      title: "Prayer Request",
      message: "Sarah Johnson has submitted a new prayer request",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Slot Booked",
      message: "Michael Brown booked a consultation slot for tomorrow at 3:00 PM",
      time: "2 hours ago",
      unread: false,
    },
    {
      id: 4,
      title: "Donation Received",
      message: "Received a donation of $500 from Emily Davis",
      time: "3 hours ago",
      unread: true,
    },
    {
      id: 5,
      title: "Event Booked",
      message: 'David Wilson booked a ticket for "Youth Conference 2025"',
      time: "5 hours ago",
      unread: false,
    },
    {
      id: 6,
      title: "Prayer Request",
      message: "James Anderson requested prayer for healing",
      time: "1 day ago",
      unread: false,
    },
    {
      id: 7,
      title: "Slot Booked",
      message: "Lisa Martinez booked a counseling session for next week",
      time: "1 day ago",
      unread: true,
    },
    {
      id: 8,
      title: "Donation Received",
      message: "Received a donation of $250 from Robert Taylor",
      time: "2 days ago",
      unread: false,
    },
  ]);

  return (
    <>
      <div className="min-h-screen bg-white px-8 py-6 text-[#0b132b]">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Notifications</h2>

          {/* 🔔 Notification + Profile Menu */}
          <div className="flex items-center gap-6 relative">
            <button
              onClick={() => router.push("/dashboard/notifications")}
              className="relative text-gray-600 hover:text-gray-900"
            >
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* 👤 Profile Dropdown */}
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

            {/* Dropdown Menu */}
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

        {/* Notifications List */}
        <div className="flex flex-col space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between p-4 rounded-lg border transition ${
                n.unread
                  ? "bg-[#e8f1ff] border-transparent"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 mt-0.5 text-gray-600" />
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-semibold">{n.title}</h3>
                    {n.unread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
              </div>

              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🔐 Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
}
