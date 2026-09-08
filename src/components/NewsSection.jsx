import React, { useState, useEffect } from "react";
import { Calendar, ChevronLeft, Newspaper, X, Share2, Check } from "lucide-react";

export default function NewsSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [copied, setCopied] = useState(false); // To show feedback when link copied

  useEffect(() => {
    fetch("https://backend.mostakbalelmarsa.com/api/posts")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const validPosts = data.filter(
            (p) => p && typeof p.id === "number" && typeof p.title === "string"
          );
          setPosts(validPosts.slice(0, 3));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, []);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPost]);

  const getMediaUrl = (path) => {
    if (!path) return undefined;
    if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) {
      return path;
    }
    return `https://backend.mostakbalelmarsa.com${path}`;
  };

  // Share handler
  const handleShare = async (post) => {
    const shareUrl = `https://mostakbalelmarsa.com/news?post=${post.id}`; // In a real app, you'd have per-post URL
    const shareTitle = post.title;
    const shareText = post.content?.slice(0, 100) + "...";

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareTitle}\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Copy failed:", err);
        alert("تعذر نسخ الرابط. يرجى نسخه يدويًا: " + shareUrl);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
        جاري تحميل الأخبار...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-400 dark:text-neutral-500">
        <Newspaper size={40} className="mb-3 opacity-50" />
        <p className="text-lg font-medium">لا توجد أخبار حالياً.</p>
      </div>
    );
  }

  return (
    <section dir="rtl" className="w-full bg-neutral-50 dark:bg-neutral-950 py-16 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
            آخر الأخبار
          </h2>
          <a
            href="/news"
            className="text-[#2596be] font-bold text-sm hover:text-[#1a7192] transition-colors flex items-center gap-1"
          >
            عرض الكل
            <ChevronLeft size={18} className="transform" />
          </a>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const imageUrl = getMediaUrl(post.image);
            const publishDate = post.created_at
              ? new Date(post.created_at).toLocaleDateString("ar-MA")
              : "تاريخ غير محدد";

            return (
              <div
                key={post.id}
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Card Image with lazy loading */}
                <div
                  className="w-full h-48 bg-neutral-100 dark:bg-neutral-800 overflow-hidden relative flex items-center justify-center cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Newspaper size={32} className="text-neutral-300 dark:text-neutral-600" />
                  )}
                  {/* Date Badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Calendar size={11} />
                    {publishDate}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3
                    className="text-md font-bold mb-2 text-neutral-900 dark:text-neutral-100 line-clamp-2 cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    {post.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 flex-grow whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <span
                      className="text-[#2596be] font-bold text-sm flex items-center gap-1 cursor-pointer group-hover:text-[#1a7192] transition-colors"
                      onClick={() => setSelectedPost(post)}
                    >
                      اقرأ المزيد
                      <ChevronLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
                    </span>
                    {/* Share button on card */}
                    <button
                      onClick={() => handleShare(post)}
                      className="text-neutral-500 hover:text-[#2596be] dark:text-neutral-400 dark:hover:text-[#2596be] transition-colors p-1 rounded-full"
                      title="مشاركة"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Reading Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 transition-opacity">
          {/* Modal Background Click to Close */}
          <div className="absolute inset-0" onClick={() => setSelectedPost(null)}></div>

          {/* Modal Content */}
          <div className="bg-white dark:bg-neutral-900 w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Close and Share Buttons */}
            <div className="absolute top-4 left-4 flex gap-2 z-20">
              <button
                onClick={() => handleShare(selectedPost)}
                className="bg-black/50 text-white rounded-full p-2 hover:bg-[#2596be] transition-colors shadow-lg"
                title="مشاركة"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-black/50 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                title="إغلاق"
              >
                <X size={18} />
              </button>
            </div>

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
                  <span>
                    نُشر في:{" "}
                    {new Date(selectedPost.created_at).toLocaleDateString("ar-MA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
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

      {/* Copied feedback toast */}
      {copied && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Check size={16} className="text-green-400" />
          تم نسخ الرابط بنجاح
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
    </section>
  );
}