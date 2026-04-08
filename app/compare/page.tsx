import SourceComparisonTable from "@/components/SourceComparisonTable";
import SourceHighlightCard from "@/components/SourceHighlightCard";
import compareProfiles from "@/data/compare_profiles.json";
import type { CompareProfile } from "@/lib/types";

export const dynamic = "force-static";

export default function ComparePage() {
  const profiles = (compareProfiles as CompareProfile[]).sort(
    (a, b) => b.score - a.score
  );

  const best = profiles[0];
  const worst = profiles[profiles.length - 1];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-600 text-white p-6 md:p-8 shadow-xl">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            জল উৎস তুলনা
          </h1>
          <p className="text-lg md:text-xl mt-2 text-blue-50">
            বাস্তব সেন্সর ডেটা ও প্রক্রিয়াজাত বিশ্লেষণের ভিত্তিতে পানির উৎসভিত্তিক তুলনা
          </p>
          <p className="mt-3 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm md:text-base font-semibold backdrop-blur">
            📊 ব্রহ্মপুত্র অঞ্চল, পুকুর, বৃষ্টির পানি ও পানযোগ্য উৎসের তুলনা
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
              এই টেবিলটি প্রক্রিয়াজাত সেন্সর ডেটার গড় মান, নিরাপত্তা স্কোর এবং ব্যবহারযোগ্যতার সারাংশ দেখায়।
            </p>
          </div>

          <SourceComparisonTable rows={profiles} />
        </section>

        <section className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            সিদ্ধান্তের সারাংশ
          </h3>
          <div className="space-y-3 text-base md:text-lg text-slate-800 leading-8">
            <p>
              <span className="font-bold text-emerald-700">{best.nameBn}</span> বর্তমানে
              তুলনামূলকভাবে সবচেয়ে ভালো উৎস হিসেবে চিহ্নিত হয়েছে।
            </p>
            <p>
              <span className="font-bold text-rose-700">{worst.nameBn}</span> সবচেয়ে
              বেশি ঝুঁকিপূর্ণ উৎস হিসেবে দেখা যাচ্ছে।
            </p>
            <p>
              এই বিশ্লেষণ ব্রহ্মপুত্র তীরবর্তী পরিবার, কৃষক, এবং স্থানীয় ব্যবহারকারীদের
              জন্য দ্রুত সিদ্ধান্ত নিতে সহায়তা করতে পারে।
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}