import SourceComparisonTable from "@/components/SourceComparisonTable";
import SourceHighlightCard from "@/components/SourceHighlightCard";
import { sourceProfiles } from "@/lib/sourceProfiles";

export const dynamic = "force-dynamic";

export default function ComparePage() {
  const sorted = [...sourceProfiles].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-600 text-white p-6 md:p-8 shadow-xl">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            পানি উৎস তুলনা
          </h1>
          <p className="text-lg md:text-xl mt-2 text-blue-50">
            ব্রহ্মপুত্র এলাকার বিভিন্ন পানি উৎসের তুলনামূলক বিশ্লেষণ
          </p>
          <p className="mt-3 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm md:text-base font-semibold backdrop-blur">
            📊 গৃহস্থালী ও কৃষি ব্যবহারের জন্য সিদ্ধান্ত সহায়ক তুলনা
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-4">
          <SourceHighlightCard
            title="সবচেয়ে ভালো উৎস"
            source={best}
            tone="best"
          />
          <SourceHighlightCard
            title="সবচেয়ে ঝুঁকিপূর্ণ উৎস"
            source={worst}
            tone="worst"
          />
        </div>

        <section className="space-y-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              উৎসভিত্তিক তুলনামূলক টেবিল
            </h2>
            <p className="text-slate-600 text-base">
              pH, তাপমাত্রা, TDS, ঘোলাভাব এবং নিরাপত্তা স্কোরের ভিত্তিতে তুলনা
            </p>
          </div>

          <SourceComparisonTable rows={sorted} />
        </section>
      </div>
    </main>
  );
}