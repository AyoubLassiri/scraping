import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import heroImage from "../assets/championsheroimage.jpg";

function TeamBadge({ initials, big }) {
  return (
    <div
      className={`${
        big ? "w-16 h-16 text-lg" : "w-14 h-14 text-base"
      } rounded-full bg-white border-2 border-[#2596be] flex items-center justify-center font-bold text-[#2596be] shadow-sm shrink-0`}
    >
      {initials}
    </div>
  );
}

export default function HomeHeader() {
  const [lastMatch, setLastMatch] = useState({
    homeTeam: "نادي مستقبل المرسى",
    homeInitials: "CMM",
    awayTeam: "خصم الجولة",
    awayInitials: "OPP",
    score: "قريبا",
    date: "البطولة الوطنية هواة"
  });

  const [nextMatch, setNextMatch] = useState({
    homeTeam: "نادي مستقبل المرسى",
    homeInitials: "CMM",
    awayTeam: "المنافس القادم",
    awayInitials: "OPP",
    date: "قريباً"
  });

  useEffect(() => {
    fetch('/matches.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const matchInfo = data[0];
          if (matchInfo.lastMatch) {
            setLastMatch(prev => ({
              ...prev,
              score: matchInfo.lastMatch.score,
              awayTeam: matchInfo.lastMatch.opponent,
              awayInitials: matchInfo.lastMatch.opponentInitials,
              date: matchInfo.lastMatch.date
            }));
          }
          if (matchInfo.nextMatch) {
            setNextMatch(prev => ({
              ...prev,
              awayTeam: matchInfo.nextMatch.opponent,
              awayInitials: matchInfo.nextMatch.opponentInitials,
              date: matchInfo.nextMatch.date
            }));
          }
        }
      })
      .catch((err) => console.log('Using default club layout:', err));
  }, []);

  return (
    <div dir="rtl" className="w-full font-sans bg-neutral-50 text-neutral-900">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[420px] sm:h-[520px] overflow-hidden bg-neutral-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#2596be]/40 to-[#2596be]/70" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative h-full flex flex-col items-center justify-end text-center pb-12 px-4">
          <span className="inline-block bg-[#2596be] text-white text-sm sm:text-base font-semibold rounded-full px-5 py-2 mb-4">
            مرحباً بكم في السبيت غير الرسمي ديال
          </span>
          <h1 className="text-white text-3xl sm:text-5xl font-extrabold">
            نادي مستقبل المرسى العيون لكرة القدم
          </h1>
        </div>
      </section>

      {/* Match info strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="grid sm:grid-cols-2 gap-6">
          
          {/* Left Container: Last Match Result */}
          <div className="flex flex-col">
            <h2 className="text-center text-[#2596be] text-xl sm:text-2xl font-bold pb-4">
              النتيجة الأخيرة
            </h2>
            <div className="relative bg-[#2596be] rounded-2xl shadow-md h-40 flex flex-col items-center justify-center gap-3 overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute -right-10 -bottom-10 w-52 h-52 rounded-full border-[18px] border-white/10"
              />
              <p className="relative text-white/85 text-xs sm:text-sm font-medium">
                {lastMatch.date}
              </p>
              <div className="relative flex items-center justify-center gap-6 sm:gap-10">
                <div className="flex flex-col items-center gap-2">
                  <TeamBadge initials={lastMatch.homeInitials} big />
                  <span className="text-white text-sm font-semibold">
                    {lastMatch.homeTeam}
                  </span>
                </div>
                <span className="text-white text-3xl sm:text-4xl font-extrabold">
                  {lastMatch.score}
                </span>
                <div className="flex flex-col items-center gap-2">
                  <TeamBadge initials={lastMatch.awayInitials} big />
                  <span className="text-white text-sm font-semibold">
                    {lastMatch.awayTeam}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Container: Next Match */}
          <div className="flex flex-col">
            <h2 className="text-center text-[#2596be] text-xl sm:text-2xl font-bold pb-4">
              المباراة القادمة
            </h2>
            <div className="relative bg-[#2596be] rounded-2xl shadow-md h-40 flex flex-col items-center justify-center gap-3 overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute -left-10 -bottom-10 w-52 h-52 rounded-full border-[18px] border-white/10"
              />
              <p className="relative text-white/85 text-xs sm:text-sm font-medium">
                {nextMatch.date}
              </p>
              <div className="relative flex items-center justify-center gap-6 sm:gap-10">
                <div className="flex flex-col items-center gap-2">
                  <TeamBadge initials={nextMatch.homeInitials} big />
                  <span className="text-white text-sm font-semibold">
                    {nextMatch.homeTeam}
                  </span>
                </div>
                <span className="text-white text-xl sm:text-2xl font-extrabold px-3 py-1 bg-white/20 rounded-lg">
                  VS
                </span>
                <div className="flex flex-col items-center gap-2">
                  <TeamBadge initials={nextMatch.awayInitials} big />
                  <span className="text-white text-sm font-semibold">
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