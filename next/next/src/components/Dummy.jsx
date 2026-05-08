"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.",
    author: "Brooklyn Simmons",
    image: "https://storage.googleapis.com/a1aa/image/jdud7PeGRRgPI0MmTRpscggyHFsZKLviR_NEWLLAMJs.jpg",
  },
  {
    id: 2,
    text: "This platform has been amazing for learning and development. Highly recommend to anyone looking for quality content!",
    author: "Emily Johnson",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    text: "Fantastic experience! The courses are well-structured and easy to follow. I learned a lot in a short time.",
    author: "James Anderson",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full mx-auto py-10 overflow-hidden relative bg-gradient-to-r from-blue-50 via-white to-purple-50 -top-2/4">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">What viewers are saying</h2>
          <p className="text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow-md hover:border-blue-500 transition"
          >
            <ArrowLeft size={24} className="text-gray-600 hover:text-blue-500" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow-md hover:border-blue-500 transition"
          >
            <ArrowRight size={24} className="text-gray-600 hover:text-blue-500" />
          </button>
        </div>
      </div>

      {/* Testimonials Container */}
      <div className="flex gap-4 transition-transform duration-500 ease-in-out transform"
        style={{
          transform: `translateX(-${currentIndex * 30}%)`, // Adjusted to fit 200% width
          minWidth: "200%", // Total width of the container
          paddingLeft: "10px", // Padding to ensure left border visibility
        }}>
        {testimonials.map((item, index) => (
          <div
            key={item.id}
            className={`p-8 shadow-lg flex flex-col gap-4 bg-white rounded-lg transition-all duration-500 
            ${index === currentIndex ? "border-2 border-blue-500 scale-105 shadow-xl" : "border-2 border-gray-400 scale-95"}`}
            style={{ minWidth: "40%" }} // Each testimonial takes up 40% of the container width
          >
            <p className="text-red-500 text-6xl">❝</p>
            <p className="text-gray-800 text-xl">{item.text}</p>
            <div className="flex items-center mt-4">
              <Image src={item.image} alt={item.author} width={50} height={50} className="rounded-full" />
              <p className="text-gray-700 ml-2 font-semibold">{item.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
