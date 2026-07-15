"use client";

import { useEffect, useState } from "react";

import type { Language } from "@/lib/i18n";

type StoredLocation = {
  label?: string;
  lat?: string;
  lng?: string;
  method?: "browser" | "manual";
  accuracy?: number | null;
  capturedAt?: string;
};

const STORAGE_KEY = "water_advisor_location";
const LOCATION_UPDATED_EVENT =
  "water-advisor-location-updated";

function readSavedSource(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored =
    window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed =
      JSON.parse(stored) as StoredLocation;

    const label = parsed.label?.trim();

    return label || null;
  } catch {
    return null;
  }
}

export default function DynamicSourceBadge({
  language,
}: {
  language: Language;
}) {
  const [sourceName, setSourceName] =
    useState<string | null>(null);

  useEffect(() => {
    const refreshSource = () => {
      setSourceName(readSavedSource());
    };

    /*
      The initial read is placed in a timeout so the effect
      does not synchronously trigger a state update during
      the initial effect execution.
    */
    const initialTimer =
      window.setTimeout(refreshSource, 0);

    /*
      Handles updates made by another browser tab.
    */
    const handleStorage = (
      event: StorageEvent
    ) => {
      if (
        event.key === STORAGE_KEY ||
        event.key === null
      ) {
        refreshSource();
      }
    };

    /*
      Handles updates made by LocationSourceCard in the
      current browser tab.
    */
    const handleLocationUpdate = () => {
      refreshSource();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      LOCATION_UPDATED_EVENT,
      handleLocationUpdate
    );

    return () => {
      window.clearTimeout(initialTimer);

      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        LOCATION_UPDATED_EVENT,
        handleLocationUpdate
      );
    };
  }, []);

  const displayedSource =
    sourceName ||
    (language === "bn"
      ? "উৎস এখনো নির্ধারণ করা হয়নি"
      : "Source not yet specified");

  return (
    <span className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-base font-bold text-white backdrop-blur">
      📍{" "}
      {language === "bn"
        ? "উৎস"
        : "Source"}
      : {displayedSource}
    </span>
  );
}