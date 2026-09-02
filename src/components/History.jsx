import React from "react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function History() {
  return (
    <section dir="rtl" className="w-full bg-white py-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        
        {/* Section Title */}
        <h2 className="text-3xl font-medium text-[#2596be] mb-10 text-center w-full">
          التاريخ
        </h2>

        {/* History Text (Aligned Right) */}
        <div className="w-full text-neutral-800 text-lg md:text-xl leading-relaxed space-y-6 mb-10 font-medium text-right">
          <p>
            نادي الوداد الرياضي، لي معروف بالوداد البيضاوي ولا الوداد، واحد من أشهر وأعرق أندية المغرب. تأسس سنة 1937 في كازا، ومعروف بالمقاومة، الباصيون والأمجاد.
          </p>
          <p>
            النادي معروف بالألوان ديالو: الحمر والبيض. كايدخل ماتشاتو في ملعب محمد الخامس (دونور)، المعلب لي شهد علا بزاف ديال الماتشات والانجازات التاريخيا ديال الوداد.
          </p>
          <p>
            الوداد تأسس علا يد مجموعا ديال المفكرين والمقاومين الشباب في عهد الاستعمار الفرنسي في المغرب سنة 1937، لي كان بينهم المرحوم محمد بنجلون. النادي بدا بفريق الواتربولو قبل مايصايب لپير جيكو فرقة الكورة.
          </p>
        </div>

        {/* Bottom Button */}
        <Link to="/history" className="relative z-10 flex items-center gap-2 bg-[#2596be] text-white px-8 py-3 rounded-lg font-bold text-base hover:bg-[#1e7b9e] transition-colors shadow-sm mt-4 w-fit cursor-pointer">
          <BookOpen size={20} />
          التاريخ الكامل
        </Link>
        
      </div>
    </section>
  );
}