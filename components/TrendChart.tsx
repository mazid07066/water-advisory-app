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

type ParameterChartProps = {
  data: TrendPoint[];
  dataKey: "pH" | "temp" | "tds";
  title: string;
  unit: string;
  lineColor: string;
  description: string;
};

/**
 * Convert ThingSpeak ISO timestamp into a compact
 * Bangladesh-time label for the X-axis.
 *
 * Example:
 * 10 Jul, 05:19 PM
 */
function formatXAxisTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Display a complete Bangladesh-time timestamp
 * inside the tooltip.
 */
function formatTooltipTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

/**
 * Prevent X-axis timestamp labels from overlapping.
 *
 * This only controls how many labels are shown.
 * All sensor data points are still plotted.
 */
function getXAxisInterval(dataLength: number): number {
  if (dataLength <= 6) {
    return 0;
  }

  if (dataLength <= 12) {
    return 1;
  }

  if (dataLength <= 25) {
    return 3;
  }

  if (dataLength <= 50) {
    return 7;
  }

  if (dataLength <= 100) {
    return 14;
  }

  return 24;
}

function ParameterChart({
  data,
  dataKey,
  title,
  unit,
  lineColor,
  description,
}: ParameterChartProps) {
  const xAxisInterval = getXAxisInterval(data.length);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg md:p-5">
      {/* Chart heading */}
      <div>
        <h3 className="text-xl font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm font-medium text-slate-500">
          {description}
        </p>
      </div>

      {/* Compact chart area */}
      <div className="mt-3 h-[275px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data}
            margin={{
              top: 8,
              right: 18,
              left: 0,
              bottom: 48,
            }}
          >
            {/* Background grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#cbd5e1"
            />

            {/* Visible X-axis timestamps */}
            <XAxis
              dataKey="time"
              interval={xAxisInterval}
              minTickGap={18}
              tick={{
                fontSize: 11,
                fill: "#475569",
              }}
              tickLine={{
                stroke: "#94a3b8",
              }}
              axisLine={{
                stroke: "#cbd5e1",
              }}
              tickFormatter={formatXAxisTime}
              angle={-30}
              textAnchor="end"
              height={60}
            />

            {/* Y-axis */}
            <YAxis
              width={48}
              tick={{
                fontSize: 11,
                fill: "#475569",
              }}
              tickLine={{
                stroke: "#94a3b8",
              }}
              axisLine={{
                stroke: "#cbd5e1",
              }}
              domain={["auto", "auto"]}
            />

            {/* Hover tooltip */}
            <Tooltip
              formatter={(value) => [
                `${Number(value).toFixed(2)}${unit ? ` ${unit}` : ""}`,
                title,
              ]}
              labelFormatter={(label) =>
                `Collected: ${formatTooltipTime(String(label))}`
              }
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                boxShadow:
                  "0 10px 25px rgba(15, 23, 42, 0.12)",
              }}
              labelStyle={{
                color: "#0f172a",
                fontWeight: 700,
                marginBottom: "6px",
              }}
            />

            {/* Sensor trend line */}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={lineColor}
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: lineColor,
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              isAnimationActive={false}
              connectNulls
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
      {/* pH chart - Blue */}
      <ParameterChart
        data={data}
        dataKey="pH"
        title="pH Trend"
        unit=""
        lineColor="#2563eb"
        description="Collection time shown in Bangladesh Standard Time"
      />

      {/* TDS chart - Green */}
      <ParameterChart
        data={data}
        dataKey="tds"
        title="Estimated TDS Trend"
        unit="ppm"
        lineColor="#16a34a"
        description="Collection time shown in Bangladesh Standard Time"
      />

      {/* Temperature chart - Orange/red */}
      <ParameterChart
        data={data}
        dataKey="temp"
        title="Temperature Trend"
        unit="°C"
        lineColor="#ea580c"
        description="Collection time shown in Bangladesh Standard Time"
      />
    </div>
  );
}