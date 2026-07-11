"use client";

import { useEffect, useState } from "react";

import {
  getDeviceStatusInfo,
} from "@/lib/deviceStatus";

import type {
  DeviceStatusInfo,
} from "@/lib/types";

export default function DeviceStatusBadge({
  lastUpdatedIso,
}: {
  lastUpdatedIso: string;
}) {
  const [info, setInfo] =
    useState<DeviceStatusInfo>(() =>
      getDeviceStatusInfo(lastUpdatedIso)
    );

  useEffect(() => {
    const refresh = () => {
      setInfo(getDeviceStatusInfo(lastUpdatedIso));
    };

    const firstRefresh = window.setTimeout(
      refresh,
      0
    );

    const timer = window.setInterval(
      refresh,
      60_000
    );

    return () => {
      window.clearTimeout(firstRefresh);
      window.clearInterval(timer);
    };
  }, [lastUpdatedIso]);

  const badgeClass =
    info.status === "online"
      ? "bg-emerald-500/20 border-emerald-200/40"
      : info.status === "offline"
        ? "bg-rose-500/20 border-rose-200/40"
        : "bg-amber-500/20 border-amber-200/40";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className={`inline-flex items-center rounded-xl border px-4 py-2 text-sm font-semibold text-white shadow-sm md:text-base ${badgeClass}`}
      >
        {info.status === "online" ? "●" : "○"}{" "}
        {info.labelBn}
      </span>

      <span className="inline-flex items-center rounded-xl border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur md:text-base">
        সর্বশেষ আপডেট: {info.lastUpdatedText}
      </span>

      {info.ageMinutes !== null ? (
        <span className="inline-flex items-center rounded-xl border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur md:text-base">
          {Math.floor(info.ageMinutes)} মিনিট আগে
        </span>
      ) : null}
    </div>
  );
}