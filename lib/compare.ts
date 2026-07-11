import type {
  SensorSample,
} from "@/lib/preprocess";

export type SourceStats = {
  source: string;
  count: number;
  avgPH: number;
  avgTemp: number;
  avgTds: number;
};

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return (
    values.reduce(
      (total, value) => total + value,
      0
    ) / values.length
  );
}

export function buildSourceStats(
  source: string,
  samples: SensorSample[]
): SourceStats {
  return {
    source,
    count: samples.length,
    avgPH: average(
      samples.map((item) => item.pH)
    ),
    avgTemp: average(
      samples.map((item) => item.temp)
    ),
    avgTds: average(
      samples.map((item) => item.tds)
    ),
  };
}