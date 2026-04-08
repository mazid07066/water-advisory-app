import { SensorSample } from "./preprocess";

export type AdvisoryResult = {
  overallStatus: "Safe" | "Caution" | "Unsafe";
  drinking: string;
  cooking: string;
  bathing: string;
  irrigation: string;
  livestock: string;
  summaryBn: string;
  score: number;
  reasons: string[];
};

export function evaluateWater(sample: SensorSample): AdvisoryResult {
  let score = 100;
  const reasons: string[] = [];

  if (sample.pH < 6.5 || sample.pH > 8.5) {
    score -= 25;
    reasons.push("pH নিরাপদ সীমার বাইরে");
  }

  if (sample.turbidity > 5) {
    score -= 25;
    reasons.push("পানিতে ঘোলাভাব বেশি");
  }

  if (sample.tds > 500) {
    score -= 20;
    reasons.push("TDS বেশি");
  }

  if (sample.temp > 35 || sample.temp < 15) {
    score -= 10;
    reasons.push("তাপমাত্রা স্বাভাবিক নয়");
  }

  let overallStatus: "Safe" | "Caution" | "Unsafe" = "Safe";
  if (score >= 80) overallStatus = "Safe";
  else if (score >= 55) overallStatus = "Caution";
  else overallStatus = "Unsafe";

  let drinking = "পান করার জন্য নিরাপদ";
  let cooking = "রান্নার জন্য ব্যবহারযোগ্য";
  let bathing = "গোসল ও ধোয়ার জন্য ব্যবহারযোগ্য";
  let irrigation = "সেচের জন্য ব্যবহারযোগ্য";
  let livestock = "গবাদি পশুর জন্য ব্যবহারযোগ্য";
  let summaryBn = "পানির মান ভালো।";

  if (overallStatus === "Caution") {
    drinking = "সরাসরি পান করবেন না; ফিল্টার/ফুটিয়ে ব্যবহার করুন";
    cooking = "রান্নার আগে পরিশোধন করুন";
    bathing = "গোসল/ধোয়ার জন্য সাধারণত ব্যবহারযোগ্য";
    irrigation = "সাধারণ সেচে ব্যবহারযোগ্য";
    livestock = "সতর্কতার সাথে ব্যবহার করুন";
    summaryBn = "পানির মান মাঝারি। পান করার আগে পরিশোধন প্রয়োজন।";
  }

  if (overallStatus === "Unsafe") {
    drinking = "পান করার জন্য অনিরাপদ";
    cooking = "রান্নার জন্য সরাসরি ব্যবহার অনুপযুক্ত";
    bathing = "শুধু সীমিত ব্যবহার";
    irrigation =
      sample.turbidity < 20 && sample.tds < 1000
        ? "সেচে সীমিতভাবে ব্যবহার করা যেতে পারে"
        : "সেচের জন্যও ঝুঁকিপূর্ণ";
    livestock = "গবাদি পশুর জন্যও সতর্কতা প্রয়োজন";
    summaryBn = "পানির মান খারাপ। ব্যবহার করার আগে অবশ্যই ব্যবস্থা নিন।";
  }

  return {
    overallStatus,
    drinking,
    cooking,
    bathing,
    irrigation,
    livestock,
    summaryBn,
    score: Math.max(0, Math.min(100, score)),
    reasons,
  };
}