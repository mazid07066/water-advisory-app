import { NextResponse } from "next/server";
import { fetchLatestFeed } from "@/lib/thingspeak";
import { parseSample } from "@/lib/preprocess";

export async function GET() {
  try {
    const latest = await fetchLatestFeed();
    const parsed = parseSample(latest);
    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not fetch latest data" },
      { status: 500 }
    );
  }
}