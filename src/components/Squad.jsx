import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import playerOne from "../assets/playerone.png";
import playerTwo from "../assets/playertwo.png";
import playerThree from "../assets/playerthree.png";
import playerFour from "../assets/playerfour.png";

// Fallback mock data if API is empty
const DEFAULT_SQUAD = [
  { id: 1, name: "أمرابط", number: 11, image: playerOne },
  { id: 2, name: "المطيع", number: 1, image: playerTwo },
  { id: 3, name: "مفيد", number: 2, image: playerThree },
  { id: 4, name: "أرتور", number: 10, image: playerFour },
];

export default function Squad() {
  const [squadData, setSquadData] = useState(DEFAULT_SQUAD);

  useEffect(() => {
    fetch("http://localhost:5000/api/players")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Take top 4 players from the database for the home section preview
          const formatted = data.slice(0, 4).map((p) => ({
            id: p.id,
            name: p.name,
            number: p.number || "",
            image: p.image || playerOne,
          }));
          setSquadData(formatted);
        }
      })
      .catch((err) => {
        console.log("Using fallback static squad preview:", err);
      });
  }, []);

  return (
    <section dir="rtl" className="w-full bg-[#f9f9f9] dark:bg-neutral-950 py-12 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        
        {/* Section Title */}
        <h2 className="text-3xl font-medium text-[#2596be] dark:text-sky-400 mb-10">
          التشكيلة
        </h2>

        {/* Player Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-10">
          {squadData.map((player) => (
            <div 
              key={player.id} 
              className="rounded-xl overflow-hidden shadow-sm flex flex-col border border-transparent dark:border-neutral-700 transition-colors"
            >
              {/* Player Image Area with Consistent Gradient Background */}
              <div className="h-56 sm:h-72 relative flex items-end justify-center overflow-hidden bg-gradient-to-b from-[#1a6885] to-[#124b61]">
                <img 
                  src={player.image} 
                  alt={player.name} 
                  className="w-full h-full object-cover object-top translate-y-24 transition-transform duration-1000 ease-in-out hover:scale-75 hover:translate-y-4"
                />
              </div>

              {/* Player Info Bar */}
              <div className="bg-[#2596be] dark:bg-neutral-800 p-3 flex justify-between items-center text-white h-12 border-t border-white/10">
                <span className="font-bold text-sm sm:text-base">
                  {player.name}
                </span>
                {player.number && (
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-neutral-700 text-[#2596be] dark:text-sky-400 flex items-center justify-center text-xs font-bold shrink-0 shadow-inner">
                    {player.number}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Button */}
        <Link 
          to="/players" 
          className="flex items-center gap-2 bg-[#2596be] text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-[#1e7b9e] transition-colors shadow-sm"
        >
          <Users size={18} />
          التشكيلة الكاملة
        </Link>
        
      </div>
    </section>
  );
}