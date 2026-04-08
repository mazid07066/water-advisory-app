export type FeedRow = {
  created_at: string;
  entry_id: number;
  field1?: string; // pH
  field2?: string; // Temp
  field3?: string; // TDS
  field4?: string; // Turbidity
};

const CHANNEL_ID = process.env.THINGSPEAK_CHANNEL_ID!;
const READ_API_KEY = process.env.THINGSPEAK_READ_API_KEY!;

function buildUrl(path: string) {
  const base = `https://api.thingspeak.com/channels/${CHANNEL_ID}`;
  const apiPart = READ_API_KEY ? `api_key=${READ_API_KEY}` : "";
  return `${base}${path}${path.includes("?") ? "&" : "?"}${apiPart}`;
}

export async function fetchLatestFeed() {
  const url = buildUrl("/feeds/last.json");
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch latest feed from ThingSpeak");
  return res.json();
}

export async function fetchHistoryFeed(results = 100) {
  const url = buildUrl(`/feeds.json?results=${results}`);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch history from ThingSpeak");
  return res.json();
}