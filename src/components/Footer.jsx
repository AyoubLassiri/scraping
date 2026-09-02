import React from "react";
import { Trophy, Shield, Medal, Star } from "lucide-react";
import logoImage from "../assets/logoMostakhbal.png";

const TROPHIES = [
  { id: 1, icon: Trophy, count: 22 },
  { id: 2, icon: Shield, count: 9 },
  { id: 3, icon: Medal, count: 3 },
  { id: 4, icon: Trophy, count: 1 },
  { id: 5, icon: Shield, count: 1 },
  { id: 6, icon: Medal, count: 1 },
];

const ROSTER = {
  forwards: ["تيمبينكوسي لورش", "زهير مترجي", "محمد رايحي", "توميسانغ أوريبوني", "نور الدين أمرابط", "وليد ناسي", "حمزة هنوري", "حمزة الواسطي"],
  midfielders: ["وليد صبار", "أرتور", "عبد الغفور لعميرات", "ريان محقو", "حكيم زياش", "أسامة الزمراوي", "ستيفان عزيز كي", "جوزيف باكاسو", "بيدرينهو"],
  defenders: ["محمد مفيد", "أمين أبو الفتح", "كيليرمي", "بدر بانون", "أيوب بوشتة", "محمد بوشواري"],
  goalkeepers: ["يوسف المطيع", "عبد العالي محمدي", "المهدي ابنعبيد"],
};

export default function Footer() {
  return (
    <footer dir="rtl" className="w-full bg-gradient-to-b from-[#2596be] via-neutral-900 to-neutral-950 text-white font-sans pt-12 pb-8">
      
      {/* Top Section: Trophies */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
          تاريخ من الأمجاد والألقاب البطولية
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {TROPHIES.map((trophy) => (
            <div key={trophy.id} className="flex flex-col items-center">
              <div className="border border-white/30 rounded-t-sm rounded-b-xl p-3 mb-2 flex items-center justify-center bg-white/5">
                <trophy.icon size={28} className="text-[#eab308]" />
              </div>
              <span className="font-bold text-lg">{trophy.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Section: Player Columns */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-right mb-16 pt-12">
        
        <div>
          <h3 className="text-[#eab308] font-bold text-lg mb-4">الهجوم</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            {ROSTER.forwards.map((player, idx) => (
              <li key={idx} className="hover:text-white transition-colors cursor-pointer">{player}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[#eab308] font-bold text-lg mb-4">الميليو</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            {ROSTER.midfielders.map((player, idx) => (
              <li key={idx} className="hover:text-white transition-colors cursor-pointer">{player}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[#eab308] font-bold text-lg mb-4">المدافعين</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            {ROSTER.defenders.map((player, idx) => (
              <li key={idx} className="hover:text-white transition-colors cursor-pointer">{player}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[#eab308] font-bold text-lg mb-4">الكوال</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            {ROSTER.goalkeepers.map((player, idx) => (
              <li key={idx} className="hover:text-white transition-colors cursor-pointer">{player}</li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Section: Logo and Disclaimer */}
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center pt-10">
        
        {/* Stars */}
        <div className="flex gap-1 text-[#eab308] mb-4">
          <Star size={20} fill="currentColor" />
          <Star size={20} fill="currentColor" />
        </div>

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

        {/* Disclaimer Text */}
        <div className="text-neutral-400 text-xs sm:text-sm space-y-2 max-w-2xl">
          <p>
            هاد السيت مصاوبو ومجيريه واحد الودادي (بحالك غالبا). السيت ماعندو حتا علاقة مع الشركة ولا الجمعية ديال نادي مستقبل المرسى.
          </p>
          <p className="opacity-50">------</p>
          <p>
            شكرا لـ Page Onze و 11M11 ولأي واحد ساهم من قريب ولا بعيد فهاد السيت.
          </p>
          <p>
            يلا عندك شي ملاحظة ولابغيتي ستون باغي تبارطاجيه، تقدر تصيفط ليا مايل هنا: <a href="mailto:contact@cmel.net" className="text-[#2596be] hover:underline">contact@cmel.net</a>
          </p>
        </div>

      </div>
    </footer>
  );
}