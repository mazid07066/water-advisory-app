"use client";

import { useEffect, useState } from "react";
import {
  getDeviceStatusInfo,
  formatBanglaDateTime,
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
    const update = () => {
      setInfo(getDeviceStatusInfo(lastUpdatedIso));
    };

    update();

    const timer = setInterval(update, 30000);

    return () => clearInterval(timer);
  }, [lastUpdatedIso]);

  const style =
    info.state === "LIVE"
      ? "bg-emerald-500/20 text-white border-emerald-200/40"
      : info.state === "DELAYED"
      ? "bg-amber-500/20 text-white border-amber-200/40"
      : "bg-rose-500/20 text-white border-rose-200/40";

  const icon =
    info.state === "LIVE" ? "🟢" : info.state === "DELAYED" ? "🟡" : "🔴";

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center rounded-xl px-4 py-2 text-sm md:text-base font-semibold border shadow-sm ${style}`}
        >
          {icon} {info.labelBn}
        </span>

        <span className="inline-flex items-center rounded-xl bg-white/18 px-4 py-2 text-sm md:text-base font-semibold text-white backdrop-blur-sm border border-white/20 shadow-sm">
          ⏳ {info.ageTextBn}
        </span>
      </div>

      <p className="text-sm md:text-base font-medium text-blue-100">
        ⏱ সর্বশেষ আপডেট: {formatBanglaDateTime(lastUpdatedIso)}
      </p>

      <p
        className={`text-sm md:text-base font-medium ${
          info.state === "LIVE"
            ? "text-emerald-100"
            : info.state === "DELAYED"
            ? "text-amber-100"
            : "text-rose-100"
        }`}
      >
        {info.messageBn}
      </p>
    </div>
  );
}