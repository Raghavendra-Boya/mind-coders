"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddSpeakerModal from "./Modal/AddSpeakerModal";
import { fetchSpeakers, insertSpeaker, deleteSpeaker } from "../store/slices/SpeakerSlice";

export default function SectionSpeakers() {
  const dispatch = useDispatch();
  const { speakers: speakerList, loading } = useSelector((state) => state.speaker);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSpeakers());
  }, [dispatch]);

  const handleAddSpeaker = async (newSpeaker) => {
    const formData = new FormData();
    formData.append("name", newSpeaker.name);
    formData.append("role", newSpeaker.role);
    if (newSpeaker.image) formData.append("image", newSpeaker.image);

    const result = await dispatch(insertSpeaker(formData));
    if (insertSpeaker.fulfilled.match(result)) setModalOpen(false);
  };

  const handleDeleteSpeaker = (id) => {
    if (confirm("Are you sure you want to delete this speaker?")) {
      dispatch(deleteSpeaker(id)); // deleteSpeaker thunk uses POST
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-800">Speakers</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
        >
          Add New Speakers
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <p>Loading...</p>
        ) : Array.isArray(speakerList) && speakerList.length > 0 ? (
          speakerList.map((speaker, index) => (
            <div
              key={`${speaker.id}-${index}`}
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col items-center text-center"
            >
              <img
                src={speaker.image}
                alt={speaker.name}
                className="w-16 h-16 rounded-full object-cover mb-3"
              />
              <h3 className="text-sm font-semibold text-gray-800">{speaker.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{speaker.role}</p>

              <div className="flex gap-3 mt-auto">
                <button className="border border-red-500 text-red-500 text-xs px-4 py-2 rounded-md hover:bg-red-50">
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSpeaker(speaker.id)}
                  className="bg-red-500 text-white text-xs px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No speakers found.</p>
        )}
      </div>

      <AddSpeakerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddSpeaker}
      />
    </div>
  );
}
