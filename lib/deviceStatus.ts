export type DeviceState = "LIVE" | "DELAYED" | "OFFLINE";

export type DeviceStatusInfo = {
  state: DeviceState;
  labelBn: string;
  messageBn: string;
  ageTextBn: string;
};

export function getDeviceStatusInfo(
  lastUpdatedIso: string,
  liveThresholdMinutes = 2,
  delayedThresholdMinutes = 10
): DeviceStatusInfo {
  const lastUpdated = new Date(lastUpdatedIso).getTime();

  if (Number.isNaN(lastUpdated)) {
    return {
      state: "OFFLINE",
      labelBn: "সেন্সর স্ট্যাটাস: OFF",
      messageBn: "সর্বশেষ আপডেটের সময় পাওয়া যায়নি।",
      ageTextBn: "সময় অজানা",
    };
  }

  const diffMs = Date.now() - lastUpdated;
  const diffMinutes = diffMs / (1000 * 60);

  const ageTextBn = formatAgeBn(diffMs);

  if (diffMinutes <= liveThresholdMinutes) {
    return {
      state: "LIVE",
      labelBn: "সেন্সর স্ট্যাটাস: ON",
      messageBn: "লাইভ সেন্সর ডেটা দেখানো হচ্ছে।",
      ageTextBn,
    };
  }

  if (diffMinutes <= delayedThresholdMinutes) {
    return {
      state: "DELAYED",
      labelBn: "সেন্সর স্ট্যাটাস: DELAYED",
      messageBn: "ডেটা কিছুটা পুরোনো। সর্বশেষ আপলোড হওয়া ডেটা দেখানো হচ্ছে।",
      ageTextBn,
    };
  }

  return {
    state: "OFFLINE",
    labelBn: "সেন্সর স্ট্যাটাস: OFF",
    messageBn: "সেন্সর বর্তমানে বন্ধ বা সংযোগ বিচ্ছিন্ন। শেষ আপলোড হওয়া ডেটা দেখানো হচ্ছে।",
    ageTextBn,
  };
}

export function formatBanglaDateTime(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "অজানা সময়";
  }

  return date.toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function formatAgeBn(diffMs: number): string {
  if (!Number.isFinite(diffMs) || diffMs < 0) {
    return "এইমাত্র";
  }

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} সেকেন্ড আগে`;
  }

  if (minutes < 60) {
    return `${minutes} মিনিট আগে`;
  }

  if (hours < 24) {
    return `${hours} ঘণ্টা আগে`;
  }

  return `${days} দিন আগে`;
}