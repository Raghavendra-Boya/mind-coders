"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * ProgramDetails page
 * - Controlled form (mobile, address, names)
 * - Ticket count and price
 * - Basic validation
 * - router.push to /payment with encoded booking data
 */

export default function Book() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams?.get("eventId");

  // replace static event with fetched eventData
  const [eventData, setEventData] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(Boolean(eventId));
  const [fetchError, setFetchError] = useState("");

  // Form state (unchanged) but use eventData fallbacks
  const [ticketCount, setTicketCount] = useState(3);
  const [names, setNames] = useState(() => Array(3).fill(""));
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  // Validation state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Keep names array length in sync with ticketCount
    setNames(prev => {
      const next = [...prev];
      if (ticketCount > prev.length) {
        return [...next, ...Array(ticketCount - prev.length).fill("")];
      } else if (ticketCount < prev.length) {
        return next.slice(0, ticketCount);
      }
      return next;
    });
  }, [ticketCount]);

  // fetch event by id (read from GetEvents and match SNo/EventName/id)
  useEffect(() => {
    let mounted = true;
    if (!eventId) {
      setLoadingEvent(false);
      return;
    }

    async function loadEvent() {
      setLoadingEvent(true);
      try {
        const res = await fetch("/api/Event/GetEvents");
        const data = await res.json();
        const list =
          Array.isArray(data?.EventsData) ? data.EventsData :
          Array.isArray(data?.events) ? data.events :
          Array.isArray(data) ? data :
          [];

        const found = list.find((e) => {
          const sid = String(e.SNo ?? e.id ?? e.EventID ?? "");
          const name = String(e.EventName ?? e.title ?? "");
          return sid === eventId || name === eventId || sid === String(Number(eventId));
        });

        if (!found) {
          // try looser match by name
          const foundByName = list.find((e) => {
            return String(e.EventName ?? "").toLowerCase() === String(eventId ?? "").toLowerCase();
          });
          if (mounted && foundByName) {
            setEventData(foundByName);
          } else if (mounted) {
            setFetchError("Event not found");
          }
        } else if (mounted) {
          setEventData(found);
        }
      } catch (err) {
        console.error("Error fetching event", err);
        if (mounted) setFetchError("Failed to fetch event");
      } finally {
        if (mounted) setLoadingEvent(false);
      }
    }

    loadEvent();
    return () => {
      mounted = false;
    };
  }, [eventId]);

  // helper to build image url and fallback
  const getImageUrl = (e) => {
    if (!e) return "/placeholder.png";
    const urlFromName = e.EventImageName && e.UserID
      ? `https://testing.rakshanatv.com/RakshanaAPILogs/Uploads/${e.UserID}/${e.EventImageName}`
      : null;
    return e.EventImageURL || e.EventImage || urlFromName || "/placeholder.png";
  };

  const handleNameChange = (index, value) => {
    setNames(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const validate = () => {
    const e = {};
    if (!/^\d{7,15}$/.test(mobile.replace(/\s+/g, ""))) {
      e.mobile = "Enter a valid mobile number (7-15 digits).";
    }
    if (!address || address.trim().length < 5) {
      e.address = "Enter a valid address.";
    }
    const emptyNameIndex = names.findIndex(n => !n || n.trim().length < 1);
    if (emptyNameIndex !== -1) {
      e.names = `Please enter name for ticket ${emptyNameIndex + 1}.`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProceed = () => {
    if (!validate()) {
      // scroll to top of form if there are errors
      const el = document.querySelector("#program-details-form");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Prepare payload
    const booking = {
      eventId: eventData?.SNo ?? eventData?.id ?? eventData?.EventID ?? "unknown",
      eventTitle: eventData?.EventName ?? eventData?.title ?? "Event",
      ticketCount,
      ticketPrice: eventData?.TicketPrice ?? eventData?.ticketPrice ?? 0,
      totalAmount: ticketCount * (eventData?.TicketPrice ?? eventData?.ticketPrice ?? 0),
      mobile,
      address,
      names,
    };

    // Encode booking as URL param (URI component). For more sensitive usage, use server/session.
    const encoded = encodeURIComponent(JSON.stringify(booking));
    router.push(`/payment?booking=${encoded}`);
  };

  // extracted event display properties with fallbacks
  const display = {
    title: eventData?.EventName ?? eventData?.title ?? "Asalina Prashna Sisalina Program Asalin...",
    description: eventData?.Description ?? eventData?.description ?? "",
    date: eventData?.EventDate ?? eventData?.date ?? "Jun 13 2025",
    location: eventData?.Venue ?? eventData?.location ?? "Vijayawada",
    image: getImageUrl(eventData),
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0f1115] text-white font-inter px-4 pt-24 pb-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-md hover:bg-white/5"
            aria-label="go back"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <h2 className="text-lg font-semibold">Event Booking</h2>
        </div>

        {/* If loading or error show message */}
        {loadingEvent ? (
          <div className="mb-4 text-gray-300">Loading event…</div>
        ) : fetchError ? (
          <div className="mb-4 text-red-400">{fetchError}</div>
        ) : (
          <>
            {/* Ticket Card: uses fetched display values */}
            <div className="bg-[#1c1f26] p-4 rounded-xl mb-5">
              <div className="flex gap-4 items-start">
                <img
                  src={display.image}
                  alt={display.title}
                  className="w-28 h-20 object-cover rounded-md"
                  onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                />
                <div className="flex-1">
                  <p className="font-semibold">{ticketCount} Tickets</p>
                  <p className="text-sm text-gray-400">{display.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{display.date} | {display.location}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">EACH TICKET</p>
                  <p className="text-white font-semibold text-lg">{eventData?.TicketPrice ?? eventData?.ticketPrice ?? 49}/-</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="text-sm text-gray-400">
                  <div>{display.date} | {display.location}</div>
                </div>

                {/* simple ticket increment controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTicketCount(c => Math.max(1, c - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5"
                    aria-label="decrease"
                  >
                    -
                  </button>
                  <div className="px-3 py-1 rounded-md bg-white/6">{ticketCount}</div>
                  <button
                    onClick={() => setTicketCount(c => Math.min(10, c + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5"
                    aria-label="increase"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Description card */}
            {display.description ? (
              <div className="bg-[#1c1f26] p-4 rounded-xl mb-5">
                <h3 className="text-sm text-gray-300 mb-2">About this event</h3>
                <p className="text-gray-400 text-sm">{display.description}</p>
              </div>
            ) : null}

            {/* ...existing booking form (unchanged) ... */}
            <form id="program-details-form" className="space-y-5">
              {/* Contact Section */}
              <div className="bg-[#1c1f26] p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-3">You will receive the event details here.</p>

                <label className="block mb-2 text-xs text-gray-300">Mobile number</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="Enter mobile number"
                  className={`w-full bg-[#2a2f3a] text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm outline-none ${
                    errors.mobile ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.mobile && <p className="text-xs text-red-400 mt-1">{errors.mobile}</p>}

                <label className="block mt-4 mb-2 text-xs text-gray-300">Address</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter address"
                  rows={3}
                  className={`w-full bg-[#2a2f3a] text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm outline-none resize-none ${
                    errors.address ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
              </div>

              {/* Attendee Names */}
              <div className="bg-[#1c1f26] p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-3">You will receive the event details here.</p>
                <div className="space-y-3">
                  {names.map((name, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-gray-300 w-6 text-sm">{index + 1}.</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        placeholder={`Enter name`}
                        className={`flex-1 bg-[#2a2f3a] text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm outline-none ${
                          errors.names ? "ring-2 ring-red-500" : ""
                        }`}
                      />
                    </div>
                  ))}
                </div>
                {errors.names && <p className="text-xs text-red-400 mt-2">{errors.names}</p>}
              </div>
            </form>

            {/* Footer / Summary */}
            <div className="mt-6 mb-4">
              <div className="flex justify-between px-1 text-gray-300 text-sm mb-3">
                <span>Total Amount</span>
                <span className="text-white font-semibold">{ticketCount * (eventData?.TicketPrice ?? eventData?.ticketPrice ?? 49)}/-</span>
              </div>

              <button
                onClick={handleProceed}
                className="w-full bg-[#e75d5d] hover:bg-[#f06b6b] text-white font-semibold text-base py-3 rounded-xl transition"
              >
                Proceed to Pay
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

// Redirect component for old folder structure
export function PageRedirect() {
  useEffect(() => {
    const qs = typeof window !== "undefined" ? window.location.search : "";
    // replace Book.js path with Book
    const newPath = `/EventBooking/Book${qs}`;
    // use replace to avoid extra history entry
    window.location.replace(newPath);
  }, []);

  return null;
}
