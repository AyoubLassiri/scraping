import React, { useState } from "react";
import { Languages, Store } from "lucide-react";
import { Link } from "react-router-dom";
import logoImage from "../assets/logoMostakhbal.png";

const NAV_LINKS = [
  { name: "الترتيب", path: "/" },
  { name: "الماتشات", path: "/" },
  { name: "الفرقة", path: "/" },
  { name: "الإنجازات", path: "/" },
  { name: "التاريخ", path: "/history" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#2596be] text-white w-full font-sans sticky top-0 z-50 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left cluster: Language & Shop */}
        <div className="flex items-center gap-3 order-1">
          <button
            aria-label="تغيير اللغة"
            className="w-9 h-9 rounded-full bg-white text-[#2596be] flex items-center justify-center hover:bg-neutral-100 transition-colors"
          >
            <Languages size={16} />
          </button>
          <button className="hidden sm:flex items-center gap-2 bg-white text-[#2596be] rounded-full px-4 py-2 text-sm font-semibold hover:bg-neutral-100 transition-colors">
            <Store size={16} />
            الحانوت
          </button>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 order-2 text-sm font-medium">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-white/90 hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <div className="order-3 flex items-center gap-2">
          <Link to="/">
            <img 
              src={logoImage} 
              alt="Club Logo" 
              className="h-12 sm:h-14 w-auto object-contain cursor-pointer" 
            />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden order-2 text-sm font-medium border border-white/40 rounded-lg px-3 py-1.5"
        >
          القائمة
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-3 px-4 pb-4 pt-2 text-sm font-medium bg-[#2596be] border-t border-white/10">
          {NAV_LINKS.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              onClick={() => setMenuOpen(false)} 
              className="text-white/90 hover:text-white py-1"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}