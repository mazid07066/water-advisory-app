export type SensorSample = {
  time: string;
  pH: number;
  temp: number;
  tds: number;
  turbidity: number;
};

function safeNumber(v: any): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeTemp(temp: number): number {
  // Convert to Celsius if uploaded in Fahrenheit range
  if (temp > 45 && temp < 130) {
    return ((temp - 32) * 5) / 9;
  }
  return temp;
}

export function parseSample(feed: any): SensorSample {
  return {
    time: feed.created_at,
    pH: safeNumber(feed.field1),
    temp: normalizeTemp(safeNumber(feed.field2)),
    tds: safeNumber(feed.field3),
    turbidity: safeNumber(feed.field4),
  };
}

export function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function smoothSamples(samples: SensorSample[]) {
  return samples.map((sample, i, arr) => {
    const window = arr.slice(Math.max(0, i - 2), Math.min(arr.length, i + 3));
    return {
      time: sample.time,
      pH: median(window.map((x) => x.pH)),
      temp: median(window.map((x) => x.temp)),
      tds: median(window.map((x) => x.tds)),
      turbidity: median(window.map((x) => x.turbidity)),
    };
  });
}