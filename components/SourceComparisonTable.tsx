type Row = {
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

function badgeStyle(status: Row["status"]) {
  if (status === "Safe") {
    return "bg-emerald-100 text-emerald-800 border border-emerald-300";
  }
  if (status === "Caution") {
    return "bg-amber-100 text-amber-800 border border-amber-300";
  }
  return "bg-rose-100 text-rose-800 border border-rose-300";
}

function statusBn(status: Row["status"]) {
  if (status === "Safe") return "নিরাপদ";
  if (status === "Caution") return "সতর্কতা";
  return "অনিরাপদ";
}

export default function SourceComparisonTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-lg">
      <table className="w-full min-w-[960px] text-base">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left font-bold text-slate-900">উৎস</th>
            <th className="p-4 text-center font-bold text-slate-900">pH</th>
            <th className="p-4 text-center font-bold text-slate-900">Temp (°C)</th>
            <th className="p-4 text-center font-bold text-slate-900">TDS</th>
            <th className="p-4 text-center font-bold text-slate-900">Turbidity</th>
            <th className="p-4 text-center font-bold text-slate-900">Score</th>
            <th className="p-4 text-center font-bold text-slate-900">অবস্থা</th>
            <th className="p-4 text-left font-bold text-slate-900">সেরা ব্যবহার</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-200 align-top">
              <td className="p-4">
                <div className="font-bold text-slate-900">{row.nameBn}</div>
                <div className="text-sm text-slate-500">{row.nameEn}</div>
              </td>
              <td className="p-4 text-center font-semibold text-slate-800">
                {row.pH.toFixed(2)}
              </td>
              <td className="p-4 text-center font-semibold text-slate-800">
                {row.temp.toFixed(2)}
              </td>
              <td className="p-4 text-center font-semibold text-slate-800">
                {row.tds.toFixed(2)}
              </td>
              <td className="p-4 text-center font-semibold text-slate-800">
                {row.turbidity.toFixed(2)}
              </td>
              <td className="p-4 text-center font-bold text-slate-900">
                {row.score}/100
              </td>
              <td className="p-4 text-center">
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${badgeStyle(row.status)}`}>
                  {statusBn(row.status)}
                </span>
              </td>
              <td className="p-4 text-slate-800 font-medium">
                {row.bestUseBn}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}