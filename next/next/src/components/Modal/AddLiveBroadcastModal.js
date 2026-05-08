import React from "react";

export default function AddLiveBroadcastModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">
        {/* Close button */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
          aria-label="Close"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6">Add Live Broadcast</h2>
        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave?.();
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-500 mb-1" htmlFor="broadcastName">
              Live Broadcast Name
            </label>
            <input
              className="w-full border border-gray-200 rounded p-3 text-base focus:outline-none"
              id="broadcastName"
              type="text"
              placeholder="Enter name"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-500 mb-1" htmlFor="liveLink">
              Live Link
            </label>
            <input
              className="w-full border border-gray-200 rounded p-3 text-base focus:outline-none"
              id="liveLink"
              type="text"
              placeholder="Add live link"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-5 py-2 rounded border border-gray-400 text-black bg-white hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-red-400 text-white hover:bg-red-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
