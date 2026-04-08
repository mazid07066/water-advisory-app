type Props = {
  status: "Safe" | "Caution" | "Unsafe";
  score: number;
  summary: string;
};

export default function StatusCard({ status, score, summary }: Props) {
  const color =
    status === "Safe"
      ? "bg-green-100 border-green-400"
      : status === "Caution"
      ? "bg-yellow-100 border-yellow-400"
      : "bg-red-100 border-red-400";

  const statusBn =
    status === "Safe"
      ? "নিরাপদ"
      : status === "Caution"
      ? "সতর্কতা"
      : "অনিরাপদ";

  return (
    <div className={`rounded-2xl border-2 p-6 ${color}`}>
      <h2 className="text-3xl font-bold mb-2">সামগ্রিক অবস্থা: {statusBn}</h2>
      <p className="text-xl mb-2">নিরাপত্তা স্কোর: {score}/100</p>
      <p className="text-lg">{summary}</p>
    </div>
  );
}