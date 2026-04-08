type Tone = "safe" | "warning" | "danger" | "neutral";

type Props = {
  title: string;
  value: string;
  emoji?: string;
  tone?: Tone;
};

const toneStyles: Record<Tone, string> = {
  safe: "bg-emerald-50 border-emerald-200",
  warning: "bg-amber-50 border-amber-200",
  danger: "bg-rose-50 border-rose-200",
  neutral: "bg-slate-50 border-slate-200",
};

export default function AdvisoryCard({
  title,
  value,
  emoji = "ℹ️",
  tone = "neutral",
}: Props) {
  return (
    <div className={`rounded-3xl border p-5 md:p-6 shadow-md hover:shadow-lg transition ${toneStyles[tone]}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm text-2xl">
          {emoji}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-slate-900">
          {title}
        </h3>
      </div>

      <p className="text-lg md:text-xl leading-8 font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}