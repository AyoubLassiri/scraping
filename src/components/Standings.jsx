import React, { useState, useEffect } from "react";
import { Calendar, List } from "lucide-react";

export default function Standings() {
  const [standingsData, setStandingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comprehensive logo mapping for all teams in the league
  const getDirectLogoUrl = (teamName) => {
    if (teamName.includes("آيت ملول")) return "https://howatpress.net/wp-content/uploads/2021/04/اتحاد-آيت-ملول-USMAM.jpg";
    if (teamName.includes("بركان")) return "https://upload.wikimedia.org/wikipedia/ar/thumb/8/8c/Renaissance_Sportive_de_Berkane_logo.svg/120px-Renaissance_Sportive_de_Berkane_logo.svg.png";
    if (teamName.includes("اليوسفية")) return "https://howatpress.net/wp-content/uploads/2023/10/default-team.png";
    if (teamName.includes("مراكش")) return "https://howatpress.net/wp-content/uploads/2023/10/default-team.png";
    if (teamName.includes("زيتونة")) return "https://howatpress.net/wp-content/uploads/2023/10/default-team.png";
    if (teamName.includes("الراسينغ")) return "https://upload.wikimedia.org/wikipedia/ar/thumb/2/22/Racing_Athletic_Club_%28Casablanca%29.png/120px-Racing_Athletic_Club_%28Casablanca%29.png";
    if (teamName.includes("السرغيني")) return "https://howatpress.net/wp-content/uploads/2023/10/default-team.png";
    if (teamName.includes("الشباب الرياضي")) return "https://howatpress.net/wp-content/uploads/2023/10/default-team.png";
    if (teamName.includes("المنصورية")) return "https://howatpress.net/wp-content/uploads/2023/10/default-team.png";
    if (teamName.includes("بني ملال")) return "https://upload.wikimedia.org/wikipedia/ar/thumb/5/5e/Raja_Beni_Mellal.png/120px-Raja_Beni_Mellal.png";
    if (teamName.includes("وادي زم")) return "https://upload.wikimedia.org/wikipedia/ar/thumb/3/36/Rapide_Club_de_Oued_Zem.png/120px-Rapide_Club_de_Oued_Zem.png";
    if (teamName.includes("الفتح البيضاوي")) return "https://howatpress.net/wp-content/uploads/2023/10/default-team.png";
    if (teamName.includes("هوارة")) return "https://howatpress.net/wp-content/uploads/2023/10/default-team.png";
    if (teamName.includes("آسا")) return "https://howatpress.net/wp-content/uploads/2023/10/default-team.png";
    if (teamName.includes("المرسى")) return "https://howatpress.net/wp-content/uploads/2023/10/default-team.png";
    return "";
  };

  useEffect(() => {
    fetch('/standings.json')
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => {
          const nameParts = item.team_name.split(' ');
          const cleanInitials = nameParts[nameParts.length - 1].replace(/[^a-zA-Z]/g, '') || nameParts[0].substring(0, 3);
          
          return {
            rank: item.position,
            team: item.team_name,
            logo: item.logo || getDirectLogoUrl(item.team_name),
            initials: cleanInitials.toUpperCase(),
            p: item.matches_played ?? item.p ?? 0,
            w: item.wins ?? item.w ?? 0,
            d: item.draws ?? item.d ?? 0,
            l: item.losses ?? item.l ?? 0,
            gf: item.goals_for ?? item.gf ?? 0,
            ga: item.goals_against ?? item.ga ?? 0,
            gd: item.goal_difference ?? item.gd ?? "0",
            pts: item.points ?? item.pts ?? 0
          };
        });
        setStandingsData(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading live standings:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section dir="rtl" className="w-full bg-[#f9f9f9] dark:bg-neutral-950 py-10 font-sans transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
        
        {/* Top Button */}
        <button className="flex items-center gap-2 bg-[#2596be] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#1e7b9e] transition-colors mb-10 shadow-sm">
          <Calendar size={18} />
          الماتشات الكاملين
        </button>

        {/* Section Title */}
        <h2 className="text-3xl font-medium text-[#2596be] dark:text-sky-400 mb-8">
          ترتيب القسم الوطني هواة
        </h2>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-md bg-white dark:bg-neutral-900 shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
          {loading ? (
            <div className="text-center py-10 text-gray-500 dark:text-neutral-400 font-medium">جاري تحميل الترتيب...</div>
          ) : (
            <table className="w-full text-center whitespace-nowrap border-collapse">
              <thead>
                <tr className="text-gray-500 dark:text-neutral-400 text-sm border-b border-gray-100 dark:border-neutral-800">
                  <th className="py-4 font-medium w-12">#</th>
                  <th className="py-4 font-medium text-right pr-4 min-w-[200px]">الفريق</th>
                  <th className="py-4 font-medium w-12">ل</th>
                  <th className="py-4 font-medium w-12">ف</th>
                  <th className="py-4 font-medium w-12">ت</th>
                  <th className="py-4 font-medium w-12">خ</th>
                  <th className="py-4 font-medium w-12">له</th>
                  <th className="py-4 font-medium w-12">عليه</th>
                  <th className="py-4 font-medium w-16">فارق</th>
                  <th className="py-4 font-medium w-16">نقاط</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {standingsData.slice(0, 30).map((row) => {
                  const isMyTeam = row.team.includes("مستقبل المرسى");
                  return (
                    <tr
                      key={row.rank}
                      className={`transition-colors duration-150 ${
                        isMyTeam
                          ? "bg-[#2596be] text-white font-bold hover:bg-[#1e7b9e]"
                          : row.rank % 2 === 0
                          ? "bg-neutral-100 dark:bg-neutral-850 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                          : "bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-850"
                      }`}
                    >
                      <td className="py-3">{row.rank}</td>
                      <td className="py-3 text-right pr-4 flex items-center gap-3">
                        <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                          {row.logo ? (
                            <img 
                              src={row.logo} 
                              alt={row.team} 
                              className="w-7 h-7 object-contain rounded-full"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          
                          <div 
                            style={{ display: row.logo ? 'none' : 'flex' }}
                            className={`w-8 h-8 shrink-0 rounded-full items-center justify-center text-[10px] font-bold shadow-sm ${
                              isMyTeam ? "bg-white text-[#2596be]" : "bg-[#2596be]/10 dark:bg-sky-500/10 text-[#2596be] dark:text-sky-400 border border-[#2596be]/20 dark:border-sky-500/20"
                            }`}
                          >
                            {row.initials}
                          </div>
                        </div>
                        <span>{row.team}</span>
                      </td>
                      <td className="py-3">{row.p}</td>
                      <td className="py-3">{row.w}</td>
                      <td className="py-3">{row.d}</td>
                      <td className="py-3">{row.l}</td>
                      <td className="py-3">{row.gf}</td>
                      <td className="py-3">{row.ga}</td>
                      <td className="py-3">{row.gd}</td>
                      <td className="py-3">{row.pts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Bottom Button */}
        <a 
          href="/standings" 
          className="flex items-center gap-2 bg-[#2596be] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#1e7b9e] transition-colors mt-8 shadow-sm"
        >
          <List size={18} />
          الترتيب الكامل
        </a>
        
      </div>
    </section>
  );
}