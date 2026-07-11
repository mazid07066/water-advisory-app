import TrendChart from "@/components/TrendChart";

import {
  fetchHistoryFeed,
} from "@/lib/thingspeak";

import {
  parseSample,
  smoothSamples,
  type SensorSample,
} from "@/lib/preprocess";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TrendsPage() {
  let history: SensorSample[] = [];
  let errorMessage: string | null = null;

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
        : "Trend data could not be loaded.";
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-3xl font-black text-slate-950 md:text-4xl">
            পানির পরিমাপের প্রবণতা
          </h1>

          <p className="mt-2 text-lg text-slate-700">
            pH, আনুমানিক TDS এবং তাপমাত্রার
            সাম্প্রতিক পরিবর্তন।
          </p>
        </header>

        {errorMessage ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-950">
            {errorMessage}
          </div>
        ) : null}

        <TrendChart data={history} />
      </div>
    </main>
  );
}