import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Image as ImageIcon, UploadCloud } from "lucide-react";

export default function AdminHero() {
  const [currentImage, setCurrentImage] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://backend.mostakbalelmarsa.com/api/hero");
      const data = await res.json();
      setCurrentImage(data.image ? `https://backend.mostakbalelmarsa.com${data.image}` : null);
    } catch (err) {
      console.error(err);
      toast.error("فشل في تحميل صورة الواجهة الحالية");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("المرجو اختيار صورة أولاً");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("https://backend.mostakbalelmarsa.com/api/hero", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الرفع");

      toast.success("تم تحديث صورة الواجهة الرئيسية بنجاح");
      setCurrentImage(`https://backend.mostakbalelmarsa.com${data.image}`);
      setFile(null);
      setPreview(null);
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء الرفع");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors max-w-2xl">
      <h3 className="text-sm font-bold mb-4">صورة خلفية الواجهة الرئيسية</h3>

      {loading ? (
        <p className="text-neutral-400 text-xs">جاري التحميل...</p>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-2">الصورة الحالية</p>
            <div className="w-full h-48 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden flex items-center justify-center">
              {currentImage ? (
                <img src={currentImage} alt="الخلفية الحالية" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-neutral-400">
                  <ImageIcon size={28} />
                  <span className="text-xs">لم يتم رفع صورة مخصصة بعد — يتم استعمال الصورة الافتراضية</span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
              اختر صورة جديدة (يفضل مقاس أفقي عريض)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2 text-xs file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 dark:file:bg-white file:text-white dark:file:text-neutral-900 hover:file:bg-neutral-800 dark:hover:file:bg-neutral-200 cursor-pointer"
            />

            {preview && (
              <div className="w-full h-48 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                <img src={preview} alt="معاينة" className="w-full h-full object-cover" />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !file}
              className="mt-1 flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-2.5 rounded-lg text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 transition-colors"
            >
              <UploadCloud size={15} />
              {submitting ? "جاري الرفع..." : "تحديث الصورة"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}