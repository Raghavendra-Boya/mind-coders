"use client";

import React, { useMemo, memo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IMAGES } from "../constants/images";
import { Menu, X } from "lucide-react";

// Memoized SidebarItem component to prevent unnecessary re-renders
const SidebarItem = memo(({ label, href, pathname, onClick }) => {
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 py-2.5 px-3 rounded-md transition-all
        ${isActive ? "bg-[#ef4444] text-white" : "text-[#1e293b] hover:bg-gray-100"}
        w-full md:w-auto
      `}
      style={{
        fontFamily: 'Manrope, sans-serif',
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '140%',
        letterSpacing: '0%'
      }}
      prefetch={false}
    >
      <span className={isActive ? "text-white" : "text-gray-500"}>
        <Image 
          src="/asset/sidebar icons.png" 
          alt={label} 
          width={16} 
          height={16} 
          className="w-4 h-4 flex-shrink-0"
          priority={false}
          loading="lazy"
        />
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
});
SidebarItem.displayName = 'SidebarItem';

const Sidebar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  // Memoize menu items to prevent recreation on every render
  const menuItems = useMemo(() => [
    {
      items: [
        { label: "Live Broadcast", href: "/dashboard/live-broadcast" },
        { label: "Library", href: "/dashboard" },
        { label: "Events", href: "/dashboard/Events" },
        { label: "Slot Bookings", href: "/dashboard/SlotBooking" },
        { label: "Request Prayer", href: "/dashboard/RequestPrayerList" },
        { label: "Donations", href: "/dashboard/donations" },
        { label: "Mobile Page", href: "/dashboard/MobileHomePageCustomization" },
        { label: "Web Page", href: "/dashboard/WebHomePage" },
        { label: "Testimonials", href: "/dashboard/testimonials" },
      ],
    },
  ], []);

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#ef4444] text-white"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-40
          h-screen md:h-[100vh] 
          text-[#1e293b]
          shadow-md flex flex-col
          overflow-y-auto overflow-x-hidden
          scrollbar-hide
          w-64 md:w-60
          p-5
          bg-[#F1F6F9]
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex flex-col items-center mb-[30px] pt-4 md:pt-0">
          <Image
            src={IMAGES.LOGO}
            alt="Rakshana TV"
            width={64}
            height={64}
            className="h-16 w-auto object-contain"
            priority
          />
        </div>

        <nav className="flex-1 flex flex-col space-y-4">
          {menuItems.map(({ items }, sectionIndex) => (
            <div key={sectionIndex} className="flex flex-col space-y-1 w-full">
              {items.map((item) => (
                <SidebarItem 
                  key={item.href} 
                  {...item} 
                  pathname={pathname}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default memo(Sidebar);
