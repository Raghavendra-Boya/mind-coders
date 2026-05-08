"use client";

import Footer from "@/components/Footer";
import { FiArrowRight } from "react-icons/fi";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import DownloadApp from "../download/page";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrograms } from "@/store/slices/programSlice";
import { fetchCategories } from "@/store/slices/categorySlice";
import Image from "next/image";


// Helper function to get program image with fallback
function getProgramImage(program) {
  const raw =
    program.ImageURL ||
    program.ProgramImageURL ||
    program.ProgramImage ||
    program.image ||
    program.ProgramImagePath;

  if (!raw) {
    return "https://placehold.co/600x400?text=No+Image&font=inter";
  }
  return raw;
}

// ProgramCard component for individual program items
function ProgramCard({ program, index }) {
  return (
    <Link
      href={`/programs/${program.ProgramID || program.SNo || index}`}
      className="block group relative w-full h-full rounded-[20px] overflow-hidden transition-transform duration-300 hover:scale-105"
    >
      <div className="relative w-full h-full">
        <img
          src={getProgramImage(program)}
          alt={program.ProgramName || program.title || "Program"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://placehold.co/600x400?text=No+Image&font=inter";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">

          <h3 className="text-white font-bold text-xl line-clamp-2">
            {program.ProgramName || program.title || "Program"}
          </h3>
        </div>
      </div>
    </Link>
  );
}

function CarouselRow({ items, startIndex, isPaused, onMouseEnter, onMouseLeave, isProgramsPage, direction = "left" }) {
  const trackRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Card dimensions and spacing
  const cardWidth = 386;
  const cardHeight = 260;
  const cardStyle = {
    width: `${cardWidth}px`,
    height: `${cardHeight}px`,
    flex: `0 0 ${cardWidth}px`,
    borderRadius: '20px',
    overflow: 'hidden',
    opacity: 1,
    transform: 'rotate(0deg)'
  };

  return (
    <div
      className="carousel-container"
      onMouseEnter={() => {
        setIsHovering(true);
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        setIsHovering(false);
        onMouseLeave?.();
      }}
    >
      <div
        ref={trackRef}
        className={`carousel-track ${direction} ${isPaused || isHovering ? 'paused' : ''} ${isProgramsPage ? 'no-animation' : ''}`}
        style={{
          padding: '0 16px',
          margin: '0',
          width: '100%'
        }}
      >
        {(isProgramsPage ? items : [...items, ...items]).map((program, index, arr) => {
          // For carousel (duplicated items), use a unique key with the index and a unique identifier
          const isDuplicate = index >= items.length;
          const uniqueKey = isDuplicate
            ? `${program.ProgramID || program.SNo || index}-carousel-${index - items.length}`
            : `${program.ProgramID || program.SNo || index}-${isProgramsPage ? 'grid' : 'carousel'}`;

          return (
            <div
              key={uniqueKey}
              style={cardStyle}
            >
              <ProgramCard
                program={program}
                index={index}
                startIndex={startIndex}
                itemsLength={items.length}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Programs() {
  const [mounted, setMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { programs, loading, error } = useSelector((state) => state.program);
  const { items: categories = [] } = useSelector((state) => state.category || {});
  const isProgramsPage = pathname === '/programs';

  // Scroll to top when pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Stop animation on programs page
  useEffect(() => {
    setIsPaused(isProgramsPage);
  }, [isProgramsPage]);

  // Load data from localStorage on mount
  useEffect(() => {
    setMounted(true);

    // Try to load programs from localStorage first
    const savedPrograms = typeof window !== 'undefined' ? localStorage.getItem('cachedPrograms') : null;
    const savedTimestamp = typeof window !== 'undefined' ? localStorage.getItem('programsTimestamp') : null;
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

    // If we have cached data that's less than 1 hour old, use it
    if (savedPrograms && savedTimestamp && (Date.now() - parseInt(savedTimestamp) < oneHour)) {
      try {
        const parsedPrograms = JSON.parse(savedPrograms);
        if (Array.isArray(parsedPrograms)) {
          // Dispatch an action to update the store with cached data
          dispatch({ type: 'program/fetchPrograms/fulfilled', payload: { ProgramsData: parsedPrograms } });
        }
      } catch (e) {
        console.error('Error parsing cached programs:', e);
      }
    } else {
      // If no cache or cache is stale, fetch fresh data
      dispatch(fetchPrograms())
        .then((action) => {
          // Save to localStorage on successful fetch
          if (action.payload?.ProgramsData) {
            localStorage.setItem('cachedPrograms', JSON.stringify(action.payload.ProgramsData));
            localStorage.setItem('programsTimestamp', Date.now().toString());
          }
        });
    }

    // Always fetch categories as they might change more frequently
    dispatch(fetchCategories());
  }, [dispatch]);

  const programList = Array.isArray(programs?.ProgramsData)
    ? programs.ProgramsData
    : Array.isArray(programs)
      ? programs
      : [];

  // Get preferred category
  const preferredCategory =
    categories.find((cat) => cat.categoryName?.toLowerCase() === "programs") ||
    categories.find((cat) => cat.categoryName?.toLowerCase() === "program") ||
    categories[0] ||
    null;

  const firstProgram = programList[0] || {};
  const [currentCategoryName, setCurrentCategoryName] = useState('Latest Programs');
  const [currentCategoryDescription, setCurrentCategoryDescription] = useState('Explore our latest programs');

  // Update category name and description when categories or programs data changes
  // Update category name and description when categories or programs data changes
  useEffect(() => {
    if (categories && categories.length > 0) {
      // Sort categories by ID in descending order to get the latest one
      const sortedCategories = [...categories].sort((a, b) => {
        const idA = a.CategoryID || a.id || 0;
        const idB = b.CategoryID || b.id || 0;
        return idB - idA; // Sort in descending order
      });

      const latestCategory = sortedCategories[0];

      if (latestCategory) {
        setCurrentCategoryName(latestCategory.CategoryName || 'Latest Programs');
        setCurrentCategoryDescription(
          latestCategory.Description || 'Explore our latest programs'
        );
      }
    }
  }, [categories]);

  // Filter programs
  const filteredPrograms = programList.filter((p) => {
    let sameCategory = true;
    if (firstProgram.CategoryID && p.CategoryID) {
      sameCategory = String(p.CategoryID) === String(firstProgram.CategoryID);
    } else if (firstProgram.CategoryName && p.CategoryName) {
      sameCategory = p.CategoryName === firstProgram.CategoryName;
    }

    const rawName = p.ProgramName || p.title || "";
    const name = rawName.toLowerCase();
    const looksLikeEpisode = Boolean(p.EpisodeID || p.EpisodeName);
    const looksLikeEpisodeByName = name.includes("episode");
    const isSong = rawName.startsWith("[SONG] ");
    const type = (p.ProgramType || "").toLowerCase();
    const isPodcast = type === "podcast" || name.includes("podcast");
    const isWorkshop = type === "workshop" || name.includes("workshop");

    return (
      sameCategory &&
      !looksLikeEpisode &&
      !looksLikeEpisodeByName &&
      !isSong &&
      !isPodcast &&
      !isWorkshop
    );
  });

  // Create two rows with 4 cards each for carousel
  const firstRow = filteredPrograms.slice(0, 4);
  const secondRow = filteredPrograms.slice(4, 8);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 via-white to-sky-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading programs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 via-white to-sky-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen " style={{height:'936px'}}>
      <Navbar />
      <section
        className="relative pt-0 pb-12 md:py-20 lg:py-24 xl:py-28"
        style={{
          backgroundImage: isProgramsPage ? 'none' : "url('/asset/programs%20bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: isProgramsPage ? 'auto' : '50vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '96px',
          marginTop: '0'
        }}
      >
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-12">
              {/* Left Content */}
              <div className="w-full md:max-w-2xl px-4 md:px-0 mt-10 md:mt-14 md:ml-14">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                  {currentCategoryName}
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                  {currentCategoryDescription}
                </p>
              </div>

              {/* Right Button */}
              {!isProgramsPage && (
                <div className="w-full md:w-auto px-4 md:px-0 mt-6 md:mt-0 md:mr-20 flex md:justify-end">                <Link
                  href="/programs"
                  className="flex items-center justify-center w-full md:w-auto px-8 py-3 text-center transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/20"
                  style={{
                    minWidth: '140px',
                    height: '48px',
                    borderRadius: '60px',
                    background: 'linear-gradient(90deg, #A184F6 0%, #AA4249 100%)',
                    textDecoration: 'none'
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
                  }}>
                    See all
                  </span>
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
              )}
            </div>
          </div>
        </div>
      </section>
      {isProgramsPage ? (
        // Grid layout for programs page - Two rows with 4 cards each
        <section className="py-8   bg-white">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
              {filteredPrograms.map((program, index) => (
                <div
                  key={`program-${program.ProgramID || program.SNo || index}`}
                  className="w-[386px] h-[260px] rounded-[20px] overflow-hidden"
                >
                  <ProgramCard
                    program={program}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        // Carousel layout for other pages
        <section className="relative w-full overflow-hidden py-8 bg-white">
          <div className="w-full">
            <div className="w-full">
              <div style={{ marginBottom: '60px' }}>
                <CarouselRow
                  items={firstRow}
                  startIndex={0}
                  isPaused={isPaused}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  isProgramsPage={false}
                  direction="right"
                />
              </div>
              <CarouselRow
                items={secondRow}
                startIndex={4}
                isPaused={isPaused}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                isProgramsPage={false}
                direction="left"
              />
            </div>
          </div>
        </section>
      )}
      <style jsx global>{`
        .carousel-container {
          overflow: hidden;
          position: relative;
          width: 100%;
          margin-top: -43px; /* Move the entire carousel up by 100px */
          padding: 0;
        }

        .carousel-track {
          display: flex;
          gap: 16px;
          width: max-content;
          padding: 0 16px;
          will-change: transform;
        }

        .carousel-track:not(.no-animation) {
          animation: scrollLeft 30s linear infinite;
          animation-play-state: running;
        }

        .carousel-track.right:not(.no-animation) {
          animation: scrollRight 30s linear infinite;
        }

        .carousel-track.paused:not(.no-animation) {
          animation-play-state: paused;
        }

        .carousel-track.no-animation {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          padding: 0;
          animation: none;
          max-width: 1280px;
          margin: 0 auto;
        }

        .carousel-item {
          flex: 0 0 auto;
          width: 386px;
          height: 260px;
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          margin: 0 7.5px;
        }

        .carousel-track.no-animation .carousel-item {
          width: 100%;
        }

        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.5rem)); }
        }

        @keyframes scrollRight {
          0% { transform: translateX(calc(-50% - 0.5rem)); }
          100% { transform: translateX(0); }
        }

        @media (max-width: 1024px) {
          .carousel-track.no-animation {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }

        @media (max-width: 1200px) {
          .carousel-track.no-animation {
            grid-template-columns: repeat(2, 1fr);
            max-width: 900px;
          }
        }

        @media (max-width: 768px) {
          .carousel-track.no-animation {
            grid-template-columns: 1fr;
            max-width: 386px;
          }
        }

        @media (max-width: 480px) {
          .carousel-item {
            width: 160px;
          }
          .carousel-track.no-animation {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          }
        }
      `}</style>

      {mounted && isProgramsPage && (
        <>
          <DownloadApp />
          <Footer />
        </>
      )}
    </div>
  )
}