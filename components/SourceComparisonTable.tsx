type Row = {
  source: string;
  count: number;
  avgPH: number;
  avgTemp: number;
  avgTds: number;
  avgTurbidity: number;
  score: number;
  status: "Safe" | "Caution" | "Unsafe";
};

export default function SourceComparisonTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow">
      <table className="w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 text-left">উৎস</th>
            <th className="p-3">pH</th>
            <th className="p-3">Temp</th>
            <th className="p-3">TDS</th>
            <th className="p-3">Turbidity</th>
            <th className="p-3">Score</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.source} className="border-t">
              <td className="p-3 font-medium">{row.source}</td>
              <td className="p-3 text-center">{row.avgPH.toFixed(2)}</td>
              <td className="p-3 text-center">{row.avgTemp.toFixed(2)}</td>
              <td className="p-3 text-center">{row.avgTds.toFixed(2)}</td>
              <td className="p-3 text-center">{row.avgTurbidity.toFixed(2)}</td>
              <td className="p-3 text-center">{row.score}</td>
              <td className="p-3 text-center">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}