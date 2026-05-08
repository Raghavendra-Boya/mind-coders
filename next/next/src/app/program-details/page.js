"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProgramDetails() {
  const [ticketCount, setTicketCount] = useState(0);
  const ticketPrice = 49;
const router = useRouter();
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10">
        {/* Centered Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6 mt-10">

          {/* Event Image */}
          <div className="w-full rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://storage.googleapis.com/a1aa/image/Xg4qa31xe4_h3EY3VHWfV5tuwvzdN8G8gin34XPMvW4.jpg"
              alt="Event"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title and Date */}
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-4">
              Asalina Prashna Sisalina Program Asalina Prashna
            </h1>
            <p className="text-gray-600 mt-2 md:text-lg">
              Jun 13 2025 | Vijayawada
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            Lorem Ipsum placeholder text for use in your graphic, print and web layouts, 
            and discover plugins for your favorite writing, design and blogging tools. 
            Explore the origins, history and meaning of the famous passage, and learn how 
            Lorem Ipsum
          </p>

          {/* Ticket Section */}
          <div className="bg-gray-800 p-5 rounded-2xl shadow-inner text-white">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Choose Tickets</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Each Ticket</p>
                <p className="text-lg md:text-xl font-bold">{ticketPrice}/-</p>
              </div>

              {/* Counter */}
              {ticketCount > 0 && (
                <div className="flex items-center bg-gray-700 px-4 py-2 rounded-full gap-4">
                  <button
                    onClick={() => setTicketCount(ticketCount - 1)}
                    className="text-2xl font-bold hover:text-red-600 transition"
                  >
                    -
                  </button>
                  <span className="text-lg md:text-xl">{ticketCount}</span>
                  <button
                    onClick={() => setTicketCount(ticketCount + 1)}
                    className="text-2xl font-bold hover:text-red-600 transition"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Always show Add button */}
              <button
                onClick={() => setTicketCount(ticketCount + 1)}
                className="bg-red-600 hover:bg-red-700 transition text-white px-6 py-2 rounded-full font-medium"
              >
                Add
              </button>
            </div>

           {/* Total Amount */}
  <div className="flex justify-between items-center mt-12">
    <p className="text-gray-400 font-medium">Total Amount</p>
    <p className="text-lg md:text-xl font-bold">{ticketCount * ticketPrice}/-</p>
  </div>

  <button
      onClick={() => router.push("/EventBooking/Book")}
      disabled={ticketCount === 0}
      className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded-lg font-semibold text-lg md:text-xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Proceed
    </button>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
