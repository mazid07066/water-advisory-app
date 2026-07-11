import type {
  ThingSpeakFeed,
  WaterStatusCode,
} from "@/lib/types";

export type SensorSample = {
  time: string;
  pH: number;
  temp: number;
  tds: number;
  statusCode: WaterStatusCode | null;
};

function safeNumber(value: unknown): number {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return 0;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function statusCode(
  value: unknown
): WaterStatusCode | null {
  const parsed = Math.round(safeNumber(value));

  if (
    parsed === 1 ||
    parsed === 2 ||
    parsed === 3 ||
    parsed === 4
  ) {
    return parsed;
  }

  return null;
}

export function parseSample(
  feed: ThingSpeakFeed
): SensorSample {
  return {
    time:
      feed.created_at ||
      new Date().toISOString(),

    pH: safeNumber(feed.field1),
    tds: safeNumber(feed.field2),
    temp: safeNumber(feed.field3),
    statusCode: statusCode(feed.field4),
  };
}

export function median(
  values: number[]
): number {
  const valid = values.filter(
    Number.isFinite
  );

  if (valid.length === 0) {
    return 0;
  }

  const sorted = [...valid].sort(
    (a, b) => a - b
  );

  const middle =
    Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) {
    return sorted[middle];
  }

  return (
    sorted[middle - 1] +
    sorted[middle]
  ) / 2;
}

export function smoothSamples(
  samples: SensorSample[]
): SensorSample[] {
  return samples.map(
    (sample, index, allSamples) => {
      const window = allSamples.slice(
        Math.max(0, index - 2),
        Math.min(
          allSamples.length,
          index + 3
        )
      );

      return {
        ...sample,
        pH: median(
          window.map((item) => item.pH)
        ),
        tds: median(
          window.map((item) => item.tds)
        ),
        temp: median(
          window.map((item) => item.temp)
        ),
      };
    }
  );
}