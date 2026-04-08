import { SensorSample } from "./preprocess";
import { evaluateWater } from "./advisory";

export type SourceStats = {
  source: string;
  count: number;
  avgPH: number;
  avgTemp: number;
  avgTds: number;
  avgTurbidity: number;
  score: number;
  status: "Safe" | "Caution" | "Unsafe";
};

function avg(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function buildSourceStats(source: string, samples: SensorSample[]): SourceStats {
  const avgPH = avg(samples.map((x) => x.pH));
  const avgTemp = avg(samples.map((x) => x.temp));
  const avgTds = avg(samples.map((x) => x.tds));
  const avgTurbidity = avg(samples.map((x) => x.turbidity));

  const advisory = evaluateWater({
    time: new Date().toISOString(),
    pH: avgPH,
    temp: avgTemp,
    tds: avgTds,
    turbidity: avgTurbidity,
  });

  return {
    source,
    count: samples.length,
    avgPH,
    avgTemp,
    avgTds,
    avgTurbidity,
    score: advisory.score,
    status: advisory.overallStatus,
  };
}