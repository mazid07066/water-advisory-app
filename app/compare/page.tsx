import SourceComparisonTable from "@/components/SourceComparisonTable";
import SourceHighlightCard from "@/components/SourceHighlightCard";

import compareProfiles from "@/data/compare_profiles.json";

import { getLanguage } from "@/lib/getLanguage";
import {
  getDictionary,
  type Language,
} from "@/lib/i18n";

import type {
  CompareProfile,
} from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LocalizedSource = CompareProfile & {
  displayName: string;
  displaySubtitle: string;
  displayUse: string;
  displayNote: string;
};

const EnglishSourceContent: Record<
  string,
  {
    name: string;
    subtitle: string;
    use: string;
    note: string;
  }
> = {
  drinking: {
    name: "Treated Drinking Water",
    subtitle: "Reference treated-water profile",
    use:
      "Drinking and cooking after laboratory verification",
    note:
      "The pH and estimated TDS are comparatively acceptable. Microbial contamination, arsenic, and other pollutants must still be tested separately.",
  },

  rain: {
    name: "Stored Rainwater",
    subtitle: "Stored rainwater profile",
    use:
      "Household use after treatment and verification",
    note:
      "Low TDS does not guarantee safety. The storage container, roof catchment, and microbial contamination should be assessed.",
  },

  brahmaputra: {
    name: "Brahmaputra River Water",
    subtitle: "River-water reference profile",
    use:
      "Irrigation and non-potable use after testing",
    note:
      "River-water quality may change rapidly with season, sampling location, wastewater discharge, and sediment load.",
  },

  pond: {
    name: "Pond Water",
    subtitle: "Pond-water reference profile",
    use:
      "Not for drinking or cooking without testing and treatment",
    note:
      "Pond water may contain microbial and organic contamination that the current sensors cannot detect.",
  },
};

function localizeProfile(
  profile: CompareProfile,
  language: Language
): LocalizedSource {
  if (language === "bn") {
    return {
      ...profile,
      displayName: profile.nameBn,
      displaySubtitle: profile.nameEn,
      displayUse: profile.bestUseBn,
      displayNote: profile.noteBn,
    };
  }

  const EnglishContent =
    EnglishSourceContent[profile.id];

  return {
    ...profile,

    displayName:
      EnglishContent?.name ??
      profile.nameEn,

    displaySubtitle:
      EnglishContent?.subtitle ??
      profile.nameEn,

    displayUse:
      EnglishContent?.use ??
      profile.bestUseBn,

    displayNote:
      EnglishContent?.note ??
      profile.noteBn,
  };
}

export default async function ComparePage() {
  const language = await getLanguage();
  const dictionary = getDictionary(language);
  const text = dictionary.compare;

  const profiles = (
    compareProfiles as CompareProfile[]
  )
    .map((profile) =>
      localizeProfile(profile, language)
    )
    .sort(
      (first, second) =>
        second.score - first.score
    );

  const best = profiles[0];
  const worst =
    profiles[profiles.length - 1];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-emerald-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-600 p-6 text-white shadow-xl md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-100">
            {language === "bn"
              ? "উৎসভিত্তিক বিশ্লেষণ"
              : "Source-based analysis"}
          </p>

          <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">
            {text.title}
          </h1>

          <p className="mt-3 max-w-5xl text-lg leading-8 text-blue-50 md:text-xl">
            {text.description}
          </p>

          <p className="mt-4 inline-flex rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur md:text-base">
            📊{" "}
            {language === "bn"
              ? "ব্রহ্মপুত্র অঞ্চল, পুকুর, সংরক্ষিত বৃষ্টির পানি এবং পরিশোধিত পানির তুলনা"
              : "Comparison of Brahmaputra River water, pond water, stored rainwater, and treated water"}
          </p>
        </header>

        {best && worst ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <SourceHighlightCard
              title={text.best}
              source={best}
              tone="best"
              language={language}
            />

            <SourceHighlightCard
              title={text.worst}
              source={worst}
              tone="worst"
              language={language}
            />
          </div>
        ) : null}

        <section className="space-y-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              {text.tableTitle}
            </h2>

            <p className="mt-2 text-base leading-7 text-slate-600">
              {language === "bn"
                ? "এই টেবিলটি pH, আনুমানিক TDS, তাপমাত্রা, নিরাপত্তা স্কোর এবং প্রস্তাবিত ব্যবহারের তুলনা দেখায়।"
                : "This table compares pH, estimated TDS, temperature, safety score, and suggested use for each source."}
            </p>
          </div>

          <SourceComparisonTable
            rows={profiles}
            language={language}
          />
        </section>

        {best && worst ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-slate-900">
              {text.summary}
            </h3>

            <div className="mt-3 space-y-3 text-base leading-8 text-slate-800 md:text-lg">
              <p>
                {language === "bn" ? (
                  <>
                    <span className="font-bold text-emerald-700">
                      {best.displayName}
                    </span>{" "}
                    বর্তমানে তুলনামূলকভাবে সবচেয়ে ভালো
                    উৎস হিসেবে চিহ্নিত হয়েছে।
                  </>
                ) : (
                  <>
                    <span className="font-bold text-emerald-700">
                      {best.displayName}
                    </span>{" "}
                    has the highest comparative score
                    among the listed profiles.
                  </>
                )}
              </p>

              <p>
                {language === "bn" ? (
                  <>
                    <span className="font-bold text-rose-700">
                      {worst.displayName}
                    </span>{" "}
                    তুলনামূলকভাবে সবচেয়ে বেশি
                    ঝুঁকিপূর্ণ উৎস হিসেবে দেখা যাচ্ছে।
                  </>
                ) : (
                  <>
                    <span className="font-bold text-rose-700">
                      {worst.displayName}
                    </span>{" "}
                    has the lowest comparative score
                    among the listed profiles.
                  </>
                )}
              </p>

              <p>
                {language === "bn"
                  ? "এই তুলনা ব্রহ্মপুত্র তীরবর্তী পরিবার, কৃষক এবং স্থানীয় ব্যবহারকারীদের জন্য প্রাথমিক সিদ্ধান্ত সহায়তা প্রদান করতে পারে।"
                  : "This comparison can support preliminary decisions for households, farmers, and local users in the Brahmaputra region."}
              </p>
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-md">
          <h3 className="text-xl font-black text-blue-950">
            {language === "bn"
              ? "গুরুত্বপূর্ণ সীমাবদ্ধতা"
              : "Important limitation"}
          </h3>

          <p className="mt-3 text-base font-semibold leading-7 text-blue-950">
            {language === "bn"
              ? "তুলনামূলক প্রোফাইলগুলো প্রদর্শনী ও সিদ্ধান্ত-সহায়তার জন্য প্রস্তুত করা হয়েছে। এগুলো একই সময়ে একই পরীক্ষাগারে যাচাইকৃত পানযোগ্যতার সনদ নয়।"
              : "The comparison profiles are intended for demonstration and decision support. They are not simultaneous laboratory-certified potability results."}
          </p>

          <p className="mt-2 text-base font-semibold leading-7 text-blue-950">
            {language === "bn"
              ? "বর্তমান হার্ডওয়্যার ব্যাকটেরিয়া, ভাইরাস, আর্সেনিক, ভারী ধাতু, কীটনাশক বা টার্বিডিটি পরিমাপ করে না।"
              : "The current hardware does not measure bacteria, viruses, arsenic, heavy metals, pesticides, or turbidity."}
          </p>
        </section>
      </div>
    </main>
  );
}