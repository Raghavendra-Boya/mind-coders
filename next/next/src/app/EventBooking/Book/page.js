"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingDetails from "./BookingDetails";

export default function Book() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get("eventId");

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const totalAmount = event ? ticketCount * event.price : 0;

  const handleProceed = () => {
    setShowBookingDetails(true);
  };

  useEffect(() => {
    if (!eventId) {
      setError("No event ID provided");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const res = await fetch("/api/Event/GetEvents");
        const data = await res.json();
        const events = data?.EventsData || [];

        const found = events.find(
          (e) => String(e.SNo) === eventId
        );

        if (!found) {
          setError("Event not found");
        } else {
          setEvent({
            id: found.SNo,
            title: found.EventName,
            date: found.EventDate,
            venue: found.Venue,
            image: found.EventImageURL,
            description: found.Description,
            price: found.TicketPrice,
          });
        }
      } catch (err) {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
        <Footer />
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-red-500">
          {error}
        </div>
        <Footer />
      </>
    );
  }

  if (showBookingDetails) {
    return (
      <>
        <Navbar />
        <BookingDetails event={event} ticketCount={ticketCount} totalAmount={totalAmount} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* PAGE CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 mt-10">

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2">

            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 mb-4 text-sm">
              <button
                onClick={() => router.back()}
                className="font-fustat font-semibold text-lg leading-[150%] text-gray-600 hover:text-gray-900 "
              >
                Events
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700">{event.title}</span>
            </div>

            {/* IMAGE (FIGMA SIZE) */}
            <div className="w-full h-[320px] rounded-2xl overflow-hidden mb-6">
              <img
                src={event.image || "/placeholder.png"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* TITLE */}
            <h1
              className="font-fustat font-extrabold text-[40px] leading-[120%] text-gray-900 mb-3"
              style={{ width: '487px', height: '48px' }}
            >
              {event.title}
            </h1>

            {/* META */}
            {/* META */}
            <div className="flex items-center space-x-4 mb-6">
              {/* Date with Calendar Icon */}
              <div className="flex items-center">

                <p className="font-fustat font-medium text-lg leading-[140%] text-gray-600">
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Venue with Location Icon */}
              <div className="flex items-center">

                <p className="font-fustat font-medium text-lg leading-[140%] text-gray-600">
                  {event.venue}
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-700 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* RIGHT CARD — PERFECTLY ALIGNED */}
          <div className="lg:col-span-1">

            {/* Spacer to align with breadcrumb height */}
            <div className="h-[28px] mb-4"></div>

            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900">
                Choose Tickets
              </h2>

              {/* Ticket Price */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">
                  Ticket Price
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  ₹{event.price}/-
                </span>
              </div>

              {/* Select Tickets */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">
                  Select Tickets
                </span>

                {/* Quantity Controller */}
                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setTicketCount((prev) => Math.max(1, prev - 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="w-10 text-center font-medium text-gray-900">
                    {ticketCount}
                  </span>

                  <button
                    type="button"
                    onClick={() => setTicketCount((prev) => prev + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={handleProceed}
                className="w-full py-3 rounded-full text-white font-semibold
        bg-gradient-to-r from-[#A184F6] to-[#AA4249]
        hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                Proceed →
              </button>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
