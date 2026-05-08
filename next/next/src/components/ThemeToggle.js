"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ✅ Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div
      className="relative w-16 h-8 flex items-center bg-teal-500 dark:bg-gray-900 cursor-pointer rounded-full p-1"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Icon */}
      {isDark ? (
        <FaMoon className="text-white z-10 ml-2" size={16} />
      ) : (
        <FaSun className="text-yellow-300 z-10 ml-2" size={16} />
      )}

      {/* Toggle Circle */}
      <div
        className="absolute bg-white dark:bg-gray-700 w-6 h-6 rounded-full shadow-md transform transition-transform duration-300"
        style={isDark ? { right: "2px" } : { left: "2px" }}
      />
    </div>
  );
}
