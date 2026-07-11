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

function badgeStyle(
  status: CompareProfile["status"]
): string {
  if (status === "Safe") {
    return "border border-emerald-300 bg-emerald-100 text-emerald-800";
  }

  if (status === "Caution") {
    return "border border-amber-300 bg-amber-100 text-amber-800";
  }

  return "border border-rose-300 bg-rose-100 text-rose-800";
}

function localizedStatus(
  status: CompareProfile["status"],
  language: Language
): string {
  if (language === "en") {
    return status;
  }

  if (status === "Safe") {
    return "গ্রহণযোগ্য";
  }

  if (status === "Caution") {
    return "সতর্কতা";
  }

  return "অনিরাপদ";
}

export default function SourceComparisonTable({
  rows,
  language,
}: {
  rows: LocalizedSource[];
  language: Language;
}) {
  const labels =
    language === "bn"
      ? {
          source: "উৎস",
          temperature: "তাপমাত্রা",
          score: "স্কোর",
          status: "অবস্থা",
          suggestedUse: "প্রস্তাবিত ব্যবহার",
        }
      : {
          source: "Source",
          temperature: "Temperature",
          score: "Score",
          status: "Status",
          suggestedUse: "Suggested use",
        };

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-lg">
      <table className="w-full min-w-[900px] text-base">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">
              {labels.source}
            </th>

            <th className="p-4 text-center">
              pH
            </th>

            <th className="p-4 text-center">
              TDS
            </th>

            <th className="p-4 text-center">
              {labels.temperature}
            </th>

            <th className="p-4 text-center">
              {labels.score}
            </th>

            <th className="p-4 text-center">
              {labels.status}
            </th>

            <th className="p-4 text-left">
              {labels.suggestedUse}
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-t border-slate-200"
            >
              <td className="p-4">
                <p className="font-bold text-slate-900">
                  {row.displayName}
                </p>

                <p className="text-sm text-slate-500">
                  {row.displaySubtitle}
                </p>
              </td>

              <td className="p-4 text-center font-semibold">
                {row.ph.toFixed(2)}
              </td>

              <td className="p-4 text-center font-semibold">
                {row.tds.toFixed(1)} ppm
              </td>

              <td className="p-4 text-center font-semibold">
                {row.temperature.toFixed(1)} °C
              </td>

              <td className="p-4 text-center font-bold">
                {row.score}/100
              </td>

              <td className="p-4 text-center">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${badgeStyle(
                    row.status
                  )}`}
                >
                  {localizedStatus(
                    row.status,
                    language
                  )}
                </span>
              </td>

              <td className="p-4 font-medium text-slate-800">
                {row.displayUse}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}