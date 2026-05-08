"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import HeaderBar from "@/components/HeaderBar";
import CreateTestimonialModal from "@/components/Modal/CreateTestimonialModal";
import { fetchTestimonials } from "@/store/slices/TestimonialSlice";

export default function TestimonialsPage() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { items = [] } = useSelector((s) => s.testimonials || {}, shallowEqual);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  const testimonials = useMemo(() => {
    const arr = Array.isArray(items) ? items : [];
    return arr.map((t, idx) => ({
      id: t.SNo ?? idx + 1,
      name: t.TestimonialName ?? "",
      role: "Role 1",
      image: t.PersonImageURL || "/placeholder.png",
      text: t.TestimonialText ?? "",
    }));
  }, [items]);

  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase();
    return testimonials.filter((t) => (t.name || "").toLowerCase().includes(q));
  }, [query, testimonials]);

  return (
    <div className="min-h-screen bg-[#f6f8fa] p-4 sm:p-8 border-b">
      <HeaderBar
        title="Testimonials"
        query={query}
        setQuery={(val) => setQuery(val)}
        showSearch={true}
        showFilter={true}
        showCreate={true}
        createLabel="Add Testimonial"
        onCreate={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-sm border border-gray-200 rounded-lg p-5 flex flex-col justify-between"
          >

            <div className="flex items-center gap-3 mb-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://placehold.co/96x96?text=No+Image&font=inter";
                }}
              />
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  {item.name}
                </h3>
                {/* <p className="text-sm text-gray-500">{item.role}</p> */}
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{item.text}</p>

            <div className="flex gap-3 mt-auto">
              <button className="bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600">
                Edit
              </button>
              <button className="border border-red-500 text-red-500 text-sm px-4 py-2 rounded-md hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <CreateTestimonialModal onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}