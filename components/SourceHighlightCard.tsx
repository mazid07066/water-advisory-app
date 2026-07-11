import type {
  CompareProfile,
} from "@/lib/types";

export default function SourceHighlightCard({
  title,
  source,
  tone,
}: {
  title: string;
  source: CompareProfile;
  tone: "best" | "worst";
}) {
  const classes =
    tone === "best"
      ? "from-emerald-50 to-green-100 border-emerald-300"
      : "from-rose-50 to-red-100 border-rose-300";

  const badge =
    tone === "best"
      ? "bg-emerald-600"
      : "bg-rose-600";

  return (
    <article
      className={`rounded-3xl border-2 bg-gradient-to-r p-6 shadow-lg ${classes}`}
    >
      <span
        className={`inline-flex rounded-full px-4 py-2 text-sm font-bold text-white ${badge}`}
      >
        {title}
      </span>

      <h3 className="mt-4 text-2xl font-extrabold text-slate-900 md:text-3xl">
        {source.nameBn}
      </h3>

      <p className="mt-1 text-slate-600">
        {source.nameEn}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="text-sm text-slate-500">
            Safety score
          </p>
          <p className="text-2xl font-bold">
            {source.score}/100
          </p>
        </div>

        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="text-sm text-slate-500">
            Suggested use
          </p>
          <p className="font-bold">
            {source.bestUseBn}
          </p>
        </div>
      </div>

      <p className="mt-4 text-base font-medium leading-8 text-slate-800 md:text-lg">
        {source.noteBn}
      </p>
    </article>
  );
}