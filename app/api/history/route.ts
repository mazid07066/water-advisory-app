import { NextRequest, NextResponse } from "next/server";

import { fetchHistorySamples } from "@/lib/thingspeak";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const requestedResults = Number(
      request.nextUrl.searchParams.get("results") ?? "100"
    );

    const results = Number.isFinite(requestedResults)
      ? Math.min(Math.max(Math.trunc(requestedResults), 1), 8000)
      : 100;

    const samples = await fetchHistorySamples(results);

    return NextResponse.json(
      {
        success: true,
        count: samples.length,
        samples,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve historical data.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}