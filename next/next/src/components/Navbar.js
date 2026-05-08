"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import { IMAGES } from "@/constants/images";

// Lazy load NavbarLogin to reduce initial bundle size
const NavbarLogin = dynamic(() => import("@/app/NavbarLogin/page"), {
  loading: () => <div className="w-8 h-8" />,
  ssr: false
});

// Memoize the nav links to prevent unnecessary re-renders
const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Watch Live", path: "/WatchLive" },
  { name: "Programs", path: "/programs" },
];

const Logo = () => (
  <Link href="/" className="block h-[62px] w-[95px] ml-6">
    <Image
      src="/asset/Rakshana Logo.svg"
      alt="Rakshana TV"
      width={95}
      height={62}
      className="h-full w-full object-contain"
      priority
    />
  </Link>
);
// Mobile menu button component
const MobileMenuButton = ({ isOpen, onClick, isTransparent }) => (
  <button
    onClick={onClick}
    className={`md:hidden ${isTransparent ? "text-white" : "text-gray-800"
      } focus:outline-none`}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <svg
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {isOpen ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  </button>
);

// Mobile menu component
const MobileMenu = ({ isOpen, onClose, isHome, isScrolled }) => (
  <div
    className={`md:hidden bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out transform ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}
  >
    <nav className="flex flex-col space-y-4 px-6 py-5">
      {navLinks.map(({ name, path }) => (
        <Link
          key={name}
          href={path}
          onClick={onClose}
          className="py-2.5 text-gray-800 hover:text-pink-600 transition-colors font-medium text-base"
          prefetch={false}
        >
          {name}
        </Link>
      ))}
      <Link
        href="/contact"
        onClick={onClose}
        className="py-2.5 text-gray-800 hover:text-pink-600 transition-colors font-medium text-base"
        prefetch={false}
      >
        Contact Us
      </Link>
      <div className="flex items-center space-x-3 pt-2 mt-2 border-t border-gray-100 w-full">
        <Link
          href="/donate"
          onClick={onClose}
          className="flex-1 text-center py-2 text-pink-600 hover:text-pink-700 font-semibold text-base border border-pink-600 rounded-lg"
          prefetch={false}
        >
          Donate <span className="ml-1">→</span>
        </Link>
        <div className="flex-1 text-center py-2 text-gray-800 font-medium">
          <NavbarLogin />
        </div>
      </div>
    </nav>
  </div>
);

// Main Navbar component
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname?.toLowerCase() === "/";

  // Throttle scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isHome && !isScrolled
        ? "bg-transparent"
        : "bg-white/95 backdrop-blur-md shadow-md"
        }`}
    >
      <div className="w-full max-w-[100vw] overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center w-full">
              {/* Logo - Left aligned */}
              <div className="flex-shrink-0">
                <Logo />
              </div>

              {/* Navigation Links - Centered */}
              <div className="flex-1 flex justify-center">
                <div className="flex items-center space-x-8">
                  {navLinks.map(({ name, path }) => (
                    <Link
                      key={name}
                      href={path}
                      className={`font-['Fustat'] font-bold text-sm leading-none tracking-normal transition-colors ${isHome && !isScrolled
                        ? "text-white hover:text-pink-300"
                        : "text-gray-800 hover:text-pink-600"
                        }`}
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Action Buttons - Right aligned */}
              <div className="flex items-center space-x-4">
                <Link
                  href="/contact"
                  className="flex items-center justify-center text-sm font-medium transition-colors duration-200"
                  style={{
                    width: '112px',
                    height: '44px',
                    borderRadius: '60px',
                    border: isHome && !isScrolled ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #E5E7EB',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    color: isHome && !isScrolled ? '#FFFFFF' : '#1F2937',
                    padding: '15px 20px',
                    gap: '10px',
                    background: 'linear-gradient(98.68deg, rgba(201, 201, 201, 0.3) 1.96%, rgba(233, 233, 233, 0.075) 101.81%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(98.68deg, rgba(201, 201, 201, 0.4) 1.96%, rgba(233, 233, 233, 0.15) 101.81%)',
                      transform: 'translateY(-1px)'
                    },
                    ...(isHome && !isScrolled && {
                      color: '#FFFFFF',
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    })
                  }}
                >
                  <span style={{
                    fontFamily: 'Fustat',
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    fontFeatureSettings: '"tnum" on, "lnum" on',
                    color: 'inherit',
                    transition: 'all 0.3s ease'
                  }}>Contact Us</span>
                </Link>
                <Link
                  href="/donate"
                  className="flex items-center justify-center text-sm font-medium text-white hover:opacity-90 transition-all duration-200"
                  style={{
                    width: '116px',
                    height: '48px',
                    padding: '15px 20px',
                    borderRadius: '60px',
                    gap: '10px',
                    border: '1px solid transparent',
                    opacity: 1,
                    background: 'linear-gradient(90deg, #A184F6 0%, #AA4249 100%)'
                  }}
                >
                  <span style={{
                    fontFamily: 'Fustat',
                    fontWeight: 700,
                    fontStyle: 'Bold',
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%',

                  }}>Donate</span>
                  <Image
                    src="/asset/donateArrow.png"
                    alt="→"
                    width={18}
                    height={18}
                    background="white"
                    style={{
                      filter: 'brightness(0) invert(1)'
                    }}
                  />
                </Link>
                <Link
                  href="/login"
                  className="text-gray-800 hover:text-pink-600 transition-colors duration-200"
                >
                  <NavbarLogin />
                </Link>
              </div>
            </nav>

            {/* Right side elements - visible on all screen sizes */}
            <div className="flex items-center space-x-4 md:space-x-6 ml-2">

              <div className="md:hidden">
                <MobileMenuButton
                  isOpen={isOpen}
                  onClick={() => setIsOpen(!isOpen)}
                  isTransparent={isHome && !isScrolled}
                />
              </div>
            </div>
          </div>

          {/* Mobile Menu - Shows on small screens */}
          <MobileMenu
            isOpen={isOpen}
            onClose={closeMenu}
            isHome={isHome}
            isScrolled={isScrolled}
          />
        </div>
      </div>
    </header>
  );
}

export default memo(Navbar);