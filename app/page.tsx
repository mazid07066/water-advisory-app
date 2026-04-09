import AdvisoryCard from "@/components/AdvisoryCard";
import MetricGrid from "@/components/MetricGrid";
import StatusCard from "@/components/StatusCard";
import TrendChart from "@/components/TrendChart";
import ActionButtons from "@/components/ActionButtons";
import PredictionPanel from "@/components/PredictionPanel";

import { fetchLatestFeed, fetchHistoryFeed } from "@/lib/thingspeak";
import { parseSample, smoothSamples, type SensorSample } from "@/lib/preprocess";
import { evaluateWater, type AdvisoryResult } from "@/lib/advisory";
import { getDeviceStatus, formatBanglaDateTime } from "@/lib/deviceStatus";
import {
  predictSource,
  predictUsage,
  sourceLabelBn,
  usageLabelBn,
  usageAdviceBn,
} from "@/lib/mlPredict";

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
    drinking: "ডেটা পাওয়া যায়নি",
    cooking: "ডেটা পাওয়া যায়নি",
    bathing: "ডেটা পাওয়া যায়নি",
    irrigation: "ডেটা পাওয়া যায়নি",
    livestock: "ডেটা পাওয়া যায়নি",
    summaryBn: "ThingSpeak থেকে ডেটা আনা যায়নি।",
    score: 0,
    reasons: ["ডেটা সংযোগ ব্যর্থ"],
  };

  let history: SensorSample[] = [];
  let deviceStatus: "ON" | "OFF" = "OFF";
  let lastUpdatedText = "অজানা সময়";
  let usingLastStoredData = false;
  let dataError = false;

  let sourcePrediction = {
    label: "অজানা",
    confidence: 0,
  };

  let usagePrediction = {
    label: "অজানা",
    confidence: 0,
  };

  let usageAdvice = "পূর্বাভাস তৈরি করা যায়নি।";

  try {
    const latestFeed = await fetchLatestFeed();
    sample = parseSample(latestFeed);

    const hasRealValues =
      sample.pH !== 0 ||
      sample.temp !== 0 ||
      sample.tds !== 0 ||
      sample.turbidity !== 0;

    if (hasRealValues) {
      advisory = evaluateWater(sample);
      usingLastStoredData = true;

      const srcPred = predictSource(sample);
      const usePred = predictUsage(sample);

      sourcePrediction = {
        label: sourceLabelBn(srcPred.label),
        confidence: srcPred.confidence,
      };

      usagePrediction = {
        label: usageLabelBn(usePred.label),
        confidence: usePred.confidence,
      };

      usageAdvice = usageAdviceBn(usePred.label);
    } else {
      advisory = {
        overallStatus: "Unsafe",
        drinking: "সর্বশেষ ডেটা অসম্পূর্ণ",
        cooking: "সর্বশেষ ডেটা অসম্পূর্ণ",
        bathing: "সর্বশেষ ডেটা অসম্পূর্ণ",
        irrigation: "সর্বশেষ ডেটা অসম্পূর্ণ",
        livestock: "সর্বশেষ ডেটা অসম্পূর্ণ",
        summaryBn: "ThingSpeak-এ সর্বশেষ ডেটা আছে, কিন্তু সেটি অসম্পূর্ণ।",
        score: 0,
        reasons: ["অসম্পূর্ণ ডেটা"],
      };
    }

    deviceStatus = getDeviceStatus(sample.time, 30);
    lastUpdatedText = formatBanglaDateTime(sample.time);

    const historyData = await fetchHistoryFeed(100);
    const parsed = (historyData.feeds || []).map(parseSample);
    history = smoothSamples(parsed);
  } catch (error) {
    console.error("Home page data load failed:", error);
    dataError = true;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white p-6 md:p-8 shadow-xl border border-blue-500">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
              পানিবন্ধু
            </h1>

            <p className="text-lg md:text-2xl mt-3 font-medium text-blue-50 leading-relaxed">
              পানির মান দেখে সহজ ভাষায় ব্যবহার পরামর্শ
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-xl bg-white/18 px-4 py-2 text-sm md:text-base font-semibold text-white backdrop-blur-sm border border-white/20 shadow-sm">
                📍 উৎস: Brahmaputra River Sample
              </span>

              <span
                className={`inline-flex items-center rounded-xl px-4 py-2 text-sm md:text-base font-semibold border shadow-sm ${
                  deviceStatus === "ON"
                    ? "bg-emerald-500/20 text-white border-emerald-200/40"
                    : "bg-rose-500/20 text-white border-rose-200/40"
                }`}
              >
                {deviceStatus === "ON" ? "🟢 সেন্সর স্ট্যাটাস: ON" : "🔴 সেন্সর স্ট্যাটাস: OFF"}
              </span>
            </div>

            <p className="mt-3 text-sm md:text-base font-medium text-blue-100">
              ⏱ সর্বশেষ আপডেট: {lastUpdatedText}
            </p>

            {!dataError && usingLastStoredData && deviceStatus === "OFF" && (
              <p className="mt-2 text-sm md:text-base font-medium text-amber-100">
                ⚠️ সেন্সর বর্তমানে বন্ধ। শেষ আপলোড হওয়া ডেটা দেখানো হচ্ছে।
              </p>
            )}

            {dataError && (
              <p className="mt-2 text-sm md:text-base font-medium text-rose-100">
                ❌ ডেটা সার্ভার থেকে আনা যায়নি।
              </p>
            )}

            <div className="mt-6">
              <ActionButtons />
            </div>
          </div>
        </header>

        <StatusCard
          status={advisory.overallStatus}
          score={advisory.score}
          summary={advisory.summaryBn}
        />

        <PredictionPanel
          sourceLabelBn={sourcePrediction.label}
          sourceConfidence={sourcePrediction.confidence}
          usageLabelBn={usagePrediction.label}
          usageConfidence={usagePrediction.confidence}
          adviceBn={usageAdvice}
        />

        <MetricGrid
          pH={sample.pH}
          temp={sample.temp}
          tds={sample.tds}
          turbidity={sample.turbidity}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <AdvisoryCard title="পান করা" value={advisory.drinking} emoji="🥤" />
          <AdvisoryCard title="রান্না" value={advisory.cooking} emoji="🍲" />
          <AdvisoryCard title="গোসল" value={advisory.bathing} emoji="🧼" />
          <AdvisoryCard title="সেচ" value={advisory.irrigation} emoji="🌾" />
          <AdvisoryCard title="গবাদি পশু" value={advisory.livestock} emoji="🐄" />
          <AdvisoryCard
            title="সমস্যার কারণ"
            value={advisory.reasons.length > 0 ? advisory.reasons.join(", ") : "উল্লেখযোগ্য সমস্যা নেই"}
            emoji="⚠️"
          />
        </div>

        <TrendChart data={history} />
      </div>
    </main>
  );
}