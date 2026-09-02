import React from "react";
import { Users } from "lucide-react";
import playerOne from "../assets/playerone.png";
import playerTwo from "../assets/playertwo.png";
import playerThree from "../assets/playerthree.png";
import playerFour from "../assets/playerfour.png";

// Mock data based on the provided image
const SQUAD_DATA = [
  { id: 1, name: "أمرابط", number: 11, image: playerOne },
  { id: 2, name: "المطيع", number: 1, image: playerTwo },
  { id: 3, name: "مفيد", number: 2, image: playerThree },
  { id: 4, name: "أرتور", number: 10, image: playerFour },
];

export default function Squad() {
  return (
    <section dir="rtl" className="w-full bg-[#f9f9f9] py-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        
        {/* Section Title */}
        <h2 className="text-3xl font-medium text-[#2596be] mb-10">
          التشكيلة
        </h2>

        {/* Player Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-10">
          {SQUAD_DATA.map((player) => (
            <div 
              key={player.id} 
              className="rounded-xl overflow-hidden shadow-sm flex flex-col bg-gradient-to-b from-[#1a6885] to-[#124b61]"
            >
              {/* Player Image Area */}
              <div className="h-56 sm:h-72 relative flex items-end justify-center overflow-hidden">
                <img 
                  src={player.image} 
                  alt={player.name} 
                  className="w-full h-full object-cover object-top translate-y-24 transition-transform duration-1000 ease-in-out hover:scale-75 hover:translate-y-4"
                />
              </div>

              {/* Player Info Bar */}
              <div className="bg-[#2596be] p-3 flex justify-between items-center text-white h-12">
                <span className="font-bold text-sm sm:text-base">
                  {player.name}
                </span>
                <div className="w-6 h-6 rounded-full bg-white text-[#2596be] flex items-center justify-center text-xs font-bold shrink-0 shadow-inner">
                  {player.number}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Button */}
        <button className="flex items-center gap-2 bg-[#2596be] text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-[#1e7b9e] transition-colors shadow-sm">
          <Users size={18} />
          التشكيلة الكاملة
        </button>
        
      </div>
    </section>
  );
}