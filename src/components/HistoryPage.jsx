import React from "react";
import Navbar from "./Navbar";
import logoImage from "../assets/logoMostakhbal.png";
import playerOne from "../assets/president.jpg";
import playerTwo from "../assets/director.jpg";
import visitvideo from "../assets/visitvideo.mp4"

export default function HistoryPage() {
  return (
    <div dir="rtl" className="w-full min-h-screen bg-white font-sans text-neutral-900">
      
      {/* Shared Navbar */}
      <Navbar />

      {/* Page Title Header Banner */}
      <div className="bg-[#2596be] text-white py-12 px-4 shadow-md relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <img src={logoImage} alt="Club Logo" className="h-20 w-auto mb-4 object-contain" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            التاريخ ديال نادي مستقبل المرسى الرياضي
          </h1>
        </div>
      </div>

      {/* Main Content Sections with Interspersed Images */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        
        {/* Section 1: Foundation & Early Years (Text on Left, Image on Right) */}
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 text-neutral-800 text-lg leading-relaxed space-y-4 font-medium text-right order-2 md:order-1">
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

          <div className="md:col-span-5 rounded-2xl overflow-hidden shadow-lg border-2 border-[#2596be]/20 bg-neutral-100 p-2 order-1 md:order-2">
            <img 
              src={playerOne} 
              alt="Historical figure" 
              className="w-full h-96 object-cover rounded-xl"
            />
            <p className="text-center text-xs text-neutral-500 mt-2 font-medium">بدر المساوي — المؤسس والرئيس الأول في تاريخ النادي</p>
          </div>
        </div>

        {/* Section 2: Golden Era & Titles (Image on Left, Text on Right) */}
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 rounded-2xl overflow-hidden shadow-lg border-2 border-[#2596be]/20 bg-neutral-100 p-2">
            <img 
              src={playerTwo} 
              alt="Historical Team" 
              className="w-full h-72 object-cover rounded-xl"
            />
            <p className="text-center text-xs text-neutral-500 mt-2 font-medium">نائب رئيس الفريق</p>
          </div>

          <div className="md:col-span-7 text-neutral-800 text-lg leading-relaxed space-y-4 font-medium text-right">
            <p>
              عرف الفريق تطوراً ملحوظاً في مسيرته الرياضية بفضل العمل الجاد للإدارة والتقنيين، محققاً نتائج متميزة في مختلف المحطات والبطولات التي شارك فيها محلياً وجهوياً.
            </p>
            <p>
              وتواصل إدارة النادي والأطر التقنية العمل بخطى ثابتة من أجل تعزيز مكانة مستقبل المرسى، وتطوير البنية التحتية والفئات السنية لضمان مستقبل مشرق ومستدام لكرة القدم المحلية.
            </p>
          </div>
        </div>

        {/* Section 3: Iconic Matches & International Recognition (Text on Left, Image on Right) */}
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 text-neutral-800 text-lg leading-relaxed space-y-4 font-medium text-right order-2 md:order-1">
            <p>
              يحمل تاريخ النادي في طياته العديد من اللحظات المبرمجة والمباريات الحماسية التي جمعته بأبرز الأندية، مما يعكس الشغف الكبير والروح الرياضية التي تسود أجواء الفريق.
            </p>
            <p>
              تبقى هذه المحطات والذكريات محفورة في أذهان الأنصار واللاعبين، تشكل حافزاً مستمراً لبذل المزيد من الجهد وتحقيق الطموحات الكبيرة المستقبلية لمستقبل المرسى.
            </p>
          </div>

          <div className="md:col-span-5 rounded-2xl overflow-hidden shadow-lg border-2 border-[#2596be]/20 bg-neutral-100 p-2 order-1 md:order-2 w-fit mx-auto">
            <video 
              src={visitvideo} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-80 object-contain rounded-xl"
            />
            <p className="text-center text-xs text-neutral-500 mt-2 font-medium">أرشيف</p>
          </div>
        </div>

      </div>
    </div>
  );
}