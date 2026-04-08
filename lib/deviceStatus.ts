export type DeviceState = "ON" | "OFF";

export function getDeviceStatus(lastUpdatedIso: string, thresholdMinutes = 30): DeviceState {
  const lastUpdated = new Date(lastUpdatedIso).getTime();

  if (Number.isNaN(lastUpdated)) {
    return "OFF";
  }

  const now = Date.now();
  const diffMinutes = (now - lastUpdated) / (1000 * 60);

  return diffMinutes <= thresholdMinutes ? "ON" : "OFF";
}

export function formatBanglaDateTime(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "অজানা সময়";
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}