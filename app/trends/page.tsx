import TrendChart from "@/components/TrendChart";

import { getLanguage } from "@/lib/getLanguage";
import { getDictionary } from "@/lib/i18n";

import {
  parseSample,
  smoothSamples,
  type SensorSample,
} from "@/lib/preprocess";

import {
  fetchHistoryFeed,
} from "@/lib/thingspeak";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TrendsPage() {
  const language = await getLanguage();

  const dictionary =
    getDictionary(language);

  let history: SensorSample[] = [];
  let errorMessage: string | null =
    null;

  try {
    const response =
      await fetchHistoryFeed(150);

    const parsed =
      (response.feeds || []).map(
        parseSample
      );

    history = smoothSamples(parsed);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : language === "bn"
          ? "প্রবণতার ডেটা আনা যায়নি।"
          : "Trend data could not be loaded.";
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-emerald-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-6 text-white shadow-xl md:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-100">
            {language === "bn"
              ? "ঐতিহাসিক সেন্সর বিশ্লেষণ"
              : "Historical Sensor Analysis"}
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-5xl">
            {dictionary.trends.title}
          </h1>

          <p className="mt-3 max-w-4xl text-base font-medium leading-7 text-blue-50 md:text-xl md:leading-8">
            {dictionary.trends.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur md:text-base">
              🧪 pH
            </span>

            <span className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur md:text-base">
              💧{" "}
              {language === "bn"
                ? "আনুমানিক TDS"
                : "Estimated TDS"}
            </span>

            <span className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur md:text-base">
              🌡️{" "}
              {language === "bn"
                ? "তাপমাত্রা"
                : "Temperature"}
            </span>
          </div>
        </header>

        {errorMessage ? (
          <section className="rounded-3xl border border-rose-300 bg-rose-50 p-5 text-rose-950 shadow-md">
            <h2 className="text-xl font-black">
              {language === "bn"
                ? "ডেটা লোড করা যায়নি"
                : "Data could not be loaded"}
            </h2>

            <p className="mt-2 text-base font-medium">
              {errorMessage}
            </p>
          </section>
        ) : null}

        {!errorMessage &&
        history.length === 0 ? (
          <section className="rounded-3xl border border-amber-300 bg-amber-50 p-6 text-amber-950 shadow-md">
            <h2 className="text-xl font-black">
              {language === "bn"
                ? "কোনো ঐতিহাসিক ডেটা নেই"
                : "No historical data"}
            </h2>

            <p className="mt-2 text-base font-medium">
              {dictionary.trends.noData}
            </p>
          </section>
        ) : null}

        {history.length > 0 ? (
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950 md:text-3xl">
                {language === "bn"
                  ? "সাম্প্রতিক পরিমাপ"
                  : "Recent measurements"}
              </h2>

              <p className="mt-2 text-base font-medium leading-7 text-slate-700">
                {language === "bn"
                  ? "ThingSpeak থেকে সংগৃহীত সাম্প্রতিক ডেটায় মধ্যকভিত্তিক স্মুথিং প্রয়োগ করে প্রবণতা দেখানো হয়েছে।"
                  : "The trends use recent ThingSpeak records with median-based smoothing to reduce short-term sensor noise."}
              </p>
            </div>

            <TrendChart data={history} />
          </section>
        ) : null}

        <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-md">
          <h2 className="text-xl font-black text-blue-950">
            {language === "bn"
              ? "ডেটা ব্যাখ্যার সতর্কতা"
              : "Data interpretation notice"}
          </h2>

          <p className="mt-3 text-base font-semibold leading-7 text-blue-950">
            {language === "bn"
              ? "এই গ্রাফগুলো সেন্সরের সময়ভিত্তিক পরিবর্তন দেখায়। এগুলো পরীক্ষাগার সনদ নয় এবং পানযোগ্যতা নির্ধারণে একমাত্র ভিত্তি হিসেবে ব্যবহার করা উচিত নয়।"
              : "These charts show time-based changes in sensor measurements. They are not laboratory certification and should not be used as the sole basis for determining potability."}
          </p>

          <p className="mt-2 text-base font-semibold leading-7 text-blue-950">
            {language === "bn"
              ? "TDS মানটি DFRobot সমীকরণ ও অস্থায়ী সংশোধন ফ্যাক্টরভিত্তিক আনুমানিক মান।"
              : "The TDS value is an estimate based on the DFRobot equation and a provisional correction factor."}
          </p>
        </section>
      </div>
    </main>
  );
}