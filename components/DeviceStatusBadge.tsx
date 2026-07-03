"use client";

import { useEffect, useState } from "react";
import {
  getDeviceStatusInfo,
  type DeviceStatusInfo,
} from "@/lib/deviceStatus";

export default function DeviceStatusBadge({
  lastUpdatedIso,
}: {
  lastUpdatedIso: string;
}) {
  const [info, setInfo] = useState<DeviceStatusInfo>(() =>
    getDeviceStatusInfo(lastUpdatedIso)
  );

  useEffect(() => {
    setInfo(getDeviceStatusInfo(lastUpdatedIso));

    const timer = setInterval(() => {
      setInfo(getDeviceStatusInfo(lastUpdatedIso));
    }, 60_000);

    return () => clearInterval(timer);
  }, [lastUpdatedIso]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className={`inline-flex items-center rounded-xl px-4 py-2 text-sm md:text-base font-semibold border shadow-sm ${
          info.state === "ON"
            ? "bg-emerald-500/20 text-white border-emerald-200/40"
            : "bg-rose-500/20 text-white border-rose-200/40"
        }`}
      >
        {info.state === "ON" ? "🟢" : "🔴"} {info.labelBn}
      </span>

      <span className="inline-flex items-center rounded-xl bg-white/18 px-4 py-2 text-sm md:text-base font-semibold text-white backdrop-blur-sm border border-white/20 shadow-sm">
        ⏱ সর্বশেষ আপডেট: {info.lastUpdatedText}
      </span>

      {info.minutesAgo !== null && (
        <span className="inline-flex items-center rounded-xl bg-white/18 px-4 py-2 text-sm md:text-base font-semibold text-white backdrop-blur-sm border border-white/20 shadow-sm">
          {info.minutesAgo} মিনিট আগে
        </span>
      )}
    </div>
  );
}