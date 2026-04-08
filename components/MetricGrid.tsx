type Props = {
  pH: number;
  temp: number;
  tds: number;
  turbidity: number;
};

function MetricCard({
  title,
  value,
  unit,
  emoji,
}: {
  title: string;
  value: string;
  unit?: string;
  emoji: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm md:text-base font-semibold text-slate-600">
          {title}
        </p>
        <span className="text-2xl">{emoji}</span>
      </div>
      <div className="flex items-end gap-2">
        <p className="text-3xl md:text-4xl font-extrabold text-slate-900">
          {value}
        </p>
        {unit ? (
          <span className="text-sm md:text-base font-medium text-slate-500 mb-1">
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function MetricGrid({ pH, temp, tds, turbidity }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard title="pH" value={pH.toFixed(2)} emoji="🧪" />
      <MetricCard title="তাপমাত্রা" value={temp.toFixed(2)} unit="°C" emoji="🌡️" />
      <MetricCard title="TDS" value={tds.toFixed(2)} unit="ppm" emoji="💧" />
      <MetricCard title="ঘোলাভাব" value={turbidity.toFixed(2)} unit="NTU" emoji="🌫️" />
    </div>
  );
}