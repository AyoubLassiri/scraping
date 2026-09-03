import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل تسجيل الدخول");
      }

      // Save token securely in localStorage
      localStorage.setItem("adminToken", data.token);
      toast.success("مرحباً بك، تم تسجيل الدخول بنجاح");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "خطأ في اسم المستخدم أو كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-2 text-center">لوحة تحكم المشرف</h2>
        <p className="text-xs text-neutral-500 mb-8 text-center">نادي مستقبل المرسى</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-900"
              placeholder="أدخل اسم المستخدم"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-900"
              placeholder="أدخل كلمة المرور"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-neutral-900 text-white font-semibold py-3 rounded-lg text-sm hover:bg-neutral-800 transition-colors disabled:bg-neutral-400"
          >
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}