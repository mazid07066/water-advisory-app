import TrendChart from "@/components/TrendChart";

async function getHistory() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/history`, { cache: "no-store" });
  return res.json();
}

export default async function TrendsPage() {
  const history = await getHistory();

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