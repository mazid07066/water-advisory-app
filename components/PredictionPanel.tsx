type Props = {
  sourceLabelBn: string;
  sourceConfidence: number;
  usageLabelBn: string;
  usageConfidence: number;
  adviceBn: string;
};

function confidenceTone(conf: number) {
  if (conf >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-300";
  if (conf >= 60) return "bg-amber-100 text-amber-800 border-amber-300";
  return "bg-rose-100 text-rose-800 border-rose-300";
}

export default function PredictionPanel({
  sourceLabelBn,
  sourceConfidence,
  usageLabelBn,
  usageConfidence,
  adviceBn,
}: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-lg space-y-5">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
          স্বয়ংক্রিয় পূর্বাভাস
        </h2>
        <p className="text-slate-600 text-base md:text-lg mt-1">
          বর্তমান সেন্সর ডেটার ভিত্তিতে সম্ভাব্য উৎস ও ব্যবহারযোগ্যতার পূর্বাভাস
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500 font-semibold">সম্ভাব্য উৎস</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {sourceLabelBn}
              </h3>
            </div>
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-sm font-bold ${confidenceTone(
                sourceConfidence
              )}`}
            >
              Confidence: {sourceConfidence}%
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500 font-semibold">সম্ভাব্য ব্যবহারযোগ্যতা</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {usageLabelBn}
              </h3>
            </div>
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-sm font-bold ${confidenceTone(
                usageConfidence
              )}`}
            >
              Confidence: {usageConfidence}%
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 p-5">
        <p className="text-sm font-semibold text-blue-700 mb-2">
          সামগ্রিক অবস্থা
        </p>
        <p className="text-base md:text-lg font-medium text-slate-800 leading-8">
          {adviceBn}
        </p>
      </div>
    </section>
  );
}