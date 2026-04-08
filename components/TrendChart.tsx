"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

type TrendPoint = {
  time: string;
  pH: number;
  temp: number;
  tds: number;
  turbidity: number;
};

export default function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow h-[420px]">
      <h3 className="text-xl font-bold mb-4">সাম্প্রতিক প্রবণতা</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" hide />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pH" dot={false} />
          <Line type="monotone" dataKey="temp" dot={false} />
          <Line type="monotone" dataKey="tds" dot={false} />
          <Line type="monotone" dataKey="turbidity" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}