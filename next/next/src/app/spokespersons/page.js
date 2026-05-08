'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpeakers } from '@/store/slices/SpeakerSlice';
import { fetchCategories } from '@/store/slices/categorySlice';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
// Removed circular import
import Footer from '@/components/Footer';
import DownloadAppSection from '../download/page';

export default function SpokesPersonsPage() {
  const dispatch = useDispatch();
  const { speakers, loading, error } = useSelector((state) => state.speaker);
  const categories = useSelector((state) => state.category?.items || []);

  useEffect(() => {
    dispatch(fetchSpeakers());
    dispatch(fetchCategories());
  }, [dispatch]);

  const categoryDetails = categories.find(
    (cat) => cat.categoryName?.toLowerCase() === 'spokes person' ||
      cat.CategoryName?.toLowerCase() === 'spokes person'
  ) || {
    CategoryName: 'Spokes Person',
    Description: 'Meet our spokespersons'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 via-white to-sky-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading spokespersons...</p>
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
    <div className="min-h-screen">
      <Navbar />
      <div className="mt-24">
        <section className="bg-[#F7FBFF] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {categoryDetails.CategoryName || 'Spokes Persons'}
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {categoryDetails.Description || 'Meet our team of spokespersons'}
              </p>
            </div>
          </div>
        </section>

        {/* Second Section - Speakers Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {speakers && speakers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {speakers.map((speaker, index) => (
                  <Link
                    key={`${speaker.id || 'speaker'}-${index}`}
                    href={`/spokespersons/${speaker.id}`}
                    className="group block text-center"
                    style={{ width: '386.6667px' }}
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="relative" style={{ width: '100%', height: '350px' }}>
                        <Image
                          src={speaker.image || 'https://via.placeholder.com/400x400'}
                          alt={speaker.name || 'Spokesperson'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 386.6667px"
                          priority={index < 4}
                        />
                      </div>

                    </div>
                    <div
                      className="mt-4 w-full max-w-[386.6667px] text-left"
                    >
                      <h3
                        className="text-gray-900"
                        style={{
                          fontFamily: 'Fustat, sans-serif',
                          fontWeight: 600,
                          fontStyle: 'normal',
                          fontSize: 'clamp(18px, 5vw, 24px)',
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          marginBottom: speaker.designation ? '0.5rem' : '0'
                        }}
                      >
                        {speaker.name || 'Spokesperson'}
                      </h3>
                      {speaker.designation && (
                        <p
                          className="text-gray-600"
                          style={{
                            fontFamily: 'Fustat, sans-serif',
                            fontWeight: 600,
                            fontStyle: 'normal',
                            fontSize: 'clamp(12px, 3.5vw, 14px)',
                            lineHeight: '100%',
                            letterSpacing: '0%',
                            marginTop: '0.5rem'
                          }}
                        >
                          {speaker.designation}
                        </p>
                      )}
                    </div>
                  </Link>

                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No spokespersons found.</p>
              </div>
            )}
          </div>
        </section>
      </div>
      {/* First Section - Header with Light Background */}


      <DownloadAppSection />
      <Footer />
    </div>
  );
}
