'use client';

import React from 'react';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { FaInstagram, FaLinkedinIn, FaTwitter, FaFacebookF } from 'react-icons/fa';
import DownloadApp from '../download/page';
import Navbar from '@/components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAboutSection } from '@/store/slices/AboutSectionSlice';
import { useEffect, useState } from 'react';
import { fetchCategories } from '@/store/slices/categorySlice';
import { fetchLeaders } from '@/store/slices/LeaderSlice';

export default function LeadersSection() {
  const dispatch = useDispatch();

  // About Section
  const { AboutSectionsData = [], loading: aboutLoading, error: aboutError } = useSelector((state) => state.about);
  const aboutData = AboutSectionsData?.[0];


  const [leaderCategory, setLeaderCategory] = useState({
    name: "The Leaders",
    description: "Loading leader information..."
  });
  const { leaders = [], loading: leadersLoading, error: leadersError } = useSelector(
    (state) => state.leader || { leaders: [] }
  );
  useEffect(() => {
    dispatch(fetchAboutSection());
    dispatch(fetchCategories());
    dispatch(fetchLeaders());
  }, [dispatch]);

  // Get categories from Redux store
  const { items: categories = [], loading: catLoading, error: catError } = useSelector((state) => {
    return state.category || { items: [] };
  });

  // Reorder leaders to show Benhur Jakkula first, then Dr. Kumi, then others
  const reorderedLeaders = [...(leaders || [])].sort((a, b) => {
    const aName = (a.name || '').toLowerCase();
    const bName = (b.name || '').toLowerCase();

    // Benhur Jakkula first
    if (aName.includes('benhur') || aName.includes('behnur')) return -1;
    if (bName.includes('benhur') || bName.includes('behnur')) return 1;

    // Dr. Kumi second
    if (aName.includes('kumi') || aName.includes('dr. kumi')) return -1;
    if (bName.includes('kumi') || bName.includes('dr. kumi')) return 1;

    return 0;
  });

  // Handle categories data to find and set leader category
  useEffect(() => {
    if (categories && Array.isArray(categories)) {
      const leaderData = categories.find(cat => {
        if (!cat) return false;
        const categoryName = String(cat.CategoryName || '').trim();
        return categoryName.toLowerCase() === 'the leaders';
      });

      if (leaderData) {
        setLeaderCategory({
          name: leaderData.CategoryName,
          description: leaderData.Description
        });
      }
    }
  }, [categories]);

  return (
    <>
      <section className="text-center">
        {/* About Section */}
        <div className="bg-gradient-to-r from-[#f8fafc] to-[#e0f7fa] flex items-center justify-center min-h-screen relative p-8">
          <Navbar />
          <div className="p-24 mt-10 rounded-lg relative text-left">
            {aboutLoading && <p>Loading...</p>}
            {aboutError && <p className="text-red-500">Error loading data</p>}
            {aboutData && (
              <>
                <h1 className="text-6xl font-extrabold text-[#0b0b0b] mb-6">
                  {aboutData.Heading}
                </h1>
                <p className="text-xl text-[#3d3d3d] leading-relaxed mb-4 whitespace-pre-line">
                  {aboutData.Description}
                </p>
                <p className="text-xl font-bold text-[#d63384]">- CEO’s Name</p>
              </>
            )}
          </div>
        </div>

        {/* Leaders Section */}
        <div className="container mx-auto px-4 mt-16">
          <h2 className="text-5xl font-extrabold text-gray-900">
            {leaderCategory?.name}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mt-3">
            {leaderCategory?.description}
          </p>

          {leadersLoading ? (
            <p>Loading leaders...</p>
          ) : leadersError ? (
            <p className="text-red-500">Error loading leaders: {leadersError}</p>
          ) : (
            <div className="mt-10 space-y-10 max-w-7xl mx-auto">
              {reorderedLeaders.map((leader, index) => (
                <div
                  key={leader.id}
                  className={`bg-white shadow-lg rounded-lg overflow-hidden flex w-[80%] mx-auto ${index > 0 ? 'mt-8' : ''
                    }`}
                >
                  {/* Image on left for even, right for odd */}
                  {index % 2 === 0 ? (
                    <>
                      <div className="w-[450px] flex-shrink-0">
                        <Image
                          src={leader.image || "/placeholder-leader.jpg"}
                          alt={leader.name}
                          width={450}
                          height={450}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className="p-8 flex-1 text-left relative overflow-hidden"
                        style={{
                          backgroundImage: "url('/asset/Leader bg lines.png'), radial-gradient(50% 42.17% at 50% 49.92%, #F4F7FA 0%, #D6E4F2 50%, #F4F7FA 100%)",
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          backgroundBlendMode: 'overlay',
                          opacity: 0.9
                        }}
                      >
                        <div className="relative z-10">
                          <h3 className="text-4xl font-bold text-gray-900">{leader.name}</h3>
                          <p className="text-xl font-medium text-gray-600 mt-1">
                            {leader.designation}
                          </p>
                          <p className="text-lg text-gray-600 mt-4 leading-relaxed whitespace-pre-line">
                            {leader.description}
                          </p>
                          <div className="flex gap-6 mt-6 text-2xl">
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><FaInstagram /></a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><FaLinkedinIn /></a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><FaTwitter /></a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><FaFacebookF /></a>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-8 flex-1 text-left relative overflow-hidden"
                        style={{
                          backgroundImage: "url('/asset/Leader bg lines.png'), radial-gradient(50% 42.17% at 50% 49.92%, #F4F7FA 0%, #D6E4F2 50%, #F4F7FA 100%)",
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          backgroundBlendMode: 'overlay',
                          opacity: 0.9
                        }}
                      >
                        <div className="relative z-10">
                          <h3 className="text-4xl font-bold text-gray-900">{leader.name}</h3>
                          <p className="text-xl font-medium text-gray-600 mt-1">
                            {leader.designation}
                          </p>
                          <p className="text-lg text-gray-600 mt-4 leading-relaxed whitespace-pre-line">
                            {leader.description}
                          </p>
                          <div className="flex gap-6 mt-6 text-2xl">
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><FaInstagram /></a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><FaLinkedinIn /></a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><FaTwitter /></a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><FaFacebookF /></a>
                          </div>
                        </div>
                      </div>
                      <div className="w-[450px] flex-shrink-0">
                        <Image
                          src={leader.image || "/placeholder-leader.jpg"}
                          alt={leader.name}
                          width={450}
                          height={450}
                          className="w-full h-full object-cover"
                        />

                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>


        <div className="relative max-w-[80%] mx-auto rounded-2xl 
         bg-white border border-gray-100 shadow-sm p-10  mt-24 mb-24" style={{
          backgroundImage: "url('asset/watch_Live_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height:"700px"
        }}>
          <div className="absolute "
          style={{top: "-35px",
          left: "-43px"}}
          >
            <img
              src="/asset/misc-13 1.png"
              alt="Decorative strokes"
              className="w-8 md:w-12 h-auto pointer-events-none select-none"
            />
          </div>
          {/* Soft gradient glow */}
          <div className="absolute inset-0 pointer-events-none">
           
        </div>

          {/* CONTENT (no background, no border here) */}
          <div className="relative z-10 text-left">

            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Chairman Message
            </h3>

            <div className="h-[3px] w-40 rounded-full 
      bg-gradient-to-r from-purple-500 to-pink-500 mb-6" />

            <p className="text-gray-600 text-lg mb-4">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>

            <p className="text-gray-600 text-lg mb-4">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              <span className="font-semibold text-gray-800">
                {" "}Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </span>
            </p>

            <p className="text-gray-600 text-lg mb-4">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>

            <p className="text-gray-600 text-lg mb-4">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              <span className="font-semibold text-gray-800">
                {" "}standard dummy text ever since the 1500s
              </span>,
              when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>

            <p className="text-gray-600 text-lg mb-10">
              It has survived not only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged.
            </p>
            <div className="mt-24">
              <Image
                src="/asset/Signature jhon.png"
                alt="Benhur Jakkula Signature"
                width={229}
                height={34}
                className="object-contain"
              />
            </div>


          </div>
        </div>

      </section>

      <DownloadApp />
      <Footer />
    </>
  );
}
