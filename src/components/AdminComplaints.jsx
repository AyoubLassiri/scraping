import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2, MessageSquare, Mail, Phone } from "lucide-react";

const STATUS_OPTIONS = ["New", "In Progress", "Resolved"];

const STATUS_STYLES = {
  New: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400",
  "In Progress": "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400",
  Resolved: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400",
};

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://backend.mostakbalelmarsa.com/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("فشل في تحميل الشكاوى");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    // Optimistic update
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));

    try {
      const res = await fetch(`https://backend.mostakbalelmarsa.com/api/complaints/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم تحديث الحالة");
    } catch (err) {
      toast.error("فشل تحديث الحالة");
      fetchComplaints(); // revert on failure
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الشكاية؟")) return;

    try {
      const res = await fetch(`https://backend.mostakbalelmarsa.com/api/complaints/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      toast.success("تم حذف الشكاية");
      setComplaints((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-neutral-400 text-sm">جاري تحميل الشكاوى...</div>;
  }

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
      <h3 className="text-sm font-bold mb-4">شكاوى واقتراحات الزوار ({complaints.length})</h3>

      {complaints.length === 0 ? (
        <p className="text-neutral-400 text-xs text-center py-12">لا توجد شكاوى حالياً.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors flex flex-col gap-3"
            >
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{c.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_STYLES[c.status] || STATUS_STYLES.New}`}>
                      {c.status || "New"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-500 dark:text-neutral-400">
                    {c.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={12} /> {c.email}
                      </span>
                    )}
                    {c.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} /> {c.phone}
                      </span>
                    )}
                    <span>{new Date(c.created_at).toLocaleString("ar-MA")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={c.status || "New"}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className="text-[11px] border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1.5 bg-white dark:bg-neutral-800 focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 p-2 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 flex items-start gap-2">
                <MessageSquare size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                <p className="text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{c.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}