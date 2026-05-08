"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Bell, Search, Filter } from "lucide-react";
import ChangePasswordModal from "./Modal/ChangePasswordModal";

export default function HeaderBar({
  title = false,
  query = "",
  setQuery,
  showSearch = true,
  showFilter = true,
  showCreate = false,
  createLabel = false,
  showProfile = true,
  showNotifications = true,
  onCreate,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false); // ✅ modal control
  const [userName, setUserName] = useState("Guest");
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) setUserName(storedUser.name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handlePassword = () => {
    setShowChangePassword(true);
    setIsOpen(false);
  };

  return (
    <>
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4 pb-4">
          <h1 className="text-xl font-semibold">{title}</h1>

          {(showNotifications || showProfile) && (
            <div className="flex items-center gap-4 relative">
              {showNotifications && (
                <button
                  onClick={() => router.push("/dashboard/notifications")}
                  className="relative text-gray-600 hover:text-gray-900"
                >
                  <Bell className="w-5 h-5" strokeWidth={1.5} />
                  <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              )}

              {showProfile && (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <img
                    src="https://i.pravatar.cc/40?img=12"
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {userName}
                  </span>
                  <ChevronDown
                    className="w-4 h-4 text-gray-500"
                    strokeWidth={1.5}
                  />
                </div>
              )}

              {isOpen && showProfile && (
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
          )}
        </div>

        <div className="flex justify-end items-center gap-3">
          {showSearch && (
            <div className="relative" style={{ width: '240px' }}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery?.(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '8px 10px 8px 36px',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DC',
                  backgroundColor: 'white',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '14px',
                  lineHeight: '140%',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f25f4c';
                  e.target.style.boxShadow = '0 0 0 2px rgba(242, 95, 76, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DC';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          {showFilter && (
            <button
              style={{
                width: '82px',
                height: '36px',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #D1D5DC',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '14px',
                lineHeight: '140%',
                color: '#1F2937',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <img
                src="/asset/filter.png"
                alt="Filter"
                style={{
                  width: '20px',
                  height: '20px',
                  opacity: 1
                }}
              />
              <span>Filter</span>
            </button>
          )}

          {showCreate && (
            <button
              onClick={onCreate}
              style={{
                width: '140px',
                height: '32px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #D1D5DC',
                backgroundColor: '#ef4444',
                color: 'white',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '14px',
                lineHeight: '140%',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              {createLabel}
            </button>
          )}
        </div>
      </header>

      {/* ✅ Popup Component */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
}
