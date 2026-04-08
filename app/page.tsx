import AdvisoryCard from "@/components/AdvisoryCard";
import MetricGrid from "@/components/MetricGrid";
import StatusCard from "@/components/StatusCard";
import TrendChart from "@/components/TrendChart";
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
    drinking: "ডেটা পাওয়া যায়নি",
    cooking: "ডেটা পাওয়া যায়নি",
    bathing: "ডেটা পাওয়া যায়নি",
    irrigation: "ডেটা পাওয়া যায়নি",
    livestock: "ডেটা পাওয়া যায়নি",
    summaryBn: "ThingSpeak থেকে ডেটা আনা যায়নি।",
    score: 0,
    reasons: ["ডেটা সংযোগ ব্যর্থ"],
  };

  let history: SensorSample[] = [];

  try {
    const latestFeed = await fetchLatestFeed();
    sample = parseSample(latestFeed);
    advisory = evaluateWater(sample);

    const historyData = await fetchHistoryFeed(100);
    const parsedHistory: SensorSample[] = (historyData.feeds || []).map(parseSample);
    history = smoothSamples(parsedHistory);
  } catch (error) {
    console.error("Home page data load failed:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="rounded-2xl bg-blue-700 text-white p-6 shadow">
          <h1 className="text-3xl md:text-4xl font-bold">
            গ্রাম ওয়াটার অ্যাডভাইজর
          </h1>
          <p className="text-lg mt-2">
            পানির মান দেখে সহজ ভাষায় ব্যবহার পরামর্শ
          </p>
        </header>

        <StatusCard
          status={advisory.overallStatus}
          score={advisory.score}
          summary={advisory.summaryBn}
        />

        <MetricGrid
          pH={sample.pH}
          temp={sample.temp}
          tds={sample.tds}
          turbidity={sample.turbidity}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <AdvisoryCard title="পান করার উপযোগিতা" value={advisory.drinking} />
          <AdvisoryCard title="রান্নার উপযোগিতা" value={advisory.cooking} />
          <AdvisoryCard title="গোসল / ধোয়া-মোছা" value={advisory.bathing} />
          <AdvisoryCard title="সেচের উপযোগিতা" value={advisory.irrigation} />
          <AdvisoryCard title="গবাদি পশুর ব্যবহার" value={advisory.livestock} />
          <AdvisoryCard
            title="সমস্যার কারণ"
            value={
              advisory.reasons.length > 0
                ? advisory.reasons.join(", ")
                : "উল্লেখযোগ্য সমস্যা নেই"
            }
          />
        </div>

        <TrendChart data={history} />
      </div>
    </main>
  );
}