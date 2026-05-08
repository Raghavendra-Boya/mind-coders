"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { fetchHeroSection } from "../../store/slices/HerosectionSlice";

const fustatFont = {
  fontFamily: 'Fustat',
  fontWeight: 800,
  fontStyle: 'normal',
  src: "url('/fonts/Fustat-ExtraBold.woff2') format('woff2'), url('/fonts/Fustat-ExtraBold.woff') format('woff')"
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @font-face {
      font-family: 'Fustat';
      font-weight: 800;
      font-style: normal;
      src: url('/fonts/Fustat-ExtraBold.woff2') format('woff2'),
           url('/fonts/Fustat-ExtraBold.woff') format('woff');
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}

const HERO_BASE = process.env.NEXT_PUBLIC_HERO_BASE_URL || "";

const urlFromName = (name) => {
  if (!name) return null;
  if (!HERO_BASE) return null;
  return `${HERO_BASE}${name}`;
};

export default function HeroSection() {
  const dispatch = useDispatch();
  const { data: heroData, loading } = useSelector((state) => state.heroSection);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayTitle, setDisplayTitle] = useState('');
  const [displaySubtitle, setDisplaySubtitle] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);

  const imageUrls = [
    heroData?.UploadURL || urlFromName(heroData?.UploadName),
    heroData?.Image2URL || urlFromName(heroData?.Image2Name),
    heroData?.Image3URL || urlFromName(heroData?.Image3Name),
  ].filter(Boolean);

  useEffect(() => {
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    
    const loadHeroData = async () => {
      try {
        // Try to load from localStorage first
        const savedHeroData = typeof window !== 'undefined' ? localStorage.getItem('cachedHeroData') : null;
        const savedTimestamp = typeof window !== 'undefined' ? localStorage.getItem('heroDataTimestamp') : null;
        
        if (savedHeroData && savedTimestamp && (Date.now() - parseInt(savedTimestamp) < oneHour)) {
          const parsedData = JSON.parse(savedHeroData);
          if (parsedData) {
            // Dispatch action to update the store with cached data
            dispatch({ type: 'heroSection/fetchHeroSection/fulfilled', payload: parsedData });
            return; // Skip API call if we have fresh cache
          }
        }
        
        // If no cache or cache is stale, fetch fresh data
        const action = await dispatch(fetchHeroSection());
        if (action.payload) {
          // Save to localStorage on successful fetch
          localStorage.setItem('cachedHeroData', JSON.stringify(action.payload));
          localStorage.setItem('heroDataTimestamp', Date.now().toString());
        }
      } catch (error) {
        console.error('Error loading hero section data:', error);
      }
    };
    
    loadHeroData();
  }, [dispatch]);

  useEffect(() => {
    if (!heroData) return;
    
    setDisplayTitle('');
    setDisplaySubtitle('');
    setShowSubtitle(false);
    
    const titleDelay = setTimeout(() => {
      let titleIndex = 0;
      const titleInterval = setInterval(() => {
        if (titleIndex <= heroData.Title.length) {
          setDisplayTitle(heroData.Title.substring(0, titleIndex));
          titleIndex++;
        } else {
          clearInterval(titleInterval);
          setTimeout(() => setShowSubtitle(true), 200);
        }
      }, 50); 
      
      return () => clearInterval(titleInterval);
    }, 100); 
    
    return () => {
      clearTimeout(titleDelay);
    };
  }, [heroData]);

  useEffect(() => {
    if (!showSubtitle || !heroData?.SubTitle) return;
    
    let subtitleIndex = 0;
    const subtitleInterval = setInterval(() => {
      if (subtitleIndex <= heroData.SubTitle.length) {
        setDisplaySubtitle(heroData.SubTitle.substring(0, subtitleIndex));
        subtitleIndex++;
      } else {
        clearInterval(subtitleInterval);
      }
    }, 20); 

    return () => clearInterval(subtitleInterval);
  }, [showSubtitle, heroData?.SubTitle]);

  useEffect(() => {
    if (imageUrls.length <= 1) {
      setCurrentImageIndex(0);
      return;
    }
    const id = setInterval(
      () => setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length),
      7000
    );
    return () => clearInterval(id);
  }, [imageUrls.length]);

  const bgUrl = imageUrls.length > 0
    ? imageUrls[currentImageIndex]
    : "https://img.freepik.com/free-photo/people-visiting-praying-church-building_23-2151103915.jpg";

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading hero section...
      </div>
    );
  }

  if (!heroData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        No hero section data available.
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '135vh' }}>
      <div className="absolute inset-0 w-full h-full z-0" style={{
        borderTopLeftRadius: '0',
        borderTopRightRadius: '0',
        overflow: 'hidden'
      }}>
        <img
          src={bgUrl}
          alt={heroData?.Title || "Hero background"}
          className="w-full h-full object-cover object-center transition-opacity duration-300"
          style={{ opacity: loading ? 0 : 1 }}
          onLoad={(e) => {
            e.target.style.opacity = 1;
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://img.freepik.com/free-photo/people-visiting-praying-church-building_23-2151103915.jpg";
          }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
        {loading && (
          <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center">
            <div className="animate-pulse w-16 h-16 border-4 border-white/30 border-t-white rounded-full"></div>
          </div>
        )}
      </div>

      <div className="relative h-full w-full overflow-hidden flex items-start" style={{
        paddingTop: '130px',
        paddingBottom: '100px',
        justifyContent: 'space-between',
        opacity: 1
      }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{
            width: '963px',
            maxWidth: '100%',
            height: '230px',
            position: 'relative',
            top: '44px',
            left: '120px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            opacity: 1,
            transform: 'rotate(0deg)'
          }}>
         <h1 
  className="text-white mb-3 md:mb-4"
  style={{
    fontFamily: 'Fustat',
    fontWeight: 800,
    fontStyle: 'normal',
    fontSize: '60px',
    lineHeight: '130%',
    letterSpacing: '0%',
    maxWidth: '963px',
    opacity: 1
  }}
>
  {displayTitle || "Rakshana Television - Your Channel for Divine Truth"}
  <span className="animate-pulse">|</span>
</h1>
            {showSubtitle && (
              <p 
                className="text-gray-200 mb-5 max-w-[700px]"
                style={{
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: '160%',
                  opacity: 1,
                  letterSpacing: '0%',
                  height: '64px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {displaySubtitle || "Aming to bring people to Jesus through media, with content available on YouTube, their website (rakshanatv.com)"}
                {displaySubtitle.length < (heroData?.SubTitle?.length || 0) && (
                  <span className="animate-pulse">|</span>
                )}
              </p>
            )}
     <div className="mt-[100px]">
 <Link 
  href="/WatchNow" 
  className="group hover:opacity-90 transition-all duration-300 flex items-center"
  style={{
    width: '164px',
    height: '58px',
    padding: '0 15px',
    borderRadius: '100px',
    background: `
      linear-gradient(96.2deg, rgba(255, 255, 255, 0.08) 0%, rgba(209, 209, 209, 0.51) 100%),
      linear-gradient(90deg, #7C56F9 0%, #B90712 100%),
      linear-gradient(0deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.28))
    `,
    fontFamily: 'Manrope, sans-serif',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '100%',
    letterSpacing: '0%',
    textTransform: 'none',
    backdropFilter: 'blur(13px)',
    color: 'white'
  }}
>
  <span className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-white mr-2">
    <svg 
      className="w-5 h-5" 
      fill="currentColor" 
      viewBox="0 0 20 20"
      style={{ color: 'rgb(164, 17, 17)' }}
    >
      <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
  </span>
  <span className="whitespace-nowrap">Watch Now</span>
</Link>
        </div>
            <div className="flex items-center gap-3 mt-16">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "w-8 bg-pink-500"
                      : "w-2.5 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}