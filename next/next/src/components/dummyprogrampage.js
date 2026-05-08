/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const programs = [
  {
    title: "Asalina Prashna Sisalina Javabu",
    time: "Everyday",
    image: "https://storage.googleapis.com/a1aa/image/Xg4qa31xe4_h3EY3VHWfV5tuwvzdN8G8gin34XPMvW4.jpg",
  },
  {
    title: "Faith and Miracles",
    time: "Sunday Specials",
    image: "https://storage.googleapis.com/a1aa/image/Xg4qa31xe4_h3EY3VHWfV5tuwvzdN8G8gin34XPMvW4.jpg",
  },
  {
    title: "Morning Devotion",
    time: "Weekdays",
    image: "https://storage.googleapis.com/a1aa/image/Xg4qa31xe4_h3EY3VHWfV5tuwvzdN8G8gin34XPMvW4.jpg",
  },
  {
    title: "Bible Study Hour",
    time: "Wednesday Evenings",
    image: "https://storage.googleapis.com/a1aa/image/Xg4qa31xe4_h3EY3VHWfV5tuwvzdN8G8gin34XPMvW4.jpg",
  },
  ,
  {
    title: "Morning Devotion",
    time: "Weekdays",
    image: "https://storage.googleapis.com/a1aa/image/Xg4qa31xe4_h3EY3VHWfV5tuwvzdN8G8gin34XPMvW4.jpg",
  },
  {
    title: "Bible Study Hour",
    time: "Wednesday Evenings",
    image: "https://storage.googleapis.com/a1aa/image/Xg4qa31xe4_h3EY3VHWfV5tuwvzdN8G8gin34XPMvW4.jpg",
  },
];

export default function ProgramsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % programs.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + programs.length) % programs.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Programs</h1>
        <div className="flex space-x-2">
          <button
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600"
            onClick={prevSlide}
          >
            <FaArrowLeft />
          </button>
          <button
            className="w-10 h-10 bg-orange-500 rounded-full shadow-lg flex items-center justify-center text-white"
            onClick={nextSlide}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
      <p className="mt-2 text-gray-600">
        Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
      </p>
      <div className="mt-6 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {programs.map((program, index) => (
            <div key={index} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4">
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <span className="text-orange-500 text-xs uppercase">{program.time}</span>
                  <h2 className="mt-1 text-lg font-semibold text-white">{program.title}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
