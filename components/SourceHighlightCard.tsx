type Source = {
  id: string;
  nameBn: string;
  nameEn: string;
  pH: number;
  temp: number;
  tds: number;
  turbidity: number;
  score: number;
  status: "Safe" | "Caution" | "Unsafe";
  bestUseBn: string;
  noteBn: string;
};

export default function SourceHighlightCard({
  title,
  source,
  tone,
}: {
  title: string;
  source: Source;
  tone: "best" | "worst";
}) {
  const ui =
    tone === "best"
      ? {
          wrap: "from-emerald-50 to-green-100 border-emerald-300",
          badge: "bg-emerald-600 text-white",
          emoji: "🏆",
        }
      : {
          wrap: "from-rose-50 to-red-100 border-rose-300",
          badge: "bg-rose-600 text-white",
          emoji: "⚠️",
        };

  return (
    <div className={`rounded-3xl border-2 bg-gradient-to-r ${ui.wrap} p-6 shadow-lg`}>
      <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${ui.badge}`}>
        <span>{ui.emoji}</span>
        <span>{title}</span>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
          {source.nameBn}
        </h3>
        <p className="text-slate-600 mt-1">{source.nameEn}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="text-sm text-slate-500">Safety Score</p>
          <p className="text-2xl font-bold text-slate-900">{source.score}/100</p>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="text-sm text-slate-500">Best Use</p>
          <p className="text-base font-bold text-slate-900">{source.bestUseBn}</p>
        </div>
      </div>

      <p className="mt-4 text-base md:text-lg font-medium text-slate-800 leading-8">
        {source.noteBn}
      </p>
    </div>
  );
}