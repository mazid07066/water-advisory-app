type Props = {
  title: string;
  value: string;
};

export default function AdvisoryCard({ title, value }: Props) {
  return (
    <div className="rounded-2xl shadow-md border p-4 bg-white">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-xl leading-8">{value}</p>
    </div>
  );
}