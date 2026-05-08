"use client";
import React, { useState } from "react";

export default function ChangePasswordModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[440px] max-w-[90%] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg">
            ✕
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-red-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-red-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Confirm New Password</label>
            <input
              type="password"
              placeholder="Enter confirm new password"
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm focus:ring-2 focus:ring-red-300 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#ef4444] text-white rounded-md text-sm hover:bg-[#dc2626]"
            >
              Change password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
