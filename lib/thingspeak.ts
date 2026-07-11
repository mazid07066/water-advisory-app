import type {
  ThingSpeakFeed,
  ThingSpeakResponse,
  WaterSample,
  WaterStatusCode,
} from "@/lib/types";

const CHANNEL_ID =
  process.env.THINGSPEAK_CHANNEL_ID?.trim() || "3325501";

const READ_API_KEY =
  process.env.THINGSPEAK_READ_API_KEY?.trim() || "";

const BASE_URL =
  `https://api.thingspeak.com/channels/${CHANNEL_ID}`;

function buildQuery(
  values: Record<string, string | number>
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    params.set(key, String(value));
  }

  if (READ_API_KEY) {
    params.set("api_key", READ_API_KEY);
  }

  return params.toString();
}

function parseNumber(
  value: string | null | undefined
): number | null {
  if (
    value === null ||
    value === undefined ||
    value.trim() === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function parseStatusCode(
  value: string | null | undefined
): WaterStatusCode | null {
  const parsed = parseNumber(value);

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
): WaterSample {
  return {
    entryId: feed.entry_id,
    createdAt: feed.created_at,
    ph: parseNumber(feed.field1),
    tds: parseNumber(feed.field2),
    temperature: parseNumber(feed.field3),
    statusCode: parseStatusCode(feed.field4),
  };
}

function hasMeasurement(sample: WaterSample): boolean {
  return (
    sample.ph !== null ||
    sample.tds !== null ||
    sample.temperature !== null
  );
}

export async function fetchLatestFeed():
Promise<ThingSpeakFeed> {
  const query = buildQuery({ results: 1 });

  const response = await fetch(
    `${BASE_URL}/feeds.json?${query}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `ThingSpeak request failed: HTTP ${response.status}`
    );
  }

  const data =
    (await response.json()) as ThingSpeakResponse;

  const latest = data.feeds?.at(-1);

  if (!latest) {
    throw new Error("ThingSpeak returned no feed entries.");
  }

  return latest;
}

export async function fetchLatestSample():
Promise<WaterSample> {
  const sample = parseSample(await fetchLatestFeed());

  if (!hasMeasurement(sample)) {
    throw new Error(
      "Latest ThingSpeak entry has no measurements."
    );
  }

  return sample;
}

export async function fetchHistoryFeed(
  results = 100
): Promise<ThingSpeakResponse> {
  const safeResults = Math.min(
    Math.max(Math.trunc(results), 1),
    8000
  );

  const query = buildQuery({
    results: safeResults,
  });

  const response = await fetch(
    `${BASE_URL}/feeds.json?${query}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `ThingSpeak history request failed: HTTP ${response.status}`
    );
  }

  return (await response.json()) as ThingSpeakResponse;
}

export async function fetchHistorySamples(
  results = 100
): Promise<WaterSample[]> {
  const data = await fetchHistoryFeed(results);

  return (data.feeds || [])
    .map(parseSample)
    .filter(hasMeasurement);
}