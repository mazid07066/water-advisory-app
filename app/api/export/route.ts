import { NextResponse } from "next/server";
import { fetchHistoryFeed } from "@/lib/thingspeak";
import { parseSample } from "@/lib/preprocess";
import { Parser } from "json2csv";

export async function GET() {
  try {
    const data = await fetchHistoryFeed(200);
    const feeds = (data.feeds || []).map(parseSample);

    const parser = new Parser({
      fields: ["time", "pH", "temp", "tds", "turbidity"],
    });
    const csv = parser.parse(feeds);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="water_history.csv"',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not export data" },
      { status: 500 }
    );
  }
}