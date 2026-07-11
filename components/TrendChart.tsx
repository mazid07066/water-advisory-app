"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TrendPoint = {
  time: string;
  pH: number;
  temp: number;
  tds: number;
};

function ParameterChart({
  data,
  dataKey,
  title,
  unit,
}: {
  data: TrendPoint[];
  dataKey: "pH" | "temp" | "tds";
  title: string;
  unit: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg md:p-6">
      <h3 className="text-xl font-bold text-slate-900">
        {title}
      </h3>

      <div className="mt-4 h-72">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="time"
              hide
            />

            <YAxis />

            <Tooltip
              formatter={(value) => [
                `${Number(value).toFixed(2)} ${unit}`,
                title,
              ]}
              labelFormatter={(label) =>
                new Intl.DateTimeFormat(
                  "bn-BD",
                  {
                    timeZone: "Asia/Dhaka",
                    dateStyle: "medium",
                    timeStyle: "short",
                  }
                ).format(new Date(String(label)))
              }
            />

            <Line
              type="monotone"
              dataKey={dataKey}
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

export default function TrendChart({
  data,
}: {
  data: TrendPoint[];
}) {
  if (data.length === 0) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        কোনো ঐতিহাসিক ডেটা পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ParameterChart
        data={data}
        dataKey="pH"
        title="pH Trend"
        unit=""
      />

      <ParameterChart
        data={data}
        dataKey="tds"
        title="Estimated TDS Trend"
        unit="ppm"
      />

      <ParameterChart
        data={data}
        dataKey="temp"
        title="Temperature Trend"
        unit="°C"
      />
    </div>
  );
}