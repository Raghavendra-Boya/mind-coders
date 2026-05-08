// "use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function NavbarLogin() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login"); // ✅ navigate to full login page
  };

  return (
    <nav>
      <div className="space-x-4">
        <button
          onClick={handleLoginClick}
          className="px-5 py-2 rounded-full bg-white text-rose-600 font-medium border border-rose-600 hover:bg-rose-600 hover:text-white transition"
        >
          Login
        </button>
      </div>
    </nav>
  );
}
