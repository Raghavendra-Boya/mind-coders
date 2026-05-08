"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";

export default function DashboardLayout({ children }) {
  const [isClient, setIsClient] = useState(false);
  const path = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hideHeaderPaths = [
    "/dashboard",
    "/dashboard/programs",
    "/dashboard/donations",
    "/dashboard/RequestPrayerList",
    "/dashboard/live-broadcast",
    "/dashboard/MobileHomePageCustomization",
    "/dashboard/WebHomePage",
    "/dashboard/SongsDashboard",
  ];

  const hideHeader = hideHeaderPaths.includes(path);

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex bg-white text-[#0b132b]">
      {/* Sidebar (no gap, full height) */}
      <Sidebar />

      {/* Main Content (no padding or margin at outer level) */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Optional header (hidden for these pages) */}
        {/* {!hideHeader && <HeaderBar title="SongsDashboard" />} */}

        {/* Main Dashboard Area */}
        <main className="flex-1 overflow-y-auto bg-white">{children}</main>
      </div>
    </div>
  );
}
