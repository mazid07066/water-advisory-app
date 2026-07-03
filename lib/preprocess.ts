import { calibrateSample, type RawSensorValues } from "@/lib/calibration";

export type SensorSample = {
  time: string;

  // calibrated values used by dashboard and decision engine
  pH: number;
  temp: number;
  tds: number;
  turbidity: number;

  // raw values preserved for technical transparency
  rawPH?: number;
  rawTemp?: number;
  rawTDS?: number;
  rawTurbidity?: number;

  statusCode?: number;
  mappingMode?: "current_web" | "old_nodemcu" | "unknown";
};

function safeNumber(value: unknown): number {
  const n = parseFloat(String(value ?? ""));
  return Number.isFinite(n) ? n : 0;
}

function normalizeTemp(value: number): number {
  if (value > 45 && value < 130) {
    return ((value - 32) * 5) / 9;
  }

  return value;
}

function isLikelyTemperature(value: number): boolean {
  const c = normalizeTemp(value);
  return c >= 0 && c <= 50;
}

export function parseSample(feed: any): SensorSample {
  const f1 = safeNumber(feed?.field1);
  const f2 = safeNumber(feed?.field2);
  const f3 = safeNumber(feed?.field3);
  const f4 = safeNumber(feed?.field4);
  const f5 = Math.round(safeNumber(feed?.field5));

  /*
    Supported ThingSpeak mappings:

    current_web:
    field1 = pH
    field2 = Temperature
    field3 = TDS
    field4 = Turbidity

    old_nodemcu:
    field1 = pH
    field2 = TDS
    field3 = Turbidity
    field4 = Temperature
  */

  const field2LooksTemp = isLikelyTemperature(f2);
  const field4LooksTemp = isLikelyTemperature(f4);

  let raw: RawSensorValues;
  let mappingMode: SensorSample["mappingMode"];

  if (field2LooksTemp && !field4LooksTemp) {
    raw = {
      pH: f1,
      temp: f2,
      tds: f3,
      turbidity: f4,
    };
    mappingMode = "current_web";
  } else if (!field2LooksTemp && field4LooksTemp) {
    raw = {
      pH: f1,
      temp: f4,
      tds: f2,
      turbidity: f3,
    };
    mappingMode = "old_nodemcu";
  } else {
    raw = {
      pH: f1,
      temp: f2,
      tds: f3,
      turbidity: f4,
    };
    mappingMode = "unknown";
  }

  const calibrated = calibrateSample(raw);

  return {
    time: feed?.created_at ?? new Date().toISOString(),

    pH: calibrated.pH,
    temp: calibrated.temp,
    tds: calibrated.tds,
    turbidity: calibrated.turbidity,

    rawPH: raw.pH,
    rawTemp: raw.temp,
    rawTDS: raw.tds,
    rawTurbidity: raw.turbidity,

    statusCode: f5,
    mappingMode,
  };
}

export function median(values: number[]): number {
  const valid = values.filter((v) => Number.isFinite(v));

  if (!valid.length) return 0;

  const sorted = [...valid].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }

  return (sorted[mid - 1] + sorted[mid]) / 2;
}

export function smoothSamples(samples: SensorSample[]): SensorSample[] {
  return samples.map((sample, i, arr) => {
    const window = arr.slice(Math.max(0, i - 2), Math.min(arr.length, i + 3));

    return {
      ...sample,
      pH: median(window.map((x) => x.pH)),
      temp: median(window.map((x) => x.temp)),
      tds: median(window.map((x) => x.tds)),
      turbidity: median(window.map((x) => x.turbidity)),
    };
  });
}