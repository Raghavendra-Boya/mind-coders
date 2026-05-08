"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingDetails({ event }) {
    const router = useRouter();

    const [ticketCount, setTicketCount] = useState(3);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [attendees, setAttendees] = useState([]);

    const totalAmount = ticketCount * event.price;

    useEffect(() => {
        setAttendees(Array(ticketCount).fill(""));
    }, [ticketCount]);

    const updateAttendee = (index, value) => {
        const updated = [...attendees];
        updated[index] = value;
        setAttendees(updated);
    };

    const handleConfirm = () => {
        const data = {
            event,
            ticketCount,
            firstName,
            lastName,
            address,
            attendees,
            totalAmount,
        };

        sessionStorage.setItem("bookingData", JSON.stringify(data));
        router.push("/PaymentSelect");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center pb-32 mt-10">
            <div className="w-full max-w-[1200px] px-4 mt-24">

                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 mb-6 text-sm">
                    <button
                        onClick={() => router.back()}
                        className="font-semibold text-gray-600 hover:text-gray-900"
                    >
                        Events
                    </button>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-700">{event.title}</span>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

                    {/* LEFT COLUMN */}
                    <div className="space-y-6">

                        {/* EVENT CARD */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {event.title}
                                    </h2>
                                    <div className="flex items-center text-gray-600 text-sm space-x-4">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(event.date).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {event.venue}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Each Ticket</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        ₹{event.price}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                                <span className="text-sm text-gray-600">Select Tickets</span>
                                <div className="flex items-center border border-gray-300 rounded-full px-2 h-10">
                                    <button
                                        onClick={() => setTicketCount((p) => Math.max(1, p - 1))}
                                        className="w-8 h-8 text-gray-600 hover:bg-gray-100 rounded-full flex items-center justify-center"
                                    >
                                        –
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium">
                                        {ticketCount}
                                    </span>
                                    <button
                                        onClick={() => setTicketCount((p) => p + 1)}
                                        className="w-8 h-8 text-gray-600 hover:bg-gray-100 rounded-full flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CONTACT DETAILS */}
                        <div className="bg-white rounded-2xl border p-6">
                            <p className="text-sm text-gray-500 mb-4">
                                You will receive the event details from here.
                            </p>

                            <div className="space-y-4">
                                <input
                                    placeholder="First Name *"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    style={{
                                        width: '742px',
                                        height: '50px',
                                        borderRadius: '8px',
                                        padding: '12px 20px',
                                        border: '1px solid #E5E7EB',
                                        backgroundColor: '#F3F4F6',
                                        outline: 'none'
                                    }}
                                    className=" focus:border-transparent"
                                />
                                <input
                                    placeholder="Last Name *"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    style={{
                                        width: '742px',
                                        height: '50px',
                                        borderRadius: '8px',
                                        padding: '12px 20px',
                                        border: '1px solid #E5E7EB',
                                        backgroundColor: '#F3F4F6',
                                        outline: 'none'
                                    }}
                                    className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* PERSON NAMES */}
                        <div className="bg-white rounded-2xl border p-6">
                            <p className="text-sm text-gray-500 mb-4">Person Names</p>

                            <div className="space-y-3">
                                {attendees.map((name, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-gray-700">{i + 1}.</span>
                                        <input
                                            placeholder="Enter Name *"
                                            value={name}
                                            onChange={(e) => updateAttendee(i, e.target.value)}
                                            className="flex-1 bg-gray-100 p-3 rounded-lg border"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN — CHECKOUT */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">

                        <h3 className="text-xl font-bold mb-6">Checkout</h3>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Sub Total</span>
                                <span className="font-medium text-gray-900">
                                    ₹{totalAmount}
                                </span>
                            </div>

                            <div className="flex justify-between text-gray-600">
                                <span>Booking Fee</span>
                                <span className="font-medium text-gray-900">₹0</span>
                            </div>

                            <hr />

                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total Price</span>
                                <span>₹{totalAmount}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirm}
                            className="mt-8 w-full py-3 rounded-full text-white font-semibold
              bg-gradient-to-r from-[#A184F6] to-[#AA4249]
              hover:opacity-90 transition"
                        >
                            Proceed to Pay →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
