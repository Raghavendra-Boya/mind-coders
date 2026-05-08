"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NewLeaderModal from "./Modal/NewLeaderModal";
import {
  fetchLeaders,
  insertLeader,
  deleteLeader,
} from "../store/slices/LeaderSlice";
import { toast } from "react-toastify";

export default function SectionLeaders() {
  const dispatch = useDispatch();
  const { leaders, loading, error, status } = useSelector(
    (state) => state.leader
  );

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchLeaders());
  }, [dispatch]);

  const handleAddLeader = async ({
    name,
    designation,
    description,
    leaderImage,
  }) => {
    try {
      await dispatch(
        insertLeader({ name, designation, description, leaderImage })
      ).unwrap();
      toast.success("Leader added successfully!");
      setModalOpen(false);
      dispatch(fetchLeaders());
    } catch (err) {
      console.error("Insert failed:", err);
      const msg =
        err?.message || "Failed to add leader. Please try again.";
      toast.error(msg);
    }
  };

  const handleDeleteLeader = async (sno) => {
    if (!confirm("Are you sure you want to delete this leader?")) return;

    try {
      await dispatch(deleteLeader(sno)).unwrap();
      dispatch(fetchLeaders());
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete leader");
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-800">Leaders</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
        >
          Add New Leader
        </button>
      </div>

      {/* Status / Error */}
      {(error || status) && (
        <p
          className={`text-sm mb-4 ${
            error ? "text-red-600" : "text-green-600"
          }`}
        >
          {error || status}
        </p>
      )}

      {/* Leaders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {loading ? (
          <p>Loading...</p>
        ) : leaders && leaders.length > 0 ? (
          leaders.map((leader, index) => (
            <div
              key={leader.id || `${leader.name}-${index}`}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 flex justify-center">
                <img
                  src={
                    leader.image ||
                    "https://placehold.co/120x120?text=Leader"
                  }
                  alt={leader.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>

              {/* Content */}
              <div className="flex-1 w-full">
                <h3 className="text-lg font-semibold text-gray-900">
                  {leader.name}
                </h3>
                {leader.designation && (
                  <p className="text-sm text-gray-600 mt-0.5">
                    {leader.designation}
                  </p>
                )}
                {leader.description && (
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    {leader.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="px-4 py-1.5 rounded-md border border-red-500 text-red-500 text-xs sm:text-sm font-medium hover:bg-red-50">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLeader(leader.sno)}
                    className="px-4 py-1.5 rounded-md bg-red-500 text-white text-xs sm:text-sm font-medium hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No leaders found.</p>
        )}
      </div>

      <NewLeaderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddLeader}
      />
    </div>
  );
}