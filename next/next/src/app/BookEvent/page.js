'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BookEventPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get event details from URL parameters
    const eventId = searchParams.get('eventId');
    const eventName = searchParams.get('eventName');
    const eventImage = searchParams.get('eventImage');

    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState({
        id: eventId || '',
        title: eventName ? decodeURIComponent(eventName) : 'Event Details',
        image: eventImage ? decodeURIComponent(eventImage) : '/placeholder-event.jpg',
        date: 'December 15, 2024',
        time: '7:00 PM - 11:00 PM',
        venue: 'Grand Ballroom',
        location: '123 Event Center Drive, City'
    });

    const [formData, setFormData] = useState({
        event: eventId || '',
        fullName: '',
        email: '',
        phone: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Fetch events on component mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/Event/GetEvents');
                const data = await response.json();
                const eventsList = data?.EventsData || data?.events || [];
                setEvents(eventsList);
                
                // If we have an eventId but no events are loaded yet, try to find it
                if (eventId && eventsList.length > 0) {
                    const foundEvent = eventsList.find(e => 
                        String(e.SNo || e.id || '') === eventId
                    );
                    
                    if (foundEvent) {
                        setEvent(prev => ({
                            ...prev,
                            id: foundEvent.SNo || foundEvent.id,
                            title: foundEvent.EventName || foundEvent.title,
                            image: foundEvent.EventImageURL || foundEvent.image || prev.image,
                            date: foundEvent.EventDate || foundEvent.date || prev.date,
                            venue: foundEvent.Venue || foundEvent.location || prev.venue
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [eventId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // If event dropdown changed, update the event details
        if (name === 'event' && value) {
            const selectedEvent = events.find(e => 
                String(e.SNo || e.id) === value
            );
            
            if (selectedEvent) {
                setEvent(prev => ({
                    ...prev,
                    id: selectedEvent.SNo || selectedEvent.id,
                    title: selectedEvent.EventName || selectedEvent.title,
                    image: selectedEvent.EventImageURL || selectedEvent.image || prev.image,
                    date: selectedEvent.EventDate || selectedEvent.date || prev.date,
                    venue: selectedEvent.Venue || selectedEvent.location || prev.venue
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!formData.event) {
                alert('Please select an event');
                return;
            }

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    eventTitle: event.title,
                    eventDate: event.date,
                    eventTime: event.time,
                    eventVenue: event.venue,
                    bookingDate: new Date().toISOString()
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to booking page with the booking ID
                router.push(`/EventBooking/Book?bookingId=${data.bookingId}&eventId=${event.id}`);
            } else {
                throw new Error(data.error || 'Booking failed');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Failed to create booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Navigation Bar */}
            <nav className="w-full bg-white mt-[90px] md:mt-[100px]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col ml-6 sm:flex-row items-start sm:items-center py-4 space-y-2 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-gray-700 hover:text-gray-900 font-fustat font-semibold text-base sm:text-lg leading-[150%]"
                        >
                            Events /
                        </button>
                        <h1 className="text-xl sm:text-2xl font-fustat font-semibold text-gray-900 leading-[150%]">
                            {event.title}
                        </h1>
                    </div>
                </div>
            </nav>

            <div className="ml-14 mb-4 mt-4">
                <h1 className="text-xl sm:text-2xl font-fustat font-semibold text-gray-900 leading-[150%]">
                    {event.title}
                </h1>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Event Title - Mobile */}
                <div className="block md:hidden w-full my-4">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                        {event.title}
                    </h1>
                </div>

                {/* Hero Section with Event Image */}
                <div className="w-full max-w-6xl mx-auto">
                    <div className="relative h-[200px] sm:h-[300px] md:h-[354px] w-full rounded-lg md:rounded-[20px] overflow-hidden">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = '/placeholder-event.jpg' }}
                        />
                    </div>
                </div>

                {/* Booking Section */}
                <div className="w-full max-w-6xl mx-auto my-10 md:my-20">
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Side - Content */}
                            <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-start">
                                <h2 className="font-fustat font-bold text-3xl sm:text-4xl leading-none tracking-normal text-gray-900 mb-6">
                                    Book Event
                                </h2>
                                <div className="space-y-4">
                                    <p className="font-fustat font-light text-base sm:text-lg leading-relaxed text-gray-600">
                                        {event.description || 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.'}
                                    </p>
                                    <div className="pt-4">
                                        <h3 className="font-semibold text-lg text-gray-900">Event Details</h3>
                                        <ul className="mt-2 space-y-2 text-gray-600">
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 mr-2 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{event.date}</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 mr-2 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{event.time}</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 mr-2 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>{event.venue}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="p-4 sm:p-6 md:p-8">
                                {isSuccess ? (
                                    <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                                        Thank you for your booking! We'll get back to you soon.
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                        {/* Event Dropdown */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Select Event <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="event"
                                                value={formData.event}
                                                onChange={handleChange}
                                                className="w-full h-[50px] border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
                                                required
                                            >
                                                <option value="">Select an event</option>
                                                {events.map((eventItem) => (
                                                    <option 
                                                        key={eventItem.SNo || eventItem.id} 
                                                        value={eventItem.SNo || eventItem.id}
                                                    >
                                                        {eventItem.EventName || eventItem.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Full Name */}
                                        <div>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="w-full h-[50px] border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
                                                placeholder="Full name*"
                                                required
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full h-[50px] border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
                                                placeholder="Email*"
                                                required
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full h-[50px] border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
                                                placeholder="Phone Number*"
                                                required
                                            />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows="4"
                                                className="w-full min-h-[120px] border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white resize-none"
                                                placeholder="Message"
                                            ></textarea>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-[50px] bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-lg font-semibold text-base sm:text-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                'SEND'
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}