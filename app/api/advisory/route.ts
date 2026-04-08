import { NextResponse } from "next/server";
import { fetchLatestFeed } from "@/lib/thingspeak";
import { parseSample } from "@/lib/preprocess";
import { evaluateWater } from "@/lib/advisory";

export async function GET() {
  try {
    const latest = await fetchLatestFeed();
    const sample = parseSample(latest);
    const advisory = evaluateWater(sample);

    return NextResponse.json({ sample, advisory });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not generate advisory" },
      { status: 500 }
    );
  }
}