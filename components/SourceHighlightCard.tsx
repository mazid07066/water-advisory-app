import type {
  CompareProfile,
} from "@/lib/types";
import type { Language } from "@/lib/i18n";

type LocalizedSource = CompareProfile & {
  displayName: string;
  displaySubtitle: string;
  displayUse: string;
  displayNote: string;
};

export default function SourceHighlightCard({
  title,
  source,
  tone,
  language,
}: {
  title: string;
  source: LocalizedSource;
  tone: "best" | "worst";
  language: Language;
}) {
  const containerClasses =
    tone === "best"
      ? "border-emerald-300 from-emerald-50 to-green-100"
      : "border-rose-300 from-rose-50 to-red-100";

  const badgeClasses =
    tone === "best"
      ? "bg-emerald-600"
      : "bg-rose-600";

  return (
    <article
      className={`rounded-3xl border-2 bg-gradient-to-r p-6 shadow-lg ${containerClasses}`}
    >
      <span
        className={`inline-flex rounded-full px-4 py-2 text-sm font-bold text-white ${badgeClasses}`}
      >
        {title}
      </span>

      <h3 className="mt-4 text-2xl font-extrabold text-slate-900 md:text-3xl">
        {source.displayName}
      </h3>

      <p className="mt-1 text-slate-600">
        {source.displaySubtitle}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="text-sm text-slate-500">
            {language === "bn"
              ? "নিরাপত্তা স্কোর"
              : "Safety score"}
          </p>

          <p className="text-2xl font-bold">
            {source.score}/100
          </p>
        </div>

        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="text-sm text-slate-500">
            {language === "bn"
              ? "প্রস্তাবিত ব্যবহার"
              : "Suggested use"}
          </p>

          <p className="font-bold">
            {source.displayUse}
          </p>
        </div>
      </div>

      <p className="mt-4 text-base font-medium leading-8 text-slate-800 md:text-lg">
        {source.displayNote}
      </p>
    </article>
  );
}