import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Save, Plus, Trash2, Upload, X } from "lucide-react";

export default function AdminHistory() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("التاريخ ديال نادي مستقبل المرسى الرياضي");
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/history")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setTitle(data.title || "التاريخ ديال نادي مستقبل المرسى الرياضي");
          
          let parsedSections = [];
          if (data.sections) {
            try {
              parsedSections = typeof data.sections === "string" ? JSON.parse(data.sections) : data.sections;
            } catch (error) {
              console.error("Error parsing sections:", error);
              parsedSections = [];
            }
          } else {
            // ترحيل البيانات القديمة إن وجدت
            if (data.section1Text || data.section1Image) {
              parsedSections.push({ id: 1, media: data.section1Image || "", caption: data.section1Caption || "", paragraphs: typeof data.section1Text === "string" ? JSON.parse(data.section1Text) : (data.section1Text || []) });
            }
            if (data.section2Text || data.section2Image) {
              parsedSections.push({ id: 2, media: data.section2Image || "", caption: data.section2Caption || "", paragraphs: typeof data.section2Text === "string" ? JSON.parse(data.section2Text) : (data.section2Text || []) });
            }
            if (data.section3Text || data.section3Media) {
              parsedSections.push({ id: 3, media: data.section3Media || "", caption: data.section3Caption || "", paragraphs: typeof data.section3Text === "string" ? JSON.parse(data.section3Text) : (data.section3Text || []) });
            }
          }
          // التأكد من أن الأقسام دائماً عبارة عن مصفوفة لتجنب انهيار الصفحة
          setSections(Array.isArray(parsedSections) ? parsedSections : []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching history:", err);
        setLoading(false);
      });
  }, []);

  // إضافة قسم جديد
  const handleAddSection = () => {
    console.log("Adding new section...");
    setSections([...sections, { id: Date.now(), media: "", caption: "", paragraphs: [""] }]);
  };

  // حذف قسم كامل
  const handleRemoveSection = (index) => {
    console.log("Removing section at index:", index);
    if (!window.confirm("هل أنت متأكد من حذف هذا القسم بالكامل؟")) return;
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  // تحديث نص أو رابط القسم
  const handleUpdateSection = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  // إضافة فقرة نصية داخل القسم
  const handleAddParagraph = (sectionIndex) => {
    console.log("Adding paragraph to section:", sectionIndex);
    const newSections = [...sections];
    if (!Array.isArray(newSections[sectionIndex].paragraphs)) {
        newSections[sectionIndex].paragraphs = [];
    }
    newSections[sectionIndex].paragraphs.push("");
    setSections(newSections);
  };

  // تحديث نص الفقرة
  const handleUpdateParagraph = (sectionIndex, pIndex, value) => {
    const newSections = [...sections];
    newSections[sectionIndex].paragraphs[pIndex] = value;
    setSections(newSections);
  };

  // حذف فقرة معينة
  const handleRemoveParagraph = (sectionIndex, pIndex) => {
    console.log(`Removing paragraph ${pIndex} from section ${sectionIndex}`);
    const newSections = [...sections];
    newSections[sectionIndex].paragraphs.splice(pIndex, 1);
    setSections(newSections);
  };

  // رفع الصورة أو الفيديو للقسم
  const handleFileUpload = async (sectionIndex, file) => {
    if (!file) return;
    console.log("Uploading file for section:", sectionIndex, file.name);
    
    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("جاري رفع الملف...");
    try {
      const res = await fetch("http://localhost:5000/api/history/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok && data.url) {
        handleUpdateSection(sectionIndex, "media", data.url);
        toast.success("تم رفع الملف بنجاح", { id: toastId });
      } else {
        throw new Error(data.error || "خطأ غير معروف في الرفع");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("فشل رفع الملف، تأكد من اتصال الخادم", { id: toastId });
    }
  };

  // حفظ البيانات الإجمالية (JSON) في قاعدة البيانات
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("جاري حفظ التعديلات...");
    
    try {
      const res = await fetch("http://localhost:5000/api/history", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, sections }),
      });
      
      if (!res.ok) throw new Error();
      toast.success("تم تحديث صفحة التاريخ بنجاح!", { id: toastId });
    } catch (err) {
      console.error("Save error:", err);
      toast.error("حدث خطأ أثناء الحفظ", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-neutral-500">جاري تحميل بيانات التاريخ...</div>;

  return (
    <div dir="rtl" className="w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 transition-colors p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-bold">إدارة صفحة التاريخ (ديناميكي)</h2>
        <button 
          type="button" // <--- ضروري لكي لا يعمل كأنه حفظ للنموذج
          onClick={handleAddSection} 
          className="flex items-center gap-1 bg-[#2596be] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1d7a9c] transition-colors"
        >
          <Plus size={16} /> إضافة قسم جديد
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">عنوان الصفحة الرئيسي</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full border border-neutral-300 dark:border-neutral-700 bg-transparent rounded-lg p-3 text-sm focus:outline-none focus:border-[#2596be] dark:focus:border-white transition-colors" 
            required 
          />
        </div>

        {sections.map((section, sIndex) => (
          <div key={section.id || sIndex} className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-4 relative transition-colors">
            
            <button 
              type="button" 
              onClick={() => handleRemoveSection(sIndex)} 
              className="absolute top-4 left-4 text-red-500 hover:text-white bg-red-50 hover:bg-red-500 dark:bg-red-900/30 dark:hover:bg-red-600 p-2 rounded-lg transition-colors"
              title="حذف هذا القسم"
            >
              <Trash2 size={16} />
            </button>
            
            <h3 className="font-bold text-[#2596be] text-lg mb-4">القسم رقم {sIndex + 1}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2">صورة أو فيديو القسم</label>
                <div className="flex gap-2 items-center">
                  <label className="flex items-center justify-center bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:border-[#2596be] dark:hover:border-white w-12 h-11 rounded-lg cursor-pointer transition-colors">
                    <Upload size={18} className="text-neutral-600 dark:text-neutral-300" />
                    <input 
                      type="file" 
                      accept="image/*,video/mp4" 
                      className="hidden" 
                      onChange={(e) => {
                        handleFileUpload(sIndex, e.target.files[0]);
                        e.target.value = null; // لتفريغ الحقل والسماح برفع نفس الملف مرتين إذا لزم الأمر
                      }} 
                    />
                  </label>
                  <input 
                    type="text" 
                    placeholder="رابط الوسائط (URL) بعد الرفع" 
                    value={section.media || ""} 
                    onChange={(e) => handleUpdateSection(sIndex, "media", e.target.value)} 
                    className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-lg p-3 text-xs focus:outline-none focus:border-[#2596be] dark:focus:border-white transition-colors" 
                  />
                </div>

                {section.media && (
                  <div className="mt-3 h-32 w-48 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    {section.media.includes('.mp4') || section.media.includes('video') ? (
                      <video src={section.media.startsWith('http') || section.media.startsWith('blob:') ? section.media : `http://localhost:5000${section.media}`} className="w-full h-full object-cover" />
                    ) : (
                      <img src={section.media.startsWith('http') || section.media.startsWith('blob:') ? section.media : `http://localhost:5000${section.media}`} className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2">تعليق الوسائط (Caption)</label>
                <input 
                  type="text" 
                  value={section.caption || ""} 
                  onChange={(e) => handleUpdateSection(sIndex, "caption", e.target.value)} 
                  className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-lg p-3 text-xs focus:outline-none focus:border-[#2596be] dark:focus:border-white transition-colors" 
                  placeholder="مثال: المؤسس الأول للنادي..."
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300">الفقرات النصية</label>
                <button 
                  type="button" 
                  onClick={() => handleAddParagraph(sIndex)} 
                  className="text-xs bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-3 py-1.5 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-700 font-bold flex items-center gap-1 transition-colors"
                >
                  <Plus size={14} /> إضافة فقرة جديدة
                </button>
              </div>
              
              {Array.isArray(section.paragraphs) && section.paragraphs.map((p, pIndex) => (
                <div key={pIndex} className="flex gap-2">
                  <textarea 
                    rows={2} 
                    value={p} 
                    onChange={(e) => handleUpdateParagraph(sIndex, pIndex, e.target.value)} 
                    className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-lg p-3 text-sm focus:outline-none focus:border-[#2596be] dark:focus:border-white transition-colors resize-y" 
                    placeholder={`اكتب محتوى الفقرة رقم ${pIndex + 1} هنا...`} 
                    required 
                  />
                  {section.paragraphs.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveParagraph(sIndex, pIndex)} 
                      className="text-red-500 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 px-3 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-transparent hover:border-red-500"
                      title="حذف هذه الفقرة"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400 text-sm border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
            لا يوجد أي أقسام حالياً. اضغط على الزر الأزرق "إضافة قسم جديد" بالأعلى للبدء في كتابة التاريخ.
          </div>
        )}

        <button 
          type="submit" 
          disabled={saving || sections.length === 0} 
          className="w-full flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-3.5 rounded-xl font-bold text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm disabled:bg-neutral-400 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed mt-8"
        >
          <Save size={18} />
          {saving ? "جاري الحفظ..." : "حفظ التعديلات ونشرها في الموقع"}
        </button>
      </form>
    </div>
  );
}