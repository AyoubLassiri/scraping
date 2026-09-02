import React, { useState, useEffect } from "react";
import { Calendar, List } from "lucide-react";

export default function Standings() {
  const [standingsData, setStandingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/standings.json')
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => {
          const nameParts = item.team_name.split(' ');
          const initials = nameParts[nameParts.length - 1].match(/[A-Z]+/)?.[0] || nameParts[0].substring(0, 3);
          
          return {
            rank: item.position,
            team: item.team_name,
            initials: initials,
            p: 0,
            w: 0,
            d: 0,
            l: 0,
            gf: 0,
            ga: 0,
            gd: "0",
            pts: 0
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
    <section dir="rtl" className="w-full bg-[#f9f9f9] py-10 font-sans">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
        
        {/* Top Button */}
        <button className="flex items-center gap-2 bg-[#2596be] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#1e7b9e] transition-colors mb-10 shadow-sm">
          <Calendar size={18} />
          الماتشات الكاملين
        </button>

        {/* Section Title */}
        <h2 className="text-3xl font-medium text-[#2596be] mb-8">
          ترتيب القسم الوطني هواة
        </h2>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-md bg-white shadow-sm border border-gray-100">
          {loading ? (
            <div className="text-center py-10 text-gray-500 font-medium">جاري تحميل الترتيب...</div>
          ) : (
            <table className="w-full text-center whitespace-nowrap border-collapse">
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-100">
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
                  const isMyTeam = row.team.includes("مستقبل المرسى") || row.team.includes("مستقبل العيون") || row.team.includes("الوداد");
                  return (
                    <tr
                      key={row.rank}
                      className={`transition-colors duration-150 ${
                        isMyTeam
                          ? "bg-[#2596be] text-white font-bold hover:bg-[#1e7b9e]"
                          : row.rank % 2 === 0
                          ? "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                          : "bg-white text-neutral-800 hover:bg-neutral-100"
                      }`}
                    >
                      <td className="py-3">{row.rank}</td>
                      <td className="py-3 text-right pr-4 flex items-center gap-3">
                        <div
                          className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isMyTeam
                              ? "bg-white text-[#2596be]"
                              : "bg-neutral-200 text-neutral-600"
                          }`}
                        >
                          {row.initials}
                        </div>
                        {row.team}
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
        <button className="flex items-center gap-2 bg-[#2596be] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#1e7b9e] transition-colors mt-8 shadow-sm">
          <List size={18} />
          الترتيب الكامل
        </button>
        
      </div>
    </section>
  );
}