"use client";

import PlayerCard from "@/app/Player/page";
import LiveWatch from "@/app/WatchLive/page";
import ProgramsCarousel from "@/app/programs/page";
import SpokesPerson from "@/components/Spokes";
import TestimonialCarousel from "@/components/TestmonialCarousel";
import About from "@/components/About";
import DownloadApp from "@/app/download/page";
import Footer from "@/components/Footer";
import HeroSection from "./HeroSection/page";

export default function HomePage() {
  return (
    <div className="">
      <HeroSection />
      <PlayerCard />
      <LiveWatch />
      <ProgramsCarousel />
      <SpokesPerson />
      <TestimonialCarousel />
      <About />
      <DownloadApp />
      <Footer />
    </div>
  );
}