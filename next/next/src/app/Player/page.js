"use client";

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const steps = [
  { 
    icon: "/asset/Schedule.svg", 
    label: "Schedule", 
    href: "/ProgramSchedule",
    prefetch: true
  },
  {
    icon: "/asset/Reqplayer.png",
    label: "Request Prayer",
    href: "/RequestPrayer",
    prefetch: true
  },
  {
    icon: "/asset/Eventbook.png",
    label: "Event Booking",
    href: "/EventBooking",
    prefetch: true
  },
  { 
    icon: "/asset/Slotbook.png", 
    label: "Slot Booking", 
    href: "/SlotBooking",
    prefetch: true
  },
];

export default function Flow() {
  const router = useRouter();

  // Prefetch all routes on component mount
  React.useEffect(() => {
    steps.forEach(step => {
      if (step.prefetch) {
        router.prefetch(step.href);
      }
    });
  }, []);

  const handleClick = (e, href) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <div
      className="w-full flex justify-center pt-6 min-h-[130px] h-auto"
      style={{
        backgroundColor: "#F7FBFF",
      }}
    >
      {/* Navigation */}
      <div className="w-full max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {steps.map((step, index) => (
            <div key={index} className="w-full">
              <div className="w-full rounded-full bg-gradient-to-r from-[#ff7a4b] via-[#ff4b5c] to-[#7b5cff] p-[1.5px] hover:opacity-90 transition-opacity">
                <Link
                  href={step.href}
                  onClick={(e) => handleClick(e, step.href)}
                  prefetch={step.prefetch}
                  className="
                    flex items-center justify-between
                    rounded-full w-full
                    bg-white dark:bg-gray-900
                    px-4 sm:px-5 md:px-6
                    py-3 sm:py-3.5
                    gap-3
                    shadow-sm hover:shadow-md
                    transition-all duration-200
                    active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  "
                  aria-label={`Go to ${step.label}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 relative">
                      <Image
                        src={step.icon}
                        alt={step.label}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                        loading="eager"
                        priority={index < 4} // Load first 4 images with priority
                      />
                    </div>

                    <span className="
                      font-['Fustat']
                      font-medium
                      text-sm sm:text-[15px] lg:text-[16px]
                      leading-tight
                      text-gray-900 dark:text-white
                      whitespace-nowrap
                      truncate
                    ">
                      {step.label}
                    </span>
                  </div>

                  <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 relative">
                    <Image
                      src="/asset/right-arrow.png"
                      alt=""
                      width={24}
                      height={24}
                      className="w-full h-full opacity-70"
                      loading="eager"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
