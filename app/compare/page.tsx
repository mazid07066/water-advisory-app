import SourceComparisonTable from "@/components/SourceComparisonTable";

const rows = [
  {
    source: "ব্রহ্মপুত্র নদীর পানি",
    count: 100,
    avgPH: 0,
    avgTemp: 0,
    avgTds: 0,
    avgTurbidity: 0,
    score: 0,
    status: "Caution" as const,
  },
  {
    source: "পুকুরের পানি",
    count: 100,
    avgPH: 0,
    avgTemp: 0,
    avgTds: 0,
    avgTurbidity: 0,
    score: 0,
    status: "Unsafe" as const,
  },
  {
    source: "সংরক্ষিত বৃষ্টির পানি",
    count: 100,
    avgPH: 0,
    avgTemp: 0,
    avgTds: 0,
    avgTurbidity: 0,
    score: 0,
    status: "Safe" as const,
  },
  {
    source: "পানযোগ্য পানি",
    count: 100,
    avgPH: 0,
    avgTemp: 0,
    avgTds: 0,
    avgTurbidity: 0,
    score: 0,
    status: "Safe" as const,
  },
];

export default function ComparePage() {
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