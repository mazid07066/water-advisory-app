import { NextResponse } from "next/server";

import { evaluateWater } from "@/lib/advisory";
import { fetchLatestSample } from "@/lib/thingspeak";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const sample = await fetchLatestSample();
    const advisory = evaluateWater(sample);

    return NextResponse.json(
      {
        success: true,
        sample,
        advisory,
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
        : "Unable to generate advisory.";

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