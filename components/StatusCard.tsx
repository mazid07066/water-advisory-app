type Props = {
  status: "Safe" | "Caution" | "Unsafe";
  score: number;
  summary: string;
};

export default function StatusCard({ status, score, summary }: Props) {
  const statusMap = {
    Safe: {
      title: "নিরাপদ",
      bg: "from-emerald-50 to-green-100",
      border: "border-emerald-300",
      text: "text-emerald-950",
      sub: "text-emerald-800",
      badge: "bg-emerald-600 text-white",
      emoji: "✅",
    },
    Caution: {
      title: "সতর্কতা",
      bg: "from-amber-50 to-yellow-100",
      border: "border-amber-300",
      text: "text-amber-950",
      sub: "text-amber-800",
      badge: "bg-amber-500 text-white",
      emoji: "⚠️",
    },
    Unsafe: {
      title: "অনিরাপদ",
      bg: "from-rose-50 to-red-100",
      border: "border-rose-300",
      text: "text-rose-950",
      sub: "text-rose-800",
      badge: "bg-rose-600 text-white",
      emoji: "⛔",
    },
  };

  const ui = statusMap[status];

  return (
    <section
      className={`rounded-3xl border-2 ${ui.border} bg-gradient-to-r ${ui.bg} p-6 md:p-8 shadow-lg`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-3">
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm md:text-base font-bold ${ui.badge}`}>
            <span>{ui.emoji}</span>
            <span>সামগ্রিক অবস্থা: {ui.title}</span>
          </div>

          <h2 className={`text-3xl md:text-4xl font-extrabold ${ui.text}`}>
            পানির মানের সিদ্ধান্ত
          </h2>

          <p className={`text-base md:text-lg font-medium ${ui.sub}`}>
            {summary}
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 backdrop-blur px-6 py-4 shadow border border-white">
          <p className="text-sm md:text-base font-semibold text-slate-600">
            নিরাপত্তা স্কোর
          </p>
          <p className="text-3xl md:text-4xl font-extrabold text-slate-900">
            {score}/100
          </p>
        </div>
      </div>
    </section>
  );
}