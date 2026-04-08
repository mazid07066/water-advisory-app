import TrendChart from "@/components/TrendChart";
import { fetchHistoryFeed } from "@/lib/thingspeak";
import { parseSample, smoothSamples, type SensorSample } from "@/lib/preprocess";

export const dynamic = "force-dynamic";

export default async function TrendsPage() {
  let history: SensorSample[] = [];

  try {
    const historyData = await fetchHistoryFeed(150);
    const parsedHistory: SensorSample[] = (historyData.feeds || []).map(parseSample);
    history = smoothSamples(parsedHistory);
  } catch (error) {
    console.error("Trends page load failed:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">পানির প্রবণতা বিশ্লেষণ</h1>
        <p className="text-lg text-slate-700">
          সর্বশেষ সেন্সর ডেটার ট্রেন্ড এখানে দেখা যাবে।
        </p>
        <TrendChart data={history} />
      </div>
    </main>
  );
}