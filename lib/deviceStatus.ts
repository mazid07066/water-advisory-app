export type DeviceState = "ON" | "OFF";

export type DeviceStatusInfo = {
  state: DeviceState;
  labelBn: string;
  messageBn: string;
  lastUpdatedText: string;
  minutesAgo: number | null;
  isLive: boolean;
};

export function getDeviceStatus(
  lastUpdatedIso: string,
  thresholdMinutes = 30
): DeviceState {
  const lastUpdated = new Date(lastUpdatedIso).getTime();

  if (Number.isNaN(lastUpdated)) {
    return "OFF";
  }

  const now = Date.now();
  const diffMinutes = (now - lastUpdated) / (1000 * 60);

  return diffMinutes <= thresholdMinutes ? "ON" : "OFF";
}

export function getDeviceStatusInfo(
  lastUpdatedIso: string,
  thresholdMinutes = 30
): DeviceStatusInfo {
  const lastUpdated = new Date(lastUpdatedIso).getTime();

  if (Number.isNaN(lastUpdated)) {
    return {
      state: "OFF",
      labelBn: "সেন্সর স্ট্যাটাস: OFF",
      messageBn: "সর্বশেষ আপডেট সময় পাওয়া যায়নি।",
      lastUpdatedText: "অজানা সময়",
      minutesAgo: null,
      isLive: false,
    };
  }

  const now = Date.now();
  const diffMinutes = Math.max(0, Math.floor((now - lastUpdated) / (1000 * 60)));
  const state: DeviceState = diffMinutes <= thresholdMinutes ? "ON" : "OFF";

  return {
    state,
    labelBn: state === "ON" ? "সেন্সর স্ট্যাটাস: ON" : "সেন্সর স্ট্যাটাস: OFF",
    messageBn:
      state === "ON"
        ? "সেন্সর বর্তমানে সক্রিয় আছে।"
        : "সেন্সর বর্তমানে বন্ধ। শেষ আপলোড হওয়া ডেটা দেখানো হচ্ছে।",
    lastUpdatedText: formatBanglaDateTime(lastUpdatedIso),
    minutesAgo: diffMinutes,
    isLive: state === "ON",
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