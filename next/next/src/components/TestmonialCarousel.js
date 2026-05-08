"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/slices/categorySlice";
import { fetchTestimonials } from "@/store/slices/TestimonialSlice";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeArrow, setActiveArrow] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState({
    name: "What viewers are saying",
    description: "Loading testimonials..."
  });

  const dispatch = useDispatch();
  const { items: categories = [] } = useSelector((state) => state.category || {});
  const { items: apiTestimonials = [], loading } = useSelector((state) => state.testimonials || {});

  // Use only API testimonials
  const testimonials = (apiTestimonials || []).map(t => ({
    id: t.SNo,
    text: t.TestimonialText,
    author: t.TestimonialName,
    image: t.PersonImageURL
  }));

  // Load data from localStorage on mount
  useEffect(() => {
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

    // Load testimonials from cache or fetch fresh
    const loadTestimonials = async () => {
      try {
        const savedTestimonials = typeof window !== 'undefined' ? localStorage.getItem('cachedTestimonials') : null;
        const savedTimestamp = typeof window !== 'undefined' ? localStorage.getItem('testimonialsTimestamp') : null;

        if (savedTestimonials && savedTimestamp && (Date.now() - parseInt(savedTimestamp) < oneHour)) {
          const parsedTestimonials = JSON.parse(savedTestimonials);
          if (Array.isArray(parsedTestimonials)) {
            dispatch({ type: 'testimonials/fetchTestimonials/fulfilled', payload: parsedTestimonials });
            return; // Skip API call if we have fresh cache
          }
        }

        // If no cache or cache is stale, fetch fresh data
        const action = await dispatch(fetchTestimonials());
        if (action.payload) {
          localStorage.setItem('cachedTestimonials', JSON.stringify(action.payload));
          localStorage.setItem('testimonialsTimestamp', Date.now().toString());
        }
      } catch (error) {
        console.error('Error loading testimonials:', error);
      }
    };

    // Load categories from cache or fetch fresh
    const loadCategories = async () => {
      try {
        const savedCategories = typeof window !== 'undefined' ? localStorage.getItem('cachedTestimonialCategories') : null;
        const savedTimestamp = typeof window !== 'undefined' ? localStorage.getItem('testimonialCategoriesTimestamp') : null;

        if (savedCategories && savedTimestamp && (Date.now() - parseInt(savedTimestamp) < oneHour)) {
          const parsedCategories = JSON.parse(savedCategories);
          if (Array.isArray(parsedCategories)) {
            dispatch({ type: 'category/fetchCategories/fulfilled', payload: parsedCategories });
            return; // Skip API call if we have fresh cache
          }
        }

        // If no cache or cache is stale, fetch fresh data
        const action = await dispatch(fetchCategories());
        if (action.payload) {
          localStorage.setItem('cachedTestimonialCategories', JSON.stringify(action.payload));
          localStorage.setItem('testimonialCategoriesTimestamp', Date.now().toString());
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    // Load both data sources in parallel
    loadTestimonials();
    loadCategories();
  }, [dispatch]);

  // Update category details when categories are loaded
  useEffect(() => {
    if (categories && categories.length > 0) {
      const testimonialCategory = categories.find(cat => {
        const catName = (cat?.categoryName || cat?.CategoryName || '').toLowerCase();
        return catName === 'testmonials' || catName === 'testimonials';
      });

      if (testimonialCategory) {
        setCategoryDetails({
          name: testimonialCategory.CategoryName || testimonialCategory.categoryName || "What viewers are saying",
          description: testimonialCategory.Description || testimonialCategory.description ||
            "Hear what our viewers have to say about us."
        });
      }
    }
  }, [categories]);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % testimonials.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  if (loading || testimonials.length === 0) {
    return (
      <div className="w-full py-24 text-center">
        <p>Loading testimonials...</p>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen mx-auto overflow-hidden relative
      bg-cover bg-center bg-no-repeat
      px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      style={{ backgroundImage: 'url(/asset/tesimonial.png)' }}
    >

      <blockquote className="absolute text-9xl text-gray-200 right-48 top-12 w-80 h-80 flex items-center justify-center opacity-50 transition-opacity duration-500">
        ❝
      </blockquote>

      <div className="">
        <div className="flex items-center justify-between mb-12 max-w-5xl mx-auto ">
          <div>
            <h2 className="font-['Fustat'] font-bold text-4xl leading-[140%] tracking-normal text-gray-800 dark:text-white">
              {categoryDetails.name}
            </h2>
            <p className="font-['Fustat'] font-normal text-xl leading-[100%] tracking-normal text-gray-600 dark:text-gray-300">
              {categoryDetails.description}
            </p>
          </div>

          {testimonials.length > 0 && (
            <div className="flex justify-center gap-6 relative z-10 mt-10">

              {/* PREVIOUS */}
              <button
                onClick={() => {
                  setCurrentIndex(prev =>
                    prev === 0 ? testimonials.length - 1 : prev - 1
                  );
                  setActiveArrow("prev");
                }}
                className={`w-[50px] h-[50px] rounded-full
      border-4 bg-white flex items-center justify-center transition
      ${activeArrow === "prev"
                    ? "border-purple-500"
                    : "border-gray-300"
                  }`}
              >
                <FiArrowLeft
                  size={26}
                  className={
                    activeArrow === "prev"
                      ? "text-purple-500"
                      : "text-gray-400"
                  }
                />
              </button>

              {/* NEXT */}
              <button
                onClick={() => {
                  setCurrentIndex(prev => (prev + 1) % testimonials.length);
                  setActiveArrow("next");
                }}
                className={`w-[50px] h-[50px] rounded-full
      p-[4px] transition
      ${activeArrow === "next"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "border-4 border-gray-300 bg-white"
                  }`}
              >
                <div className="w-full h-full rounded-full flex items-center justify-center bg-white">
                  <FiArrowRight
                    size={26}
                    className={
                      activeArrow === "next"
                        ? "text-purple-500"
                        : "text-gray-400"
                    }
                  />
                </div>
              </button>

            </div>

          )}
        </div>

        <div
          className="flex gap-4 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 30}%)`,
            minWidth: "220%",
          }}
        >
          {testimonials.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={`
                p-12 flex flex-col gap-4 
                bg-white dark:bg-gray-800 
                shadow-lg transition-all duration-500
               ${index === currentIndex
                  ? "border-2 border-[#AD3B42] border-opacity-30 scale-105 shadow-xl"
                  : "border-2 border-gray-300 dark:border-gray-600 scale-95"
                }
              `}
              style={{ minWidth: "33.33%" }}
            >
              <p className="text-red-500 dark:text-red-400 text-6xl">❝</p>
              <p className="font-['Fustat'] font-normal text-[32px] leading-[100%] tracking-normal text-gray-800 dark:text-white">
                {item.text}
              </p>
              <div className="flex items-center mt-4">
                <Image
                  src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.author || 'User')}&background=random`}
                  alt={item.author || 'User'}
                  width={50}
                  height={50}
                  className="rounded-full"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.author || 'User')}&background=random`;
                  }}
                  unoptimized={process.env.NODE_ENV !== 'production'} // Add this line for external images in development
                />
                <p className="ml-2 font-['Fustat'] font-semibold text-[20px] leading-[100%] tracking-normal text-gray-700 dark:text-gray-200">
                  {item.author || 'Anonymous'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;