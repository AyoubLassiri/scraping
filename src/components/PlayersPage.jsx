import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Shield, Users, Award, UserCheck, Briefcase } from "lucide-react";

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("players"); // players | staff
  const [selectedPosition, setSelectedPosition] = useState("الكل");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/players").then((res) => res.json()),
      fetch("http://localhost:5000/api/staff").then((res) => res.json()),
    ])
      .then(([playersData, staffData]) => {
        setPlayers(Array.isArray(playersData) ? playersData : []);
        setStaffList(Array.isArray(staffData) ? staffData : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const positions = ["الكل", "حارس مرمى", "مدافع", "وسط ميدان", "مهاجم"];

  const filteredPlayers = selectedPosition === "الكل" 
    ? players 
    : players.filter(p => p.position === selectedPosition);

  return (
    <div dir="rtl" className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-[#2596be] selection:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Modern Stadium Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1c789a] via-[#2596be] to-[#3aaede] text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-lg border border-white/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md w-fit px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border border-white/30 text-white">
              <Shield size={16} className="text-white" />
              الموسم الرياضي الرسمي 2026
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">عائلة نادي مستقبل المرسى</h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed">
              تعرف عن قرب على تشكيلة الأبطال من لاعبين وأطر تقنية وإدارية الذين يحملون قميص وراية النادي بكل فخر واعتزاز.
            </p>
          </div>

          <div className="relative z-10 flex gap-4">
            <div className="bg-white/15 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/25 text-center shadow-sm">
              <span className="block text-2xl font-black text-white">{players.length}</span>
              <span className="text-[11px] text-white/90 font-medium">اللاعبين</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/25 text-center shadow-sm">
              <span className="block text-2xl font-black text-white">{staffList.length}</span>
              <span className="text-[11px] text-white/90 font-medium">الطاقم</span>
            </div>
          </div>
        </div>

        {/* Section Switcher Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-neutral-900 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex gap-2 shadow-sm transition-colors">
            <button
              onClick={() => setActiveTab("players")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "players"
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <Users size={16} />
              التشكيلة الرسمية للاعبين
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "staff"
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <Briefcase size={16} />
              الطاقم التقني والإداري
            </button>
          </div>
        </div>

        {/* Filters if Players Tab is active */}
        {activeTab === "players" && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 justify-start sm:justify-center">
            {positions.map((pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPosition(pos)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedPosition === pos 
                    ? "bg-[#2596be] text-white shadow-md scale-105" 
                    : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Grid */}
        {loading ? (
          <div className="text-center py-28 text-neutral-400 text-sm animate-pulse">جاري تحميل بيانات الفريق...</div>
        ) : activeTab === "players" ? (
          filteredPlayers.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-16 text-center text-neutral-400 text-sm shadow-sm">
              لا يوجد لاعبيـن مسجلين في هذا المركز حالياً.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPlayers.map((player) => (
                <div 
                  key={player.id} 
                  className="group relative bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Card Header Graphics / Image */}
                  <div className="h-72 bg-neutral-100 dark:bg-neutral-850 relative overflow-hidden flex items-center justify-center">
                    {player.image ? (
                      <img 
                        src={player.image} 
                        alt={player.name} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <Users size={56} className="text-neutral-300 dark:text-neutral-700" />
                    )}

                    {/* Gradient Overlay for badges readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 via-transparent to-transparent"></div>

                    {/* Jersey Number Badge */}
                    {player.number && (
                      <span className="absolute top-4 right-4 bg-neutral-900/80 backdrop-blur-md text-white border border-white/20 text-xs font-black px-3 py-1 rounded-xl shadow-md flex items-center gap-1">
                        <span className="text-[#62d2fa]">#</span>{player.number}
                      </span>
                    )}

                    {/* Position Badge */}
                    <span className="absolute top-4 left-4 bg-[#2596be] backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-xl shadow-md uppercase tracking-wider">
                      {player.position}
                    </span>
                  </div>

                  {/* Player Info */}
                  <div className="p-5 flex flex-col flex-grow justify-between bg-white dark:bg-neutral-900">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-[#2596be] transition-colors mb-1">{player.name}</h3>
                      {player.description && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-2 leading-relaxed">{player.description}</p>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                      <span>مستقبل المرسى</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          staffList.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-16 text-center text-neutral-400 text-sm shadow-sm">
              لا يوجد أعضاء طاقم مسجلين حالياً.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {staffList.map((staff) => (
                <div 
                  key={staff.id} 
                  className="group relative bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-64 bg-neutral-100 dark:bg-neutral-850 relative overflow-hidden flex items-center justify-center">
                    {staff.image ? (
                      <img 
                        src={staff.image} 
                        alt={staff.name} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <UserCheck size={52} className="text-neutral-300 dark:text-neutral-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 via-transparent to-transparent"></div>
                    
                    <span className="absolute top-4 left-4 bg-emerald-600 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-xl shadow-md">
                      {staff.role}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between bg-white dark:bg-neutral-900">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 transition-colors mb-1">{staff.name}</h3>
                      {staff.description && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-2 leading-relaxed">{staff.description}</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                      <span>الطاقم التقني</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>

      <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 py-8 text-center text-xs text-neutral-500 dark:text-neutral-400 mt-auto transition-colors">
        نادي مستقبل المرسى — جميع الحقوق محفوظة {new Date().getFullYear()}
      </footer>
    </div>
  );
}