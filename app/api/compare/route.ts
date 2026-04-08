import { NextResponse } from "next/server";
import { sourceProfiles } from "@/lib/sourceProfiles";

export async function GET() {
  try {
    const sorted = [...sourceProfiles].sort((a, b) => b.score - a.score);

    return NextResponse.json({
      best: sorted[0],
      worst: sorted[sorted.length - 1],
      profiles: sorted,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Compare data load failed" },
      { status: 500 }
    );
  }
}