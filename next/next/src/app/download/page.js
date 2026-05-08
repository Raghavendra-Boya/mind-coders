"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAppstoreLinks } from "@/store/slices/AppstoreSlice";

export default function DownloadAppSection() {
  const dispatch = useDispatch();
  const { links, loading, error } = useSelector(
    (state) => state.appstore
  );

  useEffect(() => {
    dispatch(getAppstoreLinks());
  }, [dispatch]);

  const getLink = (patterns) => {
    if (!links?.AppLinksData) return "#";
    const found = links.AppLinksData.find((l) =>
      patterns.some((p) =>
        l.AppName?.toLowerCase().includes(p)
      )
    );
    return found?.Link || "#";
  };

  const appStoreLink = getLink(["app store", "appstore"]);
  const playStoreLink = getLink(["play store", "google"]);

  if (loading) return null;
  if (error) return null;

  return (
    <section className="relative w-full min-h-screen bg-[#0B0C10] text-white overflow-hidden h-[700px]">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative max-w-7xl mx-auto  flex flex-col lg:flex-row items-center">
        {/* Phone Image */}
        <div className="lg:w-1/2 flex justify-center relative mt-20">
          <div className="relative w-[349.94px] h-[699.88px]">
            <Image
              src="/Asset/phone image.png"
              alt="App preview"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>


    {/* Right Content */}
<div className="lg:w-1/2 relative pl-16 mb-[200px]">
  {/* Main Heading */}
  <h2 
    className="font-['Fustat'] font-bold text-[80px] leading-[88px] tracking-normal mb-10"
    style={{
      width: '523px',
      height: '176px'
    }}
  >
    Download our <br /> app for free
  </h2>

  {/* App Store Buttons */}
  <div className="flex gap-6 w-[411px] mb-10">
    <a 
      href={appStoreLink} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="w-[189px] h-[61px] flex items-center justify-center"
    >
      <Image
        src="/Asset/appstore.jpg"
        alt="Download on App Store"
        width={170}
        height={52}
        className="object-contain w-full h-full"
      />
    </a>
    <a 
      href={playStoreLink} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="w-[202px] h-[61px] flex items-center justify-center bg-[#1A1B20] rounded-[10px] border border-[#2D2E33]"
    >
      <Image
        src="/Asset/Googleplay.jpg"
        alt="Get it on Google Play"
        width={170}
        height={52}
        className="object-contain w-[170px] h-[52px]"
      />
    </a>
  </div>

  {/* Where to Watch Section */}
  <div className="w-[503.51px]">
    <p className="text-lg font-medium text-gray-300 mb-4">Where to touch</p>
    <div className="flex items-center bg-[#1A1B20] rounded-[10px] p-[10px] w-full h-[100px]">
      <div className="w-[134px] h-[80px] flex items-center justify-center bg-[#1A1B20] rounded-2xl p-2.5">
        <Image
          src="/asset/Airtel.png"
          alt="Airtel"
          width={58}
          height={48}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="w-[112px] h-[80px] flex items-center justify-center bg-[#1A1B20] rounded-2xl p-2.5">
        <Image
          src="/asset/Tata play.png"
          alt="Tata Play"
          width={48}
          height={48}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="w-[126.67px] h-[80px] flex items-center justify-center bg-[#1A1B20] rounded-2xl p-2.5">
        <Image
          src="/asset/Jio Tv.png"
          alt="Jio TV"
          width={48}
          height={48}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="w-[80.84px] h-[80px] flex items-center justify-center bg-[#1A1B20] rounded-2xl p-2.5">
        <Image
          src="/asset/D2h.png"
          alt="D2H"
          width={48}
          height={48}
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  </div>
</div>
      </div>
    </section>
  );
}
