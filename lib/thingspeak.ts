const CHANNEL_ID = process.env.THINGSPEAK_CHANNEL_ID;
const READ_API_KEY = process.env.THINGSPEAK_READ_API_KEY;

function ensureChannelId() {
  if (!CHANNEL_ID) {
    throw new Error("Missing THINGSPEAK_CHANNEL_ID");
  }
}

function buildUrl(path: string): string {
  ensureChannelId();

  const base = `https://api.thingspeak.com/channels/${CHANNEL_ID}`;
  const hasQuery = path.includes("?");
  const keyPart = READ_API_KEY ? `${hasQuery ? "&" : "?"}api_key=${READ_API_KEY}` : "";

  return `${base}${path}${keyPart}`;
}

export async function fetchLatestFeed() {
  const url = buildUrl("/feeds/last.json");
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ThingSpeak latest fetch failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  // last.json may return an object directly
  if (!data || typeof data !== "object") {
    throw new Error("ThingSpeak latest response invalid");
  }

  return data;
}

export async function fetchHistoryFeed(results = 100) {
  const url = buildUrl(`/feeds.json?results=${results}`);
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ThingSpeak history fetch failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  if (!data || !Array.isArray(data.feeds)) {
    throw new Error("ThingSpeak history response invalid");
  }

  return data;
}