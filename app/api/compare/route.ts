import { NextResponse } from "next/server";
import compareProfiles from "@/data/compare_profiles.json";
import type { CompareProfile } from "@/lib/types";

export async function GET() {
  try {
    const profiles = compareProfiles as CompareProfile[];
    const sorted = [...profiles].sort((a, b) => b.score - a.score);

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