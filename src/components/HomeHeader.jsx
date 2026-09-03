import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import heroImage from "../assets/championsheroimage.jpg";
import logoMostakhbal from "../assets/logoMostakhbal.png";

function TeamBadge({ initials, logoLight, logoDark, big }) {
  const isPlaceholder = (!logoLight && !logoDark) || initials === "OPP";

  return (
    <div
      className={`${
        big ? "w-16 h-16 text-lg" : "w-14 h-14 text-base"
      } rounded-full bg-white dark:bg-neutral-800 border-2 border-[#2596be] dark:border-sky-500 flex items-center justify-center font-bold text-[#2596be] dark:text-sky-400 shadow-sm shrink-0 overflow-hidden transition-colors`}
    >
      {!isPlaceholder ? (
        <>
          {/* Light Mode Logo */}
          <img
            src={logoLight}
            alt={initials}
            className="w-full h-full object-contain p-1 dark:hidden"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Dark Mode Logo */}
          <img
            src={logoDark}
            alt={initials}
            className="w-full h-full object-contain p-1 hidden dark:block"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </>
      ) : null}
      <span style={{ display: !isPlaceholder && logoLight ? 'none' : 'flex' }}>
        {initials}
      </span>
    </div>
  );
}

export default function HomeHeader() {
  const [lastMatch, setLastMatch] = useState({
    homeTeam: "نادي مستقبل المرسى",
    homeInitials: "CMM",
    homeLogoLight: "https://cdn.phototourl.com/free/2026-09-02-75c3ccb6-f7bf-4c50-92cc-33bba9d26a6f.png",
    awayTeam: "خصم الجولة",
    awayInitials: "OPP",
    awayLogoLight: "",
    score: "قريبا",
    date: "البطولة الوطنية هواة"
  });

  const [nextMatch, setNextMatch] = useState({
    homeTeam: "نادي مستقبل المرسى",
    homeInitials: "CMM",
    homeLogoLight: "https://cdn.phototourl.com/free/2026-09-02-75c3ccb6-f7bf-4c50-92cc-33bba9d26a6f.png",
    awayTeam: "المنافس القادم",
    awayInitials: "OPP",
    awayLogoLight: "",
    date: "قريباً"
  });

  useEffect(() => {
    fetch('/matches.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const matchInfo = data[0];
          if (matchInfo.lastMatch) {
            const isPlaceholder = matchInfo.lastMatch.opponent.includes("خصم") || !matchInfo.lastMatch.opponentLogo;
            setLastMatch(prev => ({
              ...prev,
              score: matchInfo.lastMatch.score,
              awayTeam: matchInfo.lastMatch.opponent,
              awayInitials: matchInfo.lastMatch.opponentInitials,
              awayLogoLight: isPlaceholder ? "" : matchInfo.lastMatch.opponentLogo,
              date: matchInfo.lastMatch.date
            }));
          }
          if (matchInfo.nextMatch) {
            const isPlaceholder = matchInfo.nextMatch.opponent.includes("المنافس") || !matchInfo.nextMatch.opponentLogo;
            setNextMatch(prev => ({
              ...prev,
              awayTeam: matchInfo.nextMatch.opponent,
              awayInitials: matchInfo.nextMatch.opponentInitials,
              awayLogoLight: isPlaceholder ? "" : matchInfo.nextMatch.opponentLogo,
              date: matchInfo.nextMatch.date
            }));
          }
        }
      })
      .catch((err) => console.log('Using default club layout:', err));
  }, []);

  return (
    <div dir="rtl" className="w-full font-sans bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[420px] sm:h-[520px] overflow-hidden bg-neutral-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#2596be]/40 to-[#2596be]/70 dark:via-neutral-900/60 dark:to-neutral-950/90 transition-colors" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative h-full flex flex-col items-center justify-end text-center pb-12 px-4">
          <span className="inline-block bg-[#2596be] dark:bg-sky-600 text-white text-sm sm:text-base font-semibold rounded-full px-5 py-2 mb-4 shadow-md">
            مرحباً بكم في الموقع غير الرسمي ديال
          </span>
          <h1 className="text-white text-3xl sm:text-5xl font-extrabold tracking-tight">
            نادي مستقبل المرسى العيون لكرة القدم
          </h1>
        </div>
      </section>

      {/* Match info strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="grid sm:grid-cols-2 gap-6">
          
          {/* Left Container: Last Match Result */}
          <div className="flex flex-col">
            <h2 className="text-center text-[#2596be] dark:text-sky-400 text-xl sm:text-2xl font-bold pb-4">
              النتيجة الأخيرة
            </h2>
            <div className="relative bg-[#2596be] dark:bg-neutral-900 rounded-2xl shadow-md h-40 flex flex-col items-center justify-center gap-3 overflow-hidden border border-transparent dark:border-neutral-800 transition-colors">
              <div
                aria-hidden="true"
                className="absolute -right-10 -bottom-10 w-52 h-52 rounded-full border-[18px] border-white/10 dark:border-white/5"
              />
              <p className="relative text-white/90 dark:text-neutral-300 text-xs sm:text-sm font-medium">
                {lastMatch.date}
              </p>
              <div className="relative flex items-center justify-center gap-6 sm:gap-10">
                <div className="flex flex-col items-center gap-2">
                  <TeamBadge 
                    initials={lastMatch.homeInitials} 
                    logoLight={lastMatch.homeLogoLight} 
                    logoDark={logoMostakhbal} 
                    big 
                  />
                  <span className="text-white dark:text-neutral-100 text-sm font-semibold">
                    {lastMatch.homeTeam}
                  </span>
                </div>
                <span className="text-white dark:text-sky-300 text-3xl sm:text-4xl font-extrabold">
                  {lastMatch.score}
                </span>
                <div className="flex flex-col items-center gap-2">
                  <TeamBadge 
                    initials={lastMatch.awayInitials} 
                    logoLight={lastMatch.awayLogoLight} 
                    logoDark={lastMatch.awayLogoLight} 
                    big 
                  />
                  <span className="text-white dark:text-neutral-100 text-sm font-semibold">
                    {lastMatch.awayTeam}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Container: Next Match */}
          <div className="flex flex-col">
            <h2 className="text-center text-[#2596be] dark:text-sky-400 text-xl sm:text-2xl font-bold pb-4">
              المباراة القادمة
            </h2>
            <div className="relative bg-[#2596be] dark:bg-neutral-900 rounded-2xl shadow-md h-40 flex flex-col items-center justify-center gap-3 overflow-hidden border border-transparent dark:border-neutral-800 transition-colors">
              <div
                aria-hidden="true"
                className="absolute -left-10 -bottom-10 w-52 h-52 rounded-full border-[18px] border-white/10 dark:border-white/5"
              />
              <p className="relative text-white/90 dark:text-neutral-300 text-xs sm:text-sm font-medium">
                {nextMatch.date}
              </p>
              <div className="relative flex items-center justify-center gap-6 sm:gap-10">
                <div className="flex flex-col items-center gap-2">
                  <TeamBadge 
                    initials={nextMatch.homeInitials} 
                    logoLight={nextMatch.homeLogoLight} 
                    logoDark={logoMostakhbal} 
                    big 
                  />
                  <span className="text-white dark:text-neutral-100 text-sm font-semibold">
                    {nextMatch.homeTeam}
                  </span>
                </div>
                <span className="text-white dark:text-sky-300 text-xl sm:text-2xl font-extrabold px-3 py-1 bg-white/20 dark:bg-neutral-800/80 rounded-lg">
                  VS
                </span>
                <div className="flex flex-col items-center gap-2">
                  <TeamBadge 
                    initials={nextMatch.awayInitials} 
                    logoLight={nextMatch.awayLogoLight} 
                    logoDark={nextMatch.awayLogoLight} 
                    big 
                  />
                  <span className="text-white dark:text-neutral-100 text-sm font-semibold">
                    {nextMatch.awayTeam}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}