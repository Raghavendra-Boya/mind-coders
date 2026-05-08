"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EventBooking = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const CACHE_KEY = 'cached_events';
    const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

    async function loadEvents() {
      try {
        // Clear cache for debugging
        localStorage.removeItem(CACHE_KEY);
        
        // Check if we have cached data that's still valid
        const cachedData = localStorage.getItem(CACHE_KEY);
        const now = new Date().getTime();
        
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (now - timestamp < CACHE_EXPIRY) {
            if (mounted) {
              setEvents(data);
              setLoading(false);
            }
            return; // Use cached data
          }
        }

        // If no valid cache, fetch fresh data
        const res = await fetch("/api/Event/GetEvents");
        const responseData = await res.json();
        
        console.log("API Response:", responseData);

        const list =
          Array.isArray(responseData?.EventsData) ? responseData.EventsData :
          Array.isArray(responseData?.events) ? responseData.events :
          Array.isArray(responseData) ? responseData :
          [];
        
        console.log("Extracted list:", list);

     const normalized = list.map((e) => {
  const urlFromName = e.EventImageName && e.UserID
    ? `https://testing.rakshanatv.com/RakshanaAPILogs/Uploads/${e.UserID}/${e.EventImageName}`
    : null;
    
  return {
    id: e.SNo || e.id || e.EventID || e.EventName || "",
    title: e.EventName || e.title || e.Name || e.name || e.Title || "",
    description: e.Description || "No description available",
    image: e.EventImageURL || e.EventImage || e.image || e.Image || urlFromName || "/placeholder.png",
    venue: e.Venue || "",
    date: e.EventDate || "",
    time: e.EventTime || "",
    price: e.TicketPrice || "0",
    quantity: e.TicketQuantity || "0"
  };
});

console.log("Normalized events:", normalized);

        // Update cache with new data
        const cacheData = {
          data: normalized,
          timestamp: now
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

        if (mounted) setEvents(normalized);
      } catch (err) {
        console.error("Failed to load events", err);
        // If there's an error, try to use cached data if available
        try {
          const cachedData = localStorage.getItem(CACHE_KEY);
          if (cachedData && mounted) {
            const { data } = JSON.parse(cachedData);
            setEvents(data);
          } else if (mounted) {
            setEvents([]);
          }
        } catch (cacheErr) {
          console.error("Error reading from cache:", cacheErr);
          if (mounted) setEvents([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadEvents();
    return () => {
      mounted = false;
    };
  }, []);

  // navigate to booking page for a specific event id
 // Update the handleBookNow function in your EventBooking component
const handleBookNow = (event) => {
  if (!event?.id) {
    router.push("/BookEvent"); // Fallback to general booking page
    return;
  }
  // Pass event details in the query string
  const params = new URLSearchParams({
    eventId: event.id,
    eventName: encodeURIComponent(event.title || ''),
    eventImage: encodeURIComponent(event.image || ''),
    eventDate: event.date ? encodeURIComponent(event.date) : '',
    eventVenue: event.venue ? encodeURIComponent(event.venue) : '',
    eventTime: event.time ? encodeURIComponent(event.time) : ''
  });
  router.push(`/BookEvent?${params.toString()}`);
};

  return (
    <>
      <Navbar />
      <section className="w-full py-16 px-5 md:px-20 bg-white mt-24">
<h2 
  className="mb-10 text-gray-900"
  style={{
    fontFamily: 'Fustat',
    fontWeight: 700,
    fontStyle: 'Bold',
    fontSize: '60px',
    lineHeight: '150%',
    letterSpacing: '0%'
  }}
>
  Events
</h2>
        {loading ? (
          <p className="text-gray-600">Loading events…</p>
        ) : !events || events.length === 0 ? (
          <p className="text-gray-600">No events available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 justify-items-center" style={{ rowGap: '32px' }}>
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-xl overflow-hidden w-full max-w-[380px] h-[420px] flex flex-col"
                style={{
                  width: '360px',
                  height: '420px',
                  borderRadius: '12px',
                  opacity: 1,
                }}
              >
                {/* Image with fixed dimensions */}
                <div 
                  className="w-full overflow-hidden"
                  style={{
                    width: '380px',
                    height: '215px',
                    borderRadius: '12px',
                    opacity: 1,
                  }}
                >
                  <img
                    src={event.image}
                    alt={event.title || "Event Thumbnail"}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                  />
                </div>
                <div 
                  className="flex flex-col justify-between flex-1 h-full"
                  style={{
                    padding: '30px 20px 20px',
                    gap: '10px',
                    opacity: 1,
                  }}
                >
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{event.title}</h4>
                    <p className="text-gray-600 text-sm md:text-base mb-5 line-clamp-2">{event.description}</p>
                    
                  </div>
                  <button
                    onClick={() => handleBookNow(event)}
                    className="w-full py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:opacity-90 transition"
                  >
                    Book Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default EventBooking;