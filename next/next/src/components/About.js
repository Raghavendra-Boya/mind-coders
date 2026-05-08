"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAboutSection } from "@/store/slices/AboutSectionSlice";

export default function AboutSection() {
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  // Access Redux state
  const { AboutSectionsData = [], loading, error } = useSelector((state) => state.about);
  const aboutData = AboutSectionsData?.[0];

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isMounted) {
          const result = await dispatch(fetchAboutSection()).unwrap();
          const imageUrl = result?.AboutSectionsData?.[0]?.ImageURL;

          if (imageUrl) {
            console.log('🖼️ Attempting to load image from:', imageUrl);

            // Create a new image element to test loading
            const img = new Image();

            img.onload = () => {
              console.log('✅ Image loaded successfully');
              if (isMounted) {
                setImageSrc(imageUrl);
                setImageError(false);
              }
            };

            img.onerror = () => {
              console.log('❌ Image failed to load. Checking URL...');

              // 1. First, try to load a test image to check general image loading
              const testImage = new Image();
              testImage.onload = () => console.log('✅ Test image loaded successfully');
              testImage.onerror = () => console.log('❌ Test image failed to load - possible network/CORS issue');
              testImage.src = 'https://placehold.co/600x400?text=Test+Image';

              // 2. Try to fetch with CORS mode
              fetch(imageUrl, {
                method: 'HEAD',
                mode: 'no-cors'
              })
                .then(() => {
                  console.log('🔍 URL might be accessible (CORS prevents verification)');
                })
                .catch(err => {
                  console.error('❌ Network error:', {
                    name: err.name,
                    message: err.message,
                    type: 'CORS or Network Error'
                  });
                })
                .finally(() => {
                  if (isMounted) {
                    setImageError(true);
                  }
                });
            };

            // Start loading the image
            img.src = imageUrl;

            // Set a timeout to handle cases where the image takes too long to load
            setTimeout(() => {
              if (isMounted && !img.complete) {
                console.warn('⏱️ Image loading timed out:', imageUrl);
                setImageError(true);
              }
            }, 5000); // 5 second timeout
          } else {
            console.warn('⚠️ No image URL provided in the response');
            setImageError(true);
          }
        }
      } catch (err) {
        console.error('❌ Failed to fetch about section:', {
          error: err,
          message: err.message,
          timestamp: new Date().toISOString()
        });
        setImageError(true);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message || 'Failed to load'}</div>;
  if (!aboutData) return <div className="p-4">No data available</div>;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 md:p-16 bg-gray-100 dark:bg-gray-900 rounded-lg relative overflow-hidden">
      {/* Left Text */}
      <div className="md:w-2/3 relative z-10 pl-0 md:pl-16">
       <h2 className="font-['Fustat'] font-extrabold text-[46px] leading-[130%] tracking-normal capitalize text-gray-900 dark:text-white mb-6 text-left">
  {aboutData.Heading}
</h2>
        <p className="font-['Fustat'] font-normal text-[18px] leading-[30px] tracking-normal capitalize text-gray-700 dark:text-gray-300 mb-6 text-left max-w-2xl">
  {aboutData.Description}
</p>
      <p className="font-['Fustat'] font-bold text-[20px] leading-[30px] tracking-normal capitalize text-transparent bg-clip-text bg-gradient-to-r from-[#A184F6] to-[#AA4249]">
  - {aboutData.CEOName || 'CEO'}
</p>
      </div>

      {/* Right Side Image */}
  <div className="md:w-1/2 flex justify-center mt-6 md:mt-0 relative z-10">
  {/* OUTER GRADIENT FRAME */}
  <div
    className="
      bg-gradient-to-br from-[#E9DFFF] to-[#F2E7FF]
      p-6
      rounded-[32px]
      shadow-lg
    "
  >
    {/* INNER IMAGE */}
    {!imageError && imageSrc ? (
      <img
        src={imageSrc}
        alt={aboutData.Heading}
        width={360}
        height={360}
        className="
          w-[360px]
          h-[360px]
          object-cover
          rounded-[24px]
        "
        onError={() => setImageError(true)}
      />
    ) : (
      <div
        className="
          w-[360px]
          h-[360px]
          rounded-[24px]
          bg-gradient-to-br from-purple-100 to-pink-100
          flex flex-col items-center justify-center text-center
        "
      >
        <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700">
          No Image Available
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          We couldn't load the image
        </p>
      </div>
    )}
  </div>
</div>

    </div>
  );
}