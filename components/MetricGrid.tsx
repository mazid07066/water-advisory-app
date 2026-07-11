type Props = {
  pH: number;
  temp: number;
  tds: number;
};

function MetricCard({
  title,
  value,
  unit,
  helper,
}: {
  title: string;
  value: string;
  unit?: string;
  helper: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md transition hover:shadow-lg">
      <p className="text-base font-bold text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {helper}
      </p>

      <div className="mt-4 flex items-end gap-2">
        <p className="text-3xl font-extrabold text-slate-900 md:text-4xl">
          {value}
        </p>

        {unit ? (
          <span className="mb-1 text-base font-medium text-slate-500">
            {unit}
          </span>
        ) : null}
      </div>
    </article>
  );
}

export default function MetricGrid({
  pH,
  temp,
  tds,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard
        title="pH"
        value={pH.toFixed(2)}
        helper="Arduino calibrated value"
      />

      <MetricCard
        title="Estimated TDS"
        value={tds.toFixed(1)}
        unit="ppm"
        helper="Corrected prototype estimate"
      />

      <MetricCard
        title="Temperature"
        value={temp.toFixed(1)}
        unit="°C"
        helper="DS18B20 measurement"
      />
    </div>
  );
}