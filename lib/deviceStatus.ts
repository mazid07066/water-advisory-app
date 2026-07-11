import type { DeviceStatusInfo } from "@/lib/types";

const ONLINE_THRESHOLD_MINUTES = 2;
const OFFLINE_THRESHOLD_MINUTES = 10;

export function formatBanglaDateTime(
  isoDate: string | null | undefined
): string {
  if (!isoDate) {
    return "সময় পাওয়া যায়নি";
  }

  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "সময় পাওয়া যায়নি";
  }

  return new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

export function getDeviceStatusInfo(
  lastUpdatedIso: string | null | undefined
): DeviceStatusInfo {
  const lastUpdatedText =
    formatBanglaDateTime(lastUpdatedIso);

  if (!lastUpdatedIso) {
    return {
      isOnline: false,
      status: "unknown",
      labelBn: "অজানা",
      descriptionBn:
        "সর্বশেষ ডেটার সময় পাওয়া যায়নি।",
      ageMinutes: null,
      lastUpdatedText,
    };
  }

  const date = new Date(lastUpdatedIso);

  if (Number.isNaN(date.getTime())) {
    return {
      isOnline: false,
      status: "unknown",
      labelBn: "অজানা",
      descriptionBn:
        "সর্বশেষ ডেটার সময় সঠিক নয়।",
      ageMinutes: null,
      lastUpdatedText,
    };
  }

  const ageMinutes = Math.max(
    0,
    (Date.now() - date.getTime()) / 60000
  );

  if (ageMinutes <= ONLINE_THRESHOLD_MINUTES) {
    return {
      isOnline: true,
      status: "online",
      labelBn: "চালু",
      descriptionBn:
        "সেন্সর থেকে সাম্প্রতিক ডেটা পাওয়া যাচ্ছে।",
      ageMinutes,
      lastUpdatedText,
    };
  }

  if (ageMinutes <= OFFLINE_THRESHOLD_MINUTES) {
    return {
      isOnline: false,
      status: "unknown",
      labelBn: "সংযোগ অনিশ্চিত",
      descriptionBn:
        "নতুন ডেটা আসতে কিছুটা বিলম্ব হচ্ছে।",
      ageMinutes,
      lastUpdatedText,
    };
  }

  return {
    isOnline: false,
    status: "offline",
    labelBn: "বন্ধ",
    descriptionBn:
      "সেন্সর নতুন ডেটা পাঠাচ্ছে না; সর্বশেষ সংরক্ষিত মান দেখানো হচ্ছে।",
    ageMinutes,
    lastUpdatedText,
  };
}

export const getDeviceStatus = getDeviceStatusInfo;