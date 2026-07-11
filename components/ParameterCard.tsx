interface ParameterCardProps {
  title: string;
  value: number | null;
  unit?: string;
  icon: string;
  note?: string;
  decimals?: number;
}

export default function ParameterCard({
  title,
  value,
  unit = "",
  icon,
  note,
  decimals = 2,
}: ParameterCardProps) {
  const formattedValue =
    value === null || !Number.isFinite(value)
      ? "তথ্য নেই"
      : value.toFixed(decimals);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-bold text-slate-700">{title}</p>

          <div className="mt-3 flex items-end gap-2">
            <span className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              {formattedValue}
            </span>

            {value !== null && unit ? (
              <span className="pb-1 text-base font-semibold text-slate-600">
                {unit}
              </span>
            ) : null}
          </div>

          {note ? (
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
              {note}
            </p>
          ) : null}
        </div>

        <span
          aria-hidden="true"
          className="rounded-2xl bg-slate-100 p-3 text-2xl"
        >
          {icon}
        </span>
      </div>
    </article>
  );
}