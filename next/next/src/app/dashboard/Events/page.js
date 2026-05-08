"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Bell, ChevronDown } from "lucide-react";
import HeaderBar from "@/components/HeaderBar";
import EventTable from "@/components/EventTable";
import CreateEventModal from "@/components/Modal/CreateEventModal";
import { fetchEvents } from "@/store/slices/eventSlice";
import { useLocalState } from "@/hooks/useLocalState";

export default function EventPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.event);

  // Local state with persistence
  const [query, setQuery] = useLocalState('events_query', '');
  const [page, setPage] = useLocalState('events_page', 1);
  const [itemsPerPage, setItemsPerPage] = useLocalState('events_itemsPerPage', 10);
  const [cachedEvents, setCachedEvents] = useLocalState('cached_events', []);
  
  // UI state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // for editing
  const [userName, setUserName] = useState("Guest");
  const [isOpen, setIsOpen] = useState(false);

  // Fetch events with caching
  useEffect(() => {
    const loadEvents = async () => {
      try {
        // Only fetch if we don't have cached data
        if (!cachedEvents || cachedEvents.length === 0) {
          const action = await dispatch(fetchEvents());
          if (action.payload) {
            setCachedEvents(action.payload);
          }
        }
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };
    
    loadEvents();
  }, [dispatch, cachedEvents?.length, setCachedEvents]);

  // Load stored user for top bar
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) setUserName(storedUser.name);
  }, []);

  // Filter events with cache fallback
  const filtered = useMemo(() => {
    const source = Array.isArray(cachedEvents) && cachedEvents.length > 0 
      ? cachedEvents 
      : Array.isArray(events) ? events : [];
      
    return source.filter((e) =>
      (e.EventName || "")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [cachedEvents, events, query]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const start = (page - 1) * itemsPerPage;
  const paged = filtered.slice(start, start + itemsPerPage);

  // Handle row edit with cache update
  const handleEditEvent = useCallback((event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  }, []);
  
  // Handle successful event creation/update
  const handleEventSaved = useCallback((newEvent) => {
    setCachedEvents(prev => {
      if (!newEvent) return prev;
      
      // If editing existing event
      if (selectedEvent) {
        return prev.map(e => e.id === newEvent.id ? newEvent : e);
      }
      
      // If new event
      return [newEvent, ...prev];
    });
    
    setModalOpen(false);
    setSelectedEvent(null);
  }, [selectedEvent, setCachedEvents]);

  return (
    <div className="min-h-screen flex flex-col text-[#0b132b] bg-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Events</h2>

        <div className="flex items-center gap-6 relative">
          <button
            onClick={() => router.push("/dashboard/notifications")}
            className="relative text-gray-600 hover:text-gray-900"
          >
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt="Profile"
              className="w-8 h-8 rounded-full border"
            />
            <span className="text-sm font-medium text-gray-800">{userName}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
          </div>

          {isOpen && (
            <div className="absolute right-0 top-12 w-40 bg-white border rounded shadow-md z-50">
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  router.push("/login");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div />
          <HeaderBar
            title=""
            query={query}
            setQuery={(val) => {
              setQuery(val);
              setPage(1);
            }}
            showSearch={true}
            showFilter={true}
            showCreate={true}
            createLabel="Add Event"
            showProfile={false}
            showNotifications={false}
            onCreate={() => {
              setSelectedEvent(null); // reset for create
              setModalOpen(true);
            }}
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Loading events...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">No events found.</p>
        ) : (
          <EventTable
            data={paged}
            filtered={filtered}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            start={start}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            onEditEvent={handleEditEvent}
          />
        )}
      </main>

      {modalOpen && (
        <CreateEventModal
          onClose={() => setModalOpen(false)}
          event={selectedEvent} // pre-fill if editing
        />
      )}
    </div>
  );
}
