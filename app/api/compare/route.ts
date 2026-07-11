import { NextResponse } from "next/server";

import compareProfiles from "@/data/compare_profiles.json";

import type {
  CompareProfile,
} from "@/lib/types";

export async function GET() {
  try {
    const profiles =
      compareProfiles as CompareProfile[];

    const sorted = [...profiles].sort(
      (a, b) => b.score - a.score
    );

    return NextResponse.json({
      success: true,
      best: sorted[0] ?? null,
      worst:
        sorted.length > 0
          ? sorted[sorted.length - 1]
          : null,
      profiles: sorted,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Compare data load failed.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}