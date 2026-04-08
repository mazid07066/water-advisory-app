import SourceComparisonTable from "@/components/SourceComparisonTable";

async function getCompareData() {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/compare`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load compare data");
  }

  return res.json();
}

export default async function ComparePage() {
  const rows = await getCompareData();

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">জল উৎস তুলনা</h1>
        <p className="text-lg text-slate-700">
          বিভিন্ন উৎসের পানির গড় মান তুলনা দেখানোর জন্য এই অংশ।
        </p>
        <SourceComparisonTable rows={rows} />
      </div>
    </main>
  );
}