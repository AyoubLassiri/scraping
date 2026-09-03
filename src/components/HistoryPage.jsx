import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import logoImage from "../assets/logoMostakhbal.png";
import fallbackPresident from "../assets/president.jpg";
import fallbackDirector from "../assets/director.jpg";
import fallbackVideo from "../assets/visitvideo.mp4";

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState({
    title: "التاريخ ديال نادي مستقبل المرسى الرياضي",
    section1Text: [
      "نادي مستقبل المرسى الرياضي هو فخر المنطقة ورمز الرياضة المحلية في مدينة العيون، حيث تأسس بهدف تأطير الشباب وتطوير كرة القدم المحلية وتمثيل المدينة بأفضل حلة.",
      "يمتاز الفريق بألوانه المميزة وروح القتالية العالية للاعبي وجماهير النادي، مع حضور قوي ودعم مستمر في كل المباريات والمنافسات المحلية والجهوية.",
      "تأسس النادي بفضل جهود ثلة من الغيورين والمؤسسين الأبطال، على رأسهم المرحوم بدر المساوي، ليكون منصة حقيقية لصقل المواهب الكروية الشابة وإعطاء الإشعاع الرياضي للمنطقة."
    ],
    section1Image: fallbackPresident,
    section1Caption: "بدر المساوي — المؤسس والرئيس الأول في تاريخ النادي",
    section2Text: [
      "عرف الفريق تطوراً ملحوظاً في مسيرته الرياضية بفضل العمل الجاد للإدارة والتقنيين، محققاً نتائج متميزة في مختلف المحطات والبطولات التي شارك فيها محلياً وجهوياً.",
      "وتواصل إدارة النادي والأطر التقنية العمل بخطى ثابتة من أجل تعزيز مكانة مستقبل المرسى، وتطوير البنية التحتية والفئات السنية لضمان مستقبل مشرق ومستدام لكرة القدم المحلية."
    ],
    section2Image: fallbackDirector,
    section2Caption: "نائب رئيس الفريق",
    section3Text: [
      "يحمل تاريخ النادي في طياته العديد من اللحظات المبرمجة والمباريات الحماسية التي جمعته بأبرز الأندية، مما يعكس الشغف الكبير والروح الرياضية التي تسود أجواء الفريق.",
      "تبقى هذه المحطات والذكريات محفورة في أذهان الأنصار واللاعبين، تشكل حافزاً مستمراً لبذل المزيد من الجهد وتحقيق الطموحات الكبيرة المستقبلية لمستقبل المرسى."
    ],
    section3Media: fallbackVideo,
    section3Caption: "أرشيف"
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/history")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setHistoryData((prev) => ({
            ...prev,
            ...data,
            section1Text: typeof data.section1Text === "string" ? JSON.parse(data.section1Text) : (data.section1Text || prev.section1Text),
            section2Text: typeof data.section2Text === "string" ? JSON.parse(data.section2Text) : (data.section2Text || prev.section2Text),
            section3Text: typeof data.section3Text === "string" ? JSON.parse(data.section3Text) : (data.section3Text || prev.section3Text),
          }));
        }
      })
      .catch((err) => {
        console.log("Using default history content fallback:", err);
      });
  }, []);

  return (
    <div dir="rtl" className="w-full min-h-screen bg-white dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pt-16">
      
      {/* Shared Navbar */}
      <Navbar />

      {/* Page Title Header Banner */}
      <div className="bg-[#2596be] dark:bg-neutral-900 text-white py-12 px-4 shadow-md relative overflow-hidden transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <img src={logoImage} alt="Club Logo" className="h-20 w-auto mb-4 object-contain" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {historyData.title}
          </h1>
        </div>
      </div>

      {/* Main Content Sections with Interspersed Media */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        
        {/* Section 1: Foundation & Early Years */}
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 text-neutral-800 dark:text-neutral-200 text-lg leading-relaxed space-y-4 font-medium text-right order-2 md:order-1">
            {historyData.section1Text.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="md:col-span-5 rounded-2xl overflow-hidden shadow-lg border-2 border-[#2596be]/20 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 p-2 order-1 md:order-2 transition-colors">
            <img 
              src={historyData.section1Image} 
              alt="Historical figure" 
              className="w-full h-96 object-cover rounded-xl"
            />
            {historyData.section1Caption && (
              <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
                {historyData.section1Caption}
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Golden Era & Titles */}
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 rounded-2xl overflow-hidden shadow-lg border-2 border-[#2596be]/20 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 p-2 transition-colors">
            <img 
              src={historyData.section2Image} 
              alt="Historical Team" 
              className="w-full h-72 object-cover rounded-xl"
            />
            {historyData.section2Caption && (
              <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
                {historyData.section2Caption}
              </p>
            )}
          </div>

          <div className="md:col-span-7 text-neutral-800 dark:text-neutral-200 text-lg leading-relaxed space-y-4 font-medium text-right">
            {historyData.section2Text.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Section 3: Iconic Matches & International Recognition */}
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 text-neutral-800 dark:text-neutral-200 text-lg leading-relaxed space-y-4 font-medium text-right order-2 md:order-1">
            {historyData.section3Text.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="md:col-span-5 rounded-2xl overflow-hidden shadow-lg border-2 border-[#2596be]/20 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 p-2 order-1 md:order-2 w-fit mx-auto transition-colors">
            {historyData.section3Media && historyData.section3Media.endsWith('.mp4') ? (
              <video 
                src={historyData.section3Media} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-80 object-contain rounded-xl"
              />
            ) : (
              <img 
                src={historyData.section3Media} 
                alt="Archive media" 
                className="w-full h-80 object-cover rounded-xl"
              />
            )}
            {historyData.section3Caption && (
              <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
                {historyData.section3Caption}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}