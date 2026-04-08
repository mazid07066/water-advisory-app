import { NextResponse } from "next/server";
import { fetchHistoryFeed } from "@/lib/thingspeak";
import { parseSample, smoothSamples } from "@/lib/preprocess";

export async function GET() {
  try {
    const data = await fetchHistoryFeed(150);
    const feeds = data.feeds || [];
    const parsed = feeds.map(parseSample);
    const smoothed = smoothSamples(parsed);
    return NextResponse.json(smoothed);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not fetch history" },
      { status: 500 }
    );
  }
}