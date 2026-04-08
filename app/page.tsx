import AdvisoryCard from "@/components/AdvisoryCard";
import MetricGrid from "@/components/MetricGrid";
import StatusCard from "@/components/StatusCard";
import TrendChart from "@/components/TrendChart";

async function getLatest() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/advisory`, {
    cache: "no-store",
  });
  return res.json();
}

async function getHistory() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/history`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function HomePage() {
  const latest = await getLatest();
  const history = await getHistory();

  const sample = latest.sample;
  const advisory = latest.advisory;

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
            value={advisory.reasons.length ? advisory.reasons.join(", ") : "উল্লেখযোগ্য সমস্যা নেই"}
          />
        </div>

        <TrendChart data={history} />
      </div>
    </main>
  );
}