'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpeakers } from '@/store/slices/SpeakerSlice';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SpokespersonDetail() {
  const params = useParams();
  const dispatch = useDispatch();
  const { speakers } = useSelector((state) => state.speaker);
  const [spokesperson, setSpokesperson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = params;
  console.log('Speaker SNo from URL:', id);

  // Find speaker by SNo
  const findSpeakerBySNo = useCallback((speakersList, targetSNo) => {
    if (!speakersList || speakersList.length === 0) {
      console.log('No speakers available in the list');
      return null;
    }

    console.log('Finding speaker with SNo:', targetSNo);
    console.log('Available speakers:', speakersList.map(s => ({
      SNo: s.SNo,
      Name: s.Name || s.name,
      ImageURL: s.ImageURL || s.image,
      ...s // Log all properties for debugging
    })));

    // Find speaker by SNo
    const found = speakersList.find(sp =>
      sp && sp.SNo && sp.SNo.toString().trim() === targetSNo.toString().trim()
    );

    console.log('Found speaker:', found);
    return found || null;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadSpeaker = async () => {
      if (!isMounted) return;

      setLoading(true);
      setError(null);

      try {
        // If we don't have speakers, fetch them first
        if (!speakers || speakers.length === 0) {
          console.log('No speakers in store, fetching...');
          const result = await dispatch(fetchSpeakers());
          if (!isMounted) return;

          if (result.error) {
            throw new Error('Failed to fetch speakers');
          }
        }

        // Try to find the speaker by SNo
        const speaker = findSpeakerBySNo(speakers || [], id);

        if (!speaker) {
          throw new Error(`Speaker with SNo ${id} not found`);
        }

        if (isMounted) {
          setSpokesperson(speaker);
        }
      } catch (err) {
        console.error('Error loading speaker:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSpeaker();

    return () => {
      isMounted = false;
    };
  }, [id, speakers, dispatch, findSpeakerBySNo]);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 via-white to-sky-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !spokesperson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 via-white to-sky-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {error || 'Speaker not found'}
          </h2>
          <Link
            href="/spokespersons"
            className="inline-block mt-4 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            Back to Speakers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* First Section with Custom Background */}
      <div className="bg-[#F7FBFF] py-16">
        <div className="container mx-auto px-4 ml-16">
          {/* Back Button */}
          <div className=" mt-24">
            <Link
              href="/spokespersons"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Speakers
            </Link>
          </div>

          {/* Speaker Profile Section */}
          <div className="flex flex-col md:flex-row gap-8 pt-12 pb-16">
            {/* Speaker Image */}
            <div className="relative" style={{ width: '180px', height: '180px' }}>
              <div className="relative w-full h-full rounded-[16px] overflow-hidden">
                <Image
                  src={spokesperson.ImageURL || '/placeholder-speaker.jpg'}
                  alt={spokesperson.Name || 'Speaker'}
                  width={180}
                  height={180}
                  className="object-cover"
                  priority
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Speaker Details */}
            <div className="md:w-2/3 lg:w-3/4">
              <h1 className="text-3xl md:text-4xl lg:text-[54px] font-fustat font-extrabold leading-[1.3] tracking-normal capitalize text-gray-900 mb-4" style={{
                fontFeatureSettings: '"clig" off, "liga" off',
                fontFamily: 'Fustat, sans-serif',
                fontStyle: 'normal',
                lineHeight: '130%',
                textTransform: 'capitalize',
                WebkitTextSizeAdjust: '100%',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}>
                {spokesperson.Name || 'Speaker Name'}
              </h1>

              {spokesperson.Role && (
                <p
                  className="text-[18px] text-gray-600 mb-6"
                  style={{
                    fontFamily: 'Fustat, sans-serif',
                    fontWeight: 300,
                    fontStyle: 'normal',
                    lineHeight: '150%',
                    textTransform: 'capitalize',
                    letterSpacing: '0%'
                  }}
                >
                  {spokesperson.Role}
                </p>
              )}


            </div>
          </div>
        </div>
      </div>

      {/* Second Section with White Background */}
      <div className="bg-white py-16 ml-24">
        <div className="container mx-auto px-4">
          {/* Videos Section */}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Video Thumbnails - Replace with actual video data */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative aspect-video bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">Video Title {item}</h3>
                    <p className="text-gray-500 mt-2">Description of the video with more details about the content</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
