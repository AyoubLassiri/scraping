import React, { useState, useEffect } from "react";
import logoImage from "../assets/logoMostakhbal.png";

export default function Footer() {
  const [roster, setRoster] = useState({
    forwards: [],
    midfielders: [],
    defenders: [],
    goalkeepers: [],
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/players")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Categorize players based on the positions saved from the Admin Dashboard
          const forwards = data.filter((p) => p.position === "مهاجم").map(p => p.name);
          const midfielders = data.filter((p) => p.position === "وسط ميدان").map(p => p.name);
          const defenders = data.filter((p) => p.position === "مدافع").map(p => p.name);
          const goalkeepers = data.filter((p) => p.position === "حارس مرمى").map(p => p.name);

          setRoster({
            forwards,
            midfielders,
            defenders,
            goalkeepers
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch players for footer:", err);
      });
  }, []);

  return (
    <footer dir="rtl" className="w-full bg-gradient-to-b from-[#2596be] via-neutral-900 to-neutral-950 dark:from-neutral-900 dark:via-neutral-950 dark:to-black text-white font-sans pt-12 pb-8 transition-colors duration-300">
      
      {/* Middle Section: Player Columns */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-right mb-16 pt-12">
        
        <div>
          <h3 className="text-[#eab308] font-bold text-lg mb-4">الهجوم</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            {roster.forwards.length > 0 ? roster.forwards.map((player, idx) => (
              <li key={idx} className="hover:text-white transition-colors cursor-pointer">{player}</li>
            )) : <li className="text-neutral-500">لا يوجد لاعبين</li>}
          </ul>
        </div>

        <div>
          <h3 className="text-[#eab308] font-bold text-lg mb-4">وسط الميدان</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            {roster.midfielders.length > 0 ? roster.midfielders.map((player, idx) => (
              <li key={idx} className="hover:text-white transition-colors cursor-pointer">{player}</li>
            )) : <li className="text-neutral-500">لا يوجد لاعبين</li>}
          </ul>
        </div>

        <div>
          <h3 className="text-[#eab308] font-bold text-lg mb-4">الدفاع</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            {roster.defenders.length > 0 ? roster.defenders.map((player, idx) => (
              <li key={idx} className="hover:text-white transition-colors cursor-pointer">{player}</li>
            )) : <li className="text-neutral-500">لا يوجد لاعبين</li>}
          </ul>
        </div>

        <div>
          <h3 className="text-[#eab308] font-bold text-lg mb-4">حراسة المرمى</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            {roster.goalkeepers.length > 0 ? roster.goalkeepers.map((player, idx) => (
              <li key={idx} className="hover:text-white transition-colors cursor-pointer">{player}</li>
            )) : <li className="text-neutral-500">لا يوجد حراس</li>}
          </ul>
        </div>

      </div>

      {/* Bottom Section: Logo and Disclaimer */}
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center pt-10">
        
        {/* Logo */}
        <img 
          src={logoImage} 
          alt="Club Logo" 
          className="h-28 w-auto object-contain mb-6 drop-shadow-lg" 
        />

        {/* Slogan */}
        <h4 className="text-xl font-bold mb-8 leading-relaxed">
          شرف لك تلبس التوني ديال النادي<br />
          تعرڭو واجب عليك
        </h4>

      </div>
    </footer>
  );
}