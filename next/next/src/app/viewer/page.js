"use client"
import { useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaQuoteLeft } from 'react-icons/fa';

const ViewersPage = () => {
  const testimonials = [
    {
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.",
      name: "Brooklyn Simmons",
      image: "https://storage.googleapis.com/a1aa/image/L1zP0n6thP3Zkze6IVjrjLRSNVPfoqvqeVdx7YVE-Wc.jpg"
    },
    {
      text: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      name: "John Doe",
      image: "https://randomuser.me/api/portraits/men/50.jpg"
    },
    {
      text: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      name: "Jane Smith",
      image: "https://randomuser.me/api/portraits/women/50.jpg"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const updateTestimonial = (direction) => {
    setCurrentTestimonial((prevIndex) => (prevIndex + direction + testimonials.length) % testimonials.length);
  };

  return (
    <div className="font-roboto bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <img alt="A cup of coffee on a beige background" className="w-full h-24 object-cover" src="https://storage.googleapis.com/a1aa/image/4AJcb7C_iTWOiGqvKYpyWbD0x4NX9pW1XWQu3VE5FL8.jpg" />
          </div>
          <div>
            <img alt="A green leaf in a glass vase" className="w-full h-24 object-cover" src="https://storage.googleapis.com/a1aa/image/3CK1og7jJWHw4Wh7r5q17SCmBREYrzsdF-bzF9HwqaY.jpg" />
          </div>
          <div>
            <img alt="A cup of coffee and a keyboard on a white background" className="w-full h-24 object-cover" src="https://storage.googleapis.com/a1aa/image/3yo3mnQGE2BBcAKt7sAjrxKZ5FQbKKzBe_1aFZd9U20.jpg" />
          </div>
          <div>
            <img alt="A hanging lamp on a teal background" className="w-full h-24 object-cover" src="https://storage.googleapis.com/a1aa/image/9wSn0oQ4y-oGYHcto7NddrSa8PU0z-v4qQLZI4eic0g.jpg" />
          </div>
          <div>
            <img alt="Flowers on a white background" className="w-full h-24 object-cover" src="https://storage.googleapis.com/a1aa/image/UY-e8b5VJDQIJgo1fWLucc0dR6hvzzG3gYVCulLOsQ0.jpg" />
          </div>
          <div>
            <img alt="A green plant on a white background" className="w-full h-24 object-cover" src="https://storage.googleapis.com/a1aa/image/UQECU5suGsEOlAsQPsoTirsgaspJgP3FFwRd02xdMag.jpg" />
          </div>
          <div>
            <img alt="Green leaves on a dark background" className="w-full h-24 object-cover" src="https://storage.googleapis.com/a1aa/image/8jJKaIZNDRDvFLWJhD_0X2cXSk7mnWVloBHvEIHU6VI.jpg" />
          </div>
          <div>
            <img alt="A white cup on a white background" className="w-full h-24 object-cover" src="https://storage.googleapis.com/a1aa/image/0E6zL_W4Gw-9UDasAIHlRHR_leRMRbyhxVlOHkRTkaU.jpg" />
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-12">
          <div className="mt-12 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                What viewers are saying
              </h2>
              <p className="text-gray-500">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry
              </p>
            </div>

            <div className="ml-auto flex items-center">
              <button onClick={() => updateTestimonial(-1)} className="bg-white p-2 rounded-full shadow-md">
                <FaArrowLeft className="text-gray-500" />
              </button>
              <button onClick={() => updateTestimonial(1)} className="bg-white p-2 rounded-full shadow-md ml-2">
                <FaArrowRight className="text-purple-500" />
              </button>
            </div>
          </div>

          {/* Testimonials and navigation buttons */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex-1">
              <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center mb-4">
                  <FaQuoteLeft className="text-orange-500 text-2xl" />
                </div>
                <p className="text-gray-700 text-lg">{testimonials[currentTestimonial].text}</p>
                <div className="flex items-center mt-4">
                  <img
                    alt="Profile picture"
                    className="w-10 h-10 rounded-full"
                    src={testimonials[currentTestimonial].image}
                  />
                  <span className="ml-2 text-gray-700">{testimonials[currentTestimonial].name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewersPage;
