type Props = {
  pH: number;
  temp: number;
  tds: number;
  turbidity: number;
};

export default function MetricGrid({ pH, temp, tds, turbidity }: Props) {
  const itemClass = "rounded-2xl border bg-white p-4 shadow";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className={itemClass}>
        <h4 className="font-semibold">pH</h4>
        <p className="text-2xl">{pH.toFixed(2)}</p>
      </div>
      <div className={itemClass}>
        <h4 className="font-semibold">তাপমাত্রা (°C)</h4>
        <p className="text-2xl">{temp.toFixed(2)}</p>
      </div>
      <div className={itemClass}>
        <h4 className="font-semibold">TDS</h4>
        <p className="text-2xl">{tds.toFixed(2)}</p>
      </div>
      <div className={itemClass}>
        <h4 className="font-semibold">ঘোলাভাব</h4>
        <p className="text-2xl">{turbidity.toFixed(2)}</p>
      </div>
    </div>
  );
}