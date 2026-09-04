import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import logoImage from "../assets/logoMostakhbal.png";
import { Calendar, ChevronLeft, X, Newspaper } from "lucide-react";

export default function NewsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, []);

  const getMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return path;
    return `http://localhost:5000${path}`;
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedPost]);

  return (
    <div dir="rtl" className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pt-16">
      
      {/* Shared Navbar */}
      <Navbar />

      {/* Page Title Header Banner */}
      <div className="bg-[#2596be] dark:bg-neutral-900 text-white py-12 px-4 shadow-md relative overflow-hidden transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <img src={logoImage} alt="Club Logo" className="h-20 w-auto mb-4 object-contain drop-shadow-lg" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            أخبار النادي
          </h1>
          <p className="mt-2 text-white/90 text-sm sm:text-base font-medium">
            آخر مستجدات وأخبار مستقبل المرسى
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-20 text-neutral-500 dark:text-neutral-400">
            جاري تحميل الأخبار...
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400 dark:text-neutral-500">
            <Newspaper size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">لا توجد أخبار منشورة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer group"
                onClick={() => setSelectedPost(post)}
              >
                {/* Card Image */}
                <div className="w-full h-56 bg-neutral-100 dark:bg-neutral-800 overflow-hidden relative flex items-center justify-center">
                  {post.image ? (
                    <img 
                      src={getMediaUrl(post.image)} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <Newspaper size={40} className="text-neutral-300 dark:text-neutral-600" />
                  )}
                  {/* Date Badge Overlay */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Calendar size={12} />
                    {new Date(post.created_at).toLocaleDateString("ar-MA")}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-3 text-neutral-900 dark:text-neutral-100 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-6 flex-grow whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                  
                  {/* Read More Button */}
                  <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                    <span className="text-[#2596be] font-bold text-sm flex items-center gap-1 group-hover:text-[#1a7192] transition-colors">
                      اقرأ المزيد <ChevronLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Reading Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 transition-opacity">
          {/* Modal Background Click to Close */}
          <div className="absolute inset-0" onClick={() => setSelectedPost(null)}></div>
          
          {/* Modal Content */}
          <div className="bg-white dark:bg-neutral-900 w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPost(null)} 
              className="absolute top-4 left-4 bg-black/50 text-white rounded-full p-2 hover:bg-red-600 transition-colors z-20 shadow-lg"
            >
              <X size={20} />
            </button>

            {/* Scrollable Area */}
            <div className="overflow-y-auto flex-grow custom-scrollbar">
              {selectedPost.image && (
                <img 
                  src={getMediaUrl(selectedPost.image)} 
                  alt={selectedPost.title} 
                  className="w-full h-64 md:h-96 object-cover" 
                />
              )}
              
              <div className="p-6 md:p-10">
                <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-5 font-medium">
                  <Calendar size={16} className="text-[#2596be]" />
                  <span>نُشر في: {new Date(selectedPost.created_at).toLocaleDateString("ar-MA", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-neutral-900 dark:text-neutral-100 leading-snug">
                  {selectedPost.title}
                </h2>
                
                <div className="text-neutral-700 dark:text-neutral-300 leading-loose whitespace-pre-wrap text-base md:text-lg font-medium">
                  {selectedPost.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #334155;
        }
      `}</style>
    </div>
  );
}