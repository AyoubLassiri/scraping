import React, { useState, useEffect } from "react";
import logoImage from "../assets/logoMostakhbal.png";
import toast from "react-hot-toast";

export default function Footer() {
  const [roster, setRoster] = useState({
    forwards: [],
    midfielders: [],
    defenders: [],
    goalkeepers: [],
  });

  const [complaint, setComplaint] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleComplaintChange = (e) => {
    setComplaint({ ...complaint, [e.target.name]: e.target.value });
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!complaint.name || !complaint.message) {
      toast.error("المرجو تعبئة الاسم والرسالة");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("https://backend.mostakbalelmarsa.com/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaint),
      });

      if (!res.ok) throw new Error("Failed to submit");

      toast.success("تم إرسال رسالتك بنجاح، شكراً لك");
      setComplaint({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Failed to submit complaint:", err);
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetch("https://backend.mostakbalelmarsa.com/api/players")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Categorize players based on the positions saved from the Admin Dashboard
          const forwards = data.filter((p) => p.position === "مهاجم").map(p => p.name);
          const midfielders = data.filter((p) => p.position === "وسط ميدان").map(p => p.name);
          const defenders = data.filter((p) => p.position === "مدافع").map(p => p.name);
          const goalkeepers = data.filter((p) => p.position === "حارس مرمى").map(p => p.name);

          setRoster({
            forwards,
            midfielders,
            defenders,
            goalkeepers
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch players for footer:", err);
      });
  }, []);

  return (
    <footer dir="rtl" className="w-full bg-gradient-to-b from-[#2596be] via-neutral-900 to-neutral-950 dark:from-neutral-900 dark:via-neutral-950 dark:to-black text-white font-sans pt-12 pb-8 transition-colors duration-300">
      
      {/* Middle Section: Player Columns */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-right mb-16 pt-12">
        
        <div>
          <h3 className="text-[#eab308] font-bold text-lg mb-4">الهجوم</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            {roster.forwards.length > 0 ? roster.forwards.map((player, idx) => (
              <li key={idx} className="hover:text-white transition-colors cursor-pointer">{player}</li>
            )) : <li className="text-neutral-500">لا يوجد لاعبين</li>}
          </ul>
        </div>

        <div>
          <h3 className="text-[#eab308] font-bold text-lg mb-4">وسط الميدان</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            {roster.midfielders.length > 0 ? roster.midfielders.map((player, idx) => (
              <li key={idx} className="hover:text-white transition-colors cursor-pointer">{player}</li>
            )) : <li className="text-neutral-500">لا يوجد لاعبين</li>}
          </ul>
        </div>

        <div>
          <h3 className="text-[#eab308] font-bold text-lg mb-4">الدفاع</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            {roster.defenders.length > 0 ? roster.defenders.map((player, idx) => (
              <li key={idx} className="hover:text-white transition-colors cursor-pointer">{player}</li>
            )) : <li className="text-neutral-500">لا يوجد لاعبين</li>}
          </ul>
        </div>

        <div>
          <h3 className="text-[#eab308] font-bold text-lg mb-4">حراسة المرمى</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            {roster.goalkeepers.length > 0 ? roster.goalkeepers.map((player, idx) => (
              <li key={idx} className="hover:text-white transition-colors cursor-pointer">{player}</li>
            )) : <li className="text-neutral-500">لا يوجد حراس</li>}
          </ul>
        </div>

      </div>

      {/* Complaints / Contact Section */}
      <div className="max-w-2xl mx-auto px-4 mb-16 pt-4 border-t border-neutral-700/50 dark:border-neutral-800">
        <h3 className="text-[#eab308] font-bold text-lg mb-4 text-center pt-8">
          عندك شكاية ولا اقتراح؟
        </h3>
        <form onSubmit={handleComplaintSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="الاسم"
            value={complaint.name}
            onChange={handleComplaintChange}
            className="bg-white/10 dark:bg-neutral-800 text-white placeholder-neutral-300 dark:placeholder-neutral-400 border border-white/10 dark:border-neutral-700 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2596be] transition-colors"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني (اختياري)"
              value={complaint.email}
              onChange={handleComplaintChange}
              className="bg-white/10 dark:bg-neutral-800 text-white placeholder-neutral-300 dark:placeholder-neutral-400 border border-white/10 dark:border-neutral-700 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2596be] transition-colors"
            />
            <input
              type="text"
              name="phone"
              placeholder="الهاتف (اختياري)"
              value={complaint.phone}
              onChange={handleComplaintChange}
              className="bg-white/10 dark:bg-neutral-800 text-white placeholder-neutral-300 dark:placeholder-neutral-400 border border-white/10 dark:border-neutral-700 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2596be] transition-colors"
            />
          </div>
          <textarea
            name="message"
            placeholder="رسالتك..."
            rows={3}
            value={complaint.message}
            onChange={handleComplaintChange}
            className="bg-white/10 dark:bg-neutral-800 text-white placeholder-neutral-300 dark:placeholder-neutral-400 border border-white/10 dark:border-neutral-700 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2596be] resize-none transition-colors"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#2596be] hover:bg-[#1f7fa1] disabled:opacity-50 text-white font-bold rounded-md py-2 text-sm transition-colors self-center px-8"
          >
            {submitting ? "جاري الإرسال..." : "إرسال"}
          </button>
        </form>
      </div>

      {/* Bottom Section: Logo and Disclaimer */}
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center pt-10">
        
        {/* Logo */}
        <img 
          src={logoImage} 
          alt="Club Logo" 
          className="h-28 w-auto object-contain mb-6 drop-shadow-lg" 
        />

        {/* Slogan */}
        <h4 className="text-xl font-bold mb-8 leading-relaxed">
          شرف لك تلبس التوني ديال النادي<br />
          تعرڭو واجب عليك
        </h4>

      </div>
    </footer>
  );
}