import React, { useState, useEffect } from "react";
import { Languages, ShoppingBag, Store, ShieldCheck, Shield, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logoImage from "../assets/logoMostakhbal.png";

const NAV_LINKS = [
  { name: "الترتيب", path: "/standings" },
  { name: "الماتشات", path: "/" },
  { name: "الفرقة", path: "/players" },
  { name: "التاريخ", path: "/history" },
  { name: "الحانوت", path: "/store" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Explicit dark mode toggle state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-[#2596be] dark:bg-neutral-900 text-white w-full font-sans fixed top-0 left-0 right-0 z-50 shadow-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left cluster: Theme Toggle, Language, Admin & Shop */}
        <div className="flex items-center gap-2.5 order-1">
          {/* Light/Dark Mode Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="تغيير المظهر"
            title={darkMode ? "التحويل إلى الوضع الفاتح" : "التحويل إلى الوضع المظلم"}
            className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 text-[#2596be] dark:text-amber-400 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shadow-sm"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Admin Link Button */}
          <Link
            to="/admin/login"
            aria-label="لوحة التحكم"
            title="لوحة التحكم"
            className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 text-[#2596be] dark:text-neutral-200 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shadow-sm"
          >
            <ShieldCheck size={17} />
          </Link>

          <button
            aria-label="تغيير اللغة"
            className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 text-[#2596be] dark:text-neutral-200 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <Languages size={16} />
          </button>
          
          {/* Cart Button */}
          <Link 
            to="/cart" 
            className="hidden sm:flex items-center gap-2 bg-white dark:bg-neutral-800 text-[#2596be] dark:text-neutral-200 rounded-full px-4 py-2 text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors relative"
          >
            <ShoppingBag size={16} />
            السلة
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 order-2 text-sm font-medium">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-white/90 hover:text-white transition-colors ${item.path === '/store' ? 'hidden lg:block' : ''}`}
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

        {/* Mobile menu toggle & Mobile Cart Badge */}
        <div className="md:hidden order-2 flex items-center gap-3">
          <Link to="/cart" className="relative text-white p-1">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-sm font-medium border border-white/40 rounded-lg px-3 py-1.5"
          >
            القائمة
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-3 px-4 pb-4 pt-2 text-sm font-medium bg-[#2596be] dark:bg-neutral-900 border-t border-white/10 transition-colors">
          {NAV_LINKS.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              onClick={() => setMenuOpen(false)} 
              className="text-white/90 hover:text-white py-1 flex items-center gap-2"
            >
              {item.path === '/store' && <Store size={16} />}
              {item.path === '/players' && <Shield size={16} />}
              {item.name}
            </Link>
          ))}
          <Link 
            to="/admin/login" 
            onClick={() => setMenuOpen(false)} 
            className="text-white/90 hover:text-white py-1 flex items-center gap-2 border-t border-white/10 pt-2 mt-1"
          >
            <ShieldCheck size={16} />
            لوحة التحكم (الإدارة)
          </Link>
        </nav>
      )}
    </header>
  );
}