import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = [
      {
        source: "ব্রহ্মপুত্র নদীর পানি",
        count: 100,
        avgPH: 0,
        avgTemp: 0,
        avgTds: 0,
        avgTurbidity: 0,
        score: 0,
        status: "Caution",
      },
      {
        source: "পুকুরের পানি",
        count: 100,
        avgPH: 0,
        avgTemp: 0,
        avgTds: 0,
        avgTurbidity: 0,
        score: 0,
        status: "Unsafe",
      },
      {
        source: "সংরক্ষিত বৃষ্টির পানি",
        count: 100,
        avgPH: 0,
        avgTemp: 0,
        avgTds: 0,
        avgTurbidity: 0,
        score: 0,
        status: "Safe",
      },
      {
        source: "পানযোগ্য পানি",
        count: 100,
        avgPH: 0,
        avgTemp: 0,
        avgTds: 0,
        avgTurbidity: 0,
        score: 0,
        status: "Safe",
      },
    ];

    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Could not build compare data" },
      { status: 500 }
    );
  }
}