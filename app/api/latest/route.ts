import { NextResponse } from "next/server";

import { evaluateWater } from "@/lib/advisory";
import { getDeviceStatusInfo } from "@/lib/deviceStatus";
import { fetchLatestSample } from "@/lib/thingspeak";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const sample = await fetchLatestSample();
    const advisory = evaluateWater(sample);
    const device = getDeviceStatusInfo(sample.createdAt);

    return NextResponse.json(
      {
        success: true,
        sample,
        advisory,
        device,
        schema: {
  field1: "Calibrated pH",
  field2: "Corrected estimated TDS (ppm)",
  field3: "Water temperature (°C)",
  field4: "Water status code",
},
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
        : "Unable to retrieve ThingSpeak data.";

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