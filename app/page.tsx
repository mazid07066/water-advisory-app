import AdvisoryCard from "@/components/AdvisoryCard";
import MetricGrid from "@/components/MetricGrid";
import StatusCard from "@/components/StatusCard";
import TrendChart from "@/components/TrendChart";
import ActionButtons from "@/components/ActionButtons";

import { fetchLatestFeed, fetchHistoryFeed } from "@/lib/thingspeak";
import { parseSample, smoothSamples, type SensorSample } from "@/lib/preprocess";
import { evaluateWater, type AdvisoryResult } from "@/lib/advisory";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let sample: SensorSample = {
    time: new Date().toISOString(),
    pH: 0,
    temp: 0,
    tds: 0,
    turbidity: 0,
  };

  let advisory: AdvisoryResult = {
    overallStatus: "Unsafe",
    drinking: "ডেটা নেই",
    cooking: "ডেটা নেই",
    bathing: "ডেটা নেই",
    irrigation: "ডেটা নেই",
    livestock: "ডেটা নেই",
    summaryBn: "ডেটা পাওয়া যায়নি",
    score: 0,
    reasons: ["ডেটা সংযোগ ব্যর্থ"],
  };

  let history: SensorSample[] = [];

  try {
    const latestFeed = await fetchLatestFeed();
    sample = parseSample(latestFeed);
    advisory = evaluateWater(sample);

    const historyData = await fetchHistoryFeed(100);
    const parsed = (historyData.feeds || []).map(parseSample);
    history = smoothSamples(parsed);
  } catch (e) {
    console.log(e);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <header className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white p-6 md:p-8 shadow-xl border border-blue-500">
  <div className="max-w-4xl">
    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
      গ্রাম ওয়াটার অ্যাডভাইজর
    </h1>

    <p className="text-lg md:text-2xl mt-3 font-medium text-blue-50 leading-relaxed">
      পানির মান দেখে সহজ ভাষায় ব্যবহার পরামর্শ
    </p>

    <div className="mt-5 flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center rounded-xl bg-white/18 px-4 py-2 text-sm md:text-base font-semibold text-white backdrop-blur-sm border border-white/20 shadow-sm">
        📍 উৎস: Brahmaputra River Sample
      </span>
    </div>

    <p className="mt-3 text-sm md:text-base font-medium text-blue-100">
      ⏱ সর্বশেষ আপডেট: {new Date(sample.time).toLocaleString()}
    </p>

    <div className="mt-6">
      <ActionButtons />
    </div>
  </div>
</header>

        {/* STATUS */}
        <StatusCard
          status={advisory.overallStatus}
          score={advisory.score}
          summary={advisory.summaryBn}
        />

        {/* METRICS */}
        <MetricGrid
          pH={sample.pH}
          temp={sample.temp}
          tds={sample.tds}
          turbidity={sample.turbidity}
        />

        {/* ADVISORY */}
        <div className="grid md:grid-cols-2 gap-4">
          <AdvisoryCard title="পান করা" value={advisory.drinking} emoji="🥤" />
          <AdvisoryCard title="রান্না" value={advisory.cooking} emoji="🍲" />
          <AdvisoryCard title="গোসল" value={advisory.bathing} emoji="🧼" />
          <AdvisoryCard title="সেচ" value={advisory.irrigation} emoji="🌾" />
          <AdvisoryCard title="গবাদি পশু" value={advisory.livestock} emoji="🐄" />
          <AdvisoryCard
            title="সমস্যার কারণ"
            value={advisory.reasons.join(", ")}
            emoji="⚠️"
          />
        </div>

        {/* TREND */}
        <TrendChart data={history} />
      </div>
    </main>
  );
}