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
    <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="text-xl md:text-2xl font-bold text-slate-900">
          সাম্প্রতিক প্রবণতা
        </h3>
        <p className="text-slate-600 text-sm md:text-base mt-1">
          pH, তাপমাত্রা, TDS এবং ঘোলাভাবের ধারাবাহিক পরিবর্তন
        </p>
      </div>

      <div className="h-[420px] md:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 25, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="time" hide />
            <YAxis stroke="#475569" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #cbd5e1",
                color: "#0f172a",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="pH"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
              name="pH"
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={false}
              name="Temp"
            />
            <Line
              type="monotone"
              dataKey="tds"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              name="TDS"
            />
            <Line
              type="monotone"
              dataKey="turbidity"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              name="Turbidity"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}