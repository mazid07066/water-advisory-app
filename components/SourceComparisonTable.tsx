import type {
  CompareProfile,
} from "@/lib/types";

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

function statusBn(
  status: CompareProfile["status"]
): string {
  if (status === "Safe") return "গ্রহণযোগ্য";
  if (status === "Caution") return "সতর্কতা";
  return "অনিরাপদ";
}

export default function SourceComparisonTable({
  rows,
}: {
  rows: CompareProfile[];
}) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-lg">
      <table className="w-full min-w-[850px] text-base">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">
              উৎস
            </th>
            <th className="p-4 text-center">
              pH
            </th>
            <th className="p-4 text-center">
              TDS
            </th>
            <th className="p-4 text-center">
              Temperature
            </th>
            <th className="p-4 text-center">
              Score
            </th>
            <th className="p-4 text-center">
              Status
            </th>
            <th className="p-4 text-left">
              Suggested use
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
                  {row.nameBn}
                </p>
                <p className="text-sm text-slate-500">
                  {row.nameEn}
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
                  {statusBn(row.status)}
                </span>
              </td>

              <td className="p-4 font-medium text-slate-800">
                {row.bestUseBn}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}