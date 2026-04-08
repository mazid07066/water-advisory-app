"use client";

export default function ActionButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <button className="px-5 py-3 rounded-2xl bg-emerald-600 text-white text-base md:text-lg font-bold shadow-md hover:bg-emerald-700 transition">
        🥤 পান করা যাবে?
      </button>

      <button className="px-5 py-3 rounded-2xl bg-amber-500 text-white text-base md:text-lg font-bold shadow-md hover:bg-amber-600 transition">
        🌾 সেচে ব্যবহার?
      </button>

      <button
        onClick={() => (window.location.href = "/api/export")}
        className="px-5 py-3 rounded-2xl bg-blue-500 text-white text-base md:text-lg font-bold shadow-md hover:bg-blue-400 transition"
      >
        📥 ডেটা ডাউনলোড
      </button>
    </div>
  );
}