import React from "react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function History() {
  return (
    <section dir="rtl" className="w-full bg-white dark:bg-neutral-900 py-16 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        
        {/* Section Title */}
        <h2 className="text-3xl font-medium text-[#2596be] dark:text-sky-400 mb-10 text-center w-full">
          التاريخ
        </h2>

        {/* History Text (Aligned Right) */}
        <div className="w-full text-neutral-800 dark:text-neutral-200 text-lg md:text-xl leading-relaxed space-y-6 mb-10 font-medium text-right">
          <p>
            نادي مستقبل المرسى الرياضي هو فخر المنطقة ورمز الرياضة المحلية في مدينة العيون، حيث تأسس بهدف تأطير الشباب وتطوير كرة القدم المحلية وتمثيل المدينة بأفضل حلة.
          </p>
          <p>
            يمتاز الفريق بألوانه المميزة وروح القتالية العالية للاعبي وجماهير النادي، مع حضور قوي ودعم مستمر في كل المباريات والمنافسات المحلية والجهوية.
          </p>
          <p>
            تأسس النادي بفضل جهود ثلة من الغيورين والمؤسسين الأبطال، على رأسهم المرحوم بدر المساوي، ليكون منصة حقيقية لصقل المواهب الكروية الشابة وإعطاء الإشعاع الرياضي للمنطقة.
          </p>
        </div>

        {/* Bottom Button */}
        <Link to="/history" className="relative z-10 flex items-center gap-2 bg-[#2596be] dark:bg-sky-600 text-white px-8 py-3 rounded-lg font-bold text-base hover:bg-[#1e7b9e] dark:hover:bg-sky-500 transition-colors shadow-sm mt-4 w-fit cursor-pointer">
          <BookOpen size={20} />
          التاريخ الكامل
        </Link>
        
      </div>
    </section>
  );
}