import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import logoImage from "../assets/logoMostakhbal.png";

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState({
    title: "التاريخ ديال نادي مستقبل المرسى الرياضي",
    sections: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/history")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          let parsedSections = [];
          
          if (data.sections) {
             // النظام الجديد (Dynamic Sections)
             parsedSections = typeof data.sections === "string" ? JSON.parse(data.sections) : data.sections;
          } else {
             // نظام التوافق للبيانات القديمة (Fallback)
             if (data.section1Text) parsedSections.push({ media: data.section1Image, caption: data.section1Caption, paragraphs: typeof data.section1Text === "string" ? JSON.parse(data.section1Text) : data.section1Text });
             if (data.section2Text) parsedSections.push({ media: data.section2Image, caption: data.section2Caption, paragraphs: typeof data.section2Text === "string" ? JSON.parse(data.section2Text) : data.section2Text });
             if (data.section3Text) parsedSections.push({ media: data.section3Media, caption: data.section3Caption, paragraphs: typeof data.section3Text === "string" ? JSON.parse(data.section3Text) : data.section3Text });
          }

          setHistoryData({
            title: data.title || "تاريخ نادي مستقبل المرسى الرياضي",
            sections: Array.isArray(parsedSections) ? parsedSections : []
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Using default history content fallback:", err);
        setLoading(false);
      });
  }, []);

  const getMediaUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) {
      return path;
    }
    return `http://localhost:5000${path}`;
  };

  const isVideoFile = (url) => {
    if (!url) return false;
    return url.endsWith(".mp4") || url.includes("video") || url.includes("mp4");
  };

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
        {loading ? (
          <div className="text-center py-20 text-neutral-500 dark:text-neutral-400">جاري تحميل التاريخ...</div>
        ) : historyData.sections.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 dark:text-neutral-400">لا توجد بيانات متاحة حالياً.</div>
        ) : (
          historyData.sections.map((section, index) => {
            // تحديد الاتجاه لعكس تخطيط الصفحة بين يمين ويسار تلقائياً
            const isReverse = index % 2 !== 0;

            return (
              <div key={index} className="grid md:grid-cols-12 gap-8 items-center">
                
                {/* قسم النصوص */}
                <div className={`md:col-span-7 text-neutral-800 dark:text-neutral-200 text-lg leading-relaxed space-y-4 font-medium text-right order-2 ${isReverse ? 'md:order-2' : 'md:order-1'}`}>
                  {Array.isArray(section.paragraphs) && section.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>

                {/* قسم الوسائط (صورة أو فيديو) */}
                <div className={`md:col-span-5 rounded-2xl overflow-hidden shadow-lg border-2 border-[#2596be]/20 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 p-2 order-1 w-full mx-auto transition-colors ${isReverse ? 'md:order-1' : 'md:order-2'}`}>
                  {isVideoFile(section.media) ? (
                    <video 
                      src={getMediaUrl(section.media)} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-72 md:h-96 object-contain rounded-xl"
                    />
                  ) : (
                    <img 
                      src={getMediaUrl(section.media)} 
                      alt={`Historical Content ${index + 1}`} 
                      className="w-full h-72 md:h-96 object-cover rounded-xl"
                    />
                  )}
                  {section.caption && (
                    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
                      {section.caption}
                    </p>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}