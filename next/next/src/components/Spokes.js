'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchSpeakers } from '@/store/slices/SpeakerSlice';
import { fetchCategories } from '@/store/slices/categorySlice';
import Navbar from './Navbar';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const SpokesPerson = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(2);
  const [activeArrow, setActiveArrow] = useState(null);
  // "prev" | "next" | null

  const [categoryDetails, setCategoryDetails] = useState({
    CategoryName: '',
    Description: ''
  });

  const dispatch = useDispatch();
  const { speakers, loading, error } = useSelector((state) => state.speaker);
  const categories = useSelector((state) => {
    console.log('Full Redux state:', state);
    return state.category?.items || [];
  });

  // Debug log for speakers data
  useEffect(() => {
    console.log('Speakers data in SpokesPerson:', speakers?.map(s => ({
      name: s.name,
      id: s.id,
      image: s.image,
      designation: s.designation
    })));
  }, [speakers]);

  // Load data from localStorage on mount
  useEffect(() => {
    console.log('Loading data...');

    // Try to load speakers from localStorage first
    const savedSpeakers = typeof window !== 'undefined' ? localStorage.getItem('cachedSpeakers') : null;
    const savedSpeakersTimestamp = typeof window !== 'undefined' ? localStorage.getItem('speakersTimestamp') : null;
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

    // If we have cached data that's less than 1 hour old, use it
    if (savedSpeakers && savedSpeakersTimestamp && (Date.now() - parseInt(savedSpeakersTimestamp) < oneHour)) {
      try {
        const parsedSpeakers = JSON.parse(savedSpeakers);
        if (Array.isArray(parsedSpeakers)) {
          // Dispatch an action to update the store with cached data
          dispatch({ type: 'speaker/fetchSpeakers/fulfilled', payload: parsedSpeakers });
        }
      } catch (e) {
        console.error('Error parsing cached speakers:', e);
      }
    } else {
      // If no cache or cache is stale, fetch fresh data
      dispatch(fetchSpeakers())
        .then((action) => {
          // Save to localStorage on successful fetch
          if (action.payload) {
            localStorage.setItem('cachedSpeakers', JSON.stringify(action.payload));
            localStorage.setItem('speakersTimestamp', Date.now().toString());
          }
        });
    }

    // Load categories with similar caching
    const savedCategories = typeof window !== 'undefined' ? localStorage.getItem('cachedCategories') : null;
    const savedCategoriesTimestamp = typeof window !== 'undefined' ? localStorage.getItem('categoriesTimestamp') : null;

    if (savedCategories && savedCategoriesTimestamp && (Date.now() - parseInt(savedCategoriesTimestamp) < oneHour)) {
      try {
        const parsedCategories = JSON.parse(savedCategories);
        if (Array.isArray(parsedCategories)) {
          dispatch({ type: 'category/fetchCategories/fulfilled', payload: parsedCategories });
        }
      } catch (e) {
        console.error('Error parsing cached categories:', e);
      }
    } else {
      dispatch(fetchCategories())
        .then((action) => {
          if (action.payload) {
            localStorage.setItem('cachedCategories', JSON.stringify(action.payload));
            localStorage.setItem('categoriesTimestamp', Date.now().toString());
          }
        });
    }
  }, [dispatch]);

  // 2. Update the useEffect to handle the data correctly
  useEffect(() => {
    console.log('Categories from Redux:', categories);

    if (Array.isArray(categories) && categories.length > 0) {
      // Try both property name variations
      const spokesCategory = categories.find(cat => {
        const catName = cat?.categoryName || cat?.CategoryName;
        return catName?.toLowerCase() === 'spokes person';
      });

      console.log('Found Spokes Category:', spokesCategory);

      if (spokesCategory) {
        // Use both possible property name variations
        setCategoryDetails({
          CategoryName: spokesCategory.CategoryName || spokesCategory.categoryName || 'Spokes Person',
          Description: spokesCategory.Description || spokesCategory.description || ''
        });
      } else {
        console.log('No matching category found. Available categories:', categories);
      }
    } else {
      console.log('No matching category found in:', categories);
    }
  }, [categories]);
  const getVisibleCards = () => {
    if (!speakers || speakers.length === 0) return [];

    const cards = [];
    const total = speakers.length;
    const cardSpacing = 120;
    const leftOffset = -200;
    const activeWidth = 400;
    const middleWidth = 500;
    const endCardWidth = 500;

    const secondCardIndex = (activeIndex + 1 + total) % total;
    const secondCardImage = speakers[secondCardIndex]?.image;

    for (let i = -2; i <= 2; i++) {
      const index = (activeIndex + i + total) % total;
      let width, height;

      if (i === 0) {
        width = activeWidth;
        height = 450;
      } else if (Math.abs(i) === 1) {
        width = middleWidth;
        height = 500;
      } else {
        width = endCardWidth;
        height = 450;
      }

      const speaker = speakers[index];
      if (!speaker) return null;

      // Helper function to ensure the image URL is valid
      const getValidImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/400x600';
        // If it's already a full URL, return as is
        if (url.startsWith('http') || url.startsWith('https') || url.startsWith('data:')) {
          return url;
        }
        // If it's a relative path, make sure it starts with a slash
        if (url.startsWith('/')) {
          return url;
        }
        // Otherwise, assume it's a path that should be relative to the public directory
        return `/${url}`;
      };

      cards.push({
        name: speaker.Name || speaker.name || 'SPEAKER',
        imgSrc: getValidImageUrl(speaker.ImageURL || speaker.ImageName || speaker.image),
        position: i,
        isActive: i === 0,
        translateX: i * cardSpacing + leftOffset,
        width: width,
        height: height,
        secondCardImage: i === 2 ? getValidImageUrl(secondCardImage) : null,
        speakerData: speaker // Include the full speaker data
      });
    }
    return cards;
  };

  const nextSlide = () => {
    if (!speakers || speakers.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % speakers.length);
  };

  const prevSlide = () => {
    if (!speakers || speakers.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + speakers.length) % speakers.length);
  };

  // Auto-rotate slides
  useEffect(() => {
    if (speakers && speakers.length > 0) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [speakers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading speakers: {error}
      </div>
    );
  }

  const visibleCards = getVisibleCards();

  return (
    <div className="flex flex-col items-center justify-center p-10 relative overflow-hidden w-full min-h-screen" style={{
      backgroundColor: '#F7FBFFCC',
      opacity: 1
    }}>
      {/* Background Image */}
      <div className="absolute z-0" style={{
        width: '710px',
        // height: '710px',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: 1,
        overflow: 'hidden'
      }}>
        <img
          src="/asset/Spokebground.png"
          alt="Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'rotate(0deg)'
          }}
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
      {/* Heading */}
      <div className="w-full max-w-6xl mx-auto pt-12 pb-6 z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="
  mb-2 
  text-left 
  dark:text-white 
  font-['Fustat'] 
  font-extrabold 
  text-3xl 
  sm:text-4xl 
  md:text-5xl 
  leading-none 
  tracking-normal 
  w-full 
  max-w-[908px] 
  h-[50px] 
  opacity-100"
            >
              {categoryDetails.CategoryName}
            </h2>
            <p
              className="
    text-gray-500 
    dark:text-gray-300 
    text-left 
    w-[908px] 
    h-[72px] 
    opacity-100 
    font-['Fustat'] 
    font-light 
    text-xl 
    leading-[150%] 
    tracking-normal
  "
              style={{
                fontFeatureSettings: "'liga' off, 'calt' off"
              }}
            >
              {categoryDetails.Description}
            </p>
          </div>
          <Link
            href="/spokespersons"
            className="group flex items-center justify-center"
            style={{
              width: '116px',
              height: '48px',

              borderRadius: '60px',
              border: '1px solid transparent',
              background: 'linear-gradient(90deg, #A184F6 0%, #AA4249 100%)',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }
            }}
          >
            <span style={{
              fontFamily: 'Fustat',
              fontWeight: 700,
              fontSize: '14px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#FFFFFF',
              marginRight: '8px',
              whiteSpace: 'nowrap'
            }}>See all</span>
            <Image
              src="/asset/donateArrow.png"
              alt="→"
              width={18}
              height={18}
              style={{
                filter: 'brightness(0) invert(1)',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            />
          </Link>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full max-w-6xl h-[600px] z-10">
        {/* Carousel Content */}
        <div className="absolute inset-0 mb-[150px] ml-[370px] flex items-center">
          <div className="relative w-full h-[500px]">
            {visibleCards.map((person, index) => {
              if (!person) return null;

              const scale = person.isActive ? 1 : 0.7;
              const opacity = person.isActive ? 1 : 0.8;
              const zIndex = person.isActive ? 10 : 5 - Math.abs(person.position);

              return (
                <div
                  key={`${person.name}-${index}`}
                  className="absolute transition-all duration-500 ease-in-out rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                  style={{
                    width: `${person.width}px`,
                    height: `${person.height}px`,
                    left: `calc(50% + ${person.translateX}px)`,
                    top: person.position === 0 ? '50%' : Math.abs(person.position) === 2 ? '52%' : '51%',
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    zIndex,
                    opacity,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const speaker = person.speakerData;

                    // Check if speaker exists and has properties
                    if (!speaker || Object.keys(speaker).length === 0) {
                      console.error('No valid speaker data available', speaker);
                      return;
                    }

                    // Try multiple possible ID fields
                    const speakerId = speaker.SNo?.toString().trim() ||
                      speaker.id?.toString().trim() ||
                      speaker.UserID?.toString().trim();

                    if (!speakerId) {
                      console.error('No valid ID found for speaker:', speaker);
                      return;
                    }

                    console.log('Navigating to speaker with ID:', speakerId);
                    window.location.href = `/spokespersons/${speakerId}`;
                  }}
                >
                  <div className="relative w-full h-full">
                    {person.secondCardImage && (
                      <div className="absolute inset-0">
                        <Image
                          src={person.secondCardImage}
                          alt=""
                          fill
                          className="object-cover"
                          style={{
                            filter: 'blur(8px)',
                            transform: 'scale(1.1)',
                            opacity: 0.7
                          }}
                        />
                      </div>
                    )}
                    <Image
                      src={person.imgSrc}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={person.isActive}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x600';
                      }}
                    />
                    {/* Name Overlay */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[470px] h-[74px] flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <h3
                        className="font-['Fustat'] font-semibold text-white text-2xl uppercase"
                        style={{
                          letterSpacing: '0%',
                          lineHeight: '100%'
                        }}
                      >
                        {person.name}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6 p-[70px] z-30">

          {/* PREVIOUS */}
          <button
            onClick={() => {
              prevSlide();
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
              nextSlide();
              setActiveArrow("next");
            }}
            className={`w-[50px] h-[50px] rounded-full
      p-[4px] transition
      ${activeArrow === "next"
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "border-4 border-gray-300 bg-white"
              }`}
          >
            <div
              className={`w-full h-full rounded-full flex items-center justify-center
        ${activeArrow === "next"
                  ? "bg-white"
                  : "bg-white"
                }`}
            >
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
      </div>
    </div>
  );
};

export default SpokesPerson;