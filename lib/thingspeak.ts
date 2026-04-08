const CHANNEL_ID = process.env.THINGSPEAK_CHANNEL_ID;
const READ_API_KEY = process.env.THINGSPEAK_READ_API_KEY;

function ensureEnv() {
  if (!CHANNEL_ID) {
    throw new Error("Missing THINGSPEAK_CHANNEL_ID");
  }

  if (!READ_API_KEY) {
    throw new Error("Missing THINGSPEAK_READ_API_KEY");
  }
}

function buildUrl(path: string): string {
  ensureEnv();
  const base = `https://api.thingspeak.com/channels/${CHANNEL_ID}`;
  return `${base}${path}${path.includes("?") ? "&" : "?"}api_key=${READ_API_KEY}`;
}

export async function fetchLatestFeed() {
  const url = buildUrl("/feeds/last.json");
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ThingSpeak latest fetch failed: ${res.status} ${text}`);
  }

  return res.json();
}

export async function fetchHistoryFeed(results = 100) {
  const url = buildUrl(`/feeds.json?results=${results}`);
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ThingSpeak history fetch failed: ${res.status} ${text}`);
  }

  return res.json();
}