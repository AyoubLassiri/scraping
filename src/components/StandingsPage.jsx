import React from "react";
import Navbar from "./Navbar";
import Standings from "./Standings";
import logoImage from "../assets/logoMostakhbal.png";

export default function StandingsPage() {
  return (
    <div dir="rtl" className="w-full min-h-screen bg-white dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pt-16">
      
      {/* Shared Navbar */}
      <Navbar />

      {/* Page Title Header Banner */}
      <div className="bg-[#2596be] dark:bg-neutral-900 text-white py-12 px-4 shadow-md relative overflow-hidden transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <img src={logoImage} alt="Club Logo" className="h-20 w-auto mb-4 object-contain" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            الترتيب ديال نادي مستقبل المرسى الرياضي
          </h1>
          <p className="mt-2 text-white/90 text-sm sm:text-base font-medium">
            البطولة 26/25
          </p>
        </div>
      </div>

      {/* Standings Table Component Container */}
      <div className="py-8">
        <Standings />
      </div>

    </div>
  );
}