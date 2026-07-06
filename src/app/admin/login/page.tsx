"use client";

import { SubmitEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiLock, FiMail, FiAlertCircle } from "react-icons/fi";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("admin@mada-store.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) {
      router.replace("/admin");
    } else {
      setError(res.error ?? "حدث خطأ ما");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2A2E26] p-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image src="/Untitled-1.png" alt="مدى" width={64} height={36} className="h-10 w-auto brightness-0 invert opacity-90" />
          <p className="text-sm font-semibold text-white/50">لوحة تحكم المتجر</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lift">
          <h1 className="font-display text-2xl font-bold text-[#2A2E26]">تسجيل دخول الأدمن</h1>
          <p className="mt-1 text-sm text-[#666C5E]">أدخل بيانات المدير للمتابعة</p>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              <FiAlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#2A2E26]">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9F8F]" size={16} />
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E3DECF] bg-[#FAFBF5] py-2.5 pe-4 ps-10 text-sm text-[#2A2E26] focus:border-[#71896A] focus:outline-none focus:ring-2 focus:ring-[#71896A]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#2A2E26]">
                كلمة المرور
              </label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9F8F]" size={16} />
                <input
                  type="password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#E3DECF] bg-[#FAFBF5] py-2.5 pe-4 ps-10 text-sm text-[#2A2E26] focus:border-[#71896A] focus:outline-none focus:ring-2 focus:ring-[#71896A]/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-[#71896A] py-3 text-sm font-bold text-white transition hover:bg-[#5B6F55] disabled:opacity-60"
            >
              {loading ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          {/* Mock credentials hint */}
          <div className="mt-5 rounded-xl bg-[#F7F4EC] p-3 text-center">
            <p className="text-[11px] font-semibold text-[#666C5E]">بيانات الدخول التجريبية</p>
            <p className="mt-1 text-[11px] text-[#9A9F8F]" dir="ltr">
              admin@mada-store.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
