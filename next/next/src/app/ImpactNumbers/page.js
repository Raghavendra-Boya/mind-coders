import React from "react";

export default function ImpactNumbers() {
  return (
    <div className="bg-gray-900 text-white font-inter min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="text-left w-full max-w-4xl mb-8">
        <h1 className="text-4xl font-bold mb-4">Our Impact in Numbers</h1>
        <p className="text-gray-400">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit
          officia consequat duis enim velit mollit.
        </p>
      </div>
      <div className="bg-gray-800 rounded-lg py-8 px-4 md:px-16 flex flex-col md:flex-row justify-around items-center mb-8 w-full max-w-4xl">
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <p className="text-4xl font-bold">149K</p>
          <p className="text-gray-400">Subscribers</p>
        </div>
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <p className="text-4xl font-bold">300+</p>
          <p className="text-gray-400">Conferences</p>
        </div>
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <p className="text-4xl font-bold">3,500</p>
          <p className="text-gray-400">Videos</p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-4xl font-bold">5L+</p>
          <p className="text-gray-400">Attendees</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
        <button className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-orange-600 transition duration-300">
          Broadcast slot booking
        </button>
        <button className="bg-gray-700 text-white py-2 px-6 rounded-full hover:bg-gray-600 transition duration-300">
          Prayer request Booking
        </button>
      </div>
    </div>
  );
}
