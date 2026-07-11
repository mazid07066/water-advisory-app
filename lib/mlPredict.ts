import type {
  SensorSample,
} from "@/lib/preprocess";

type PredictionResult = {
  label: string;
  confidence: number;
  distances: Record<string, number>;
};

export function predictSource(
  _sample: SensorSample
): PredictionResult {
  return {
    label: "model_retraining_required",
    confidence: 0,
    distances: {},
  };
}

export function predictUsage(
  sample: SensorSample
): PredictionResult {
  let label = "unsafe";

  if (
    sample.pH >= 6.5 &&
    sample.pH <= 8.5 &&
    sample.tds <= 500
  ) {
    label = "screening_acceptable";
  } else if (
    sample.pH >= 6.0 &&
    sample.pH <= 9.0 &&
    sample.tds <= 1000
  ) {
    label = "caution";
  }

  return {
    label,
    confidence: 0,
    distances: {},
  };
}

export function sourceLabelBn(
  label: string
): string {
  if (label === "model_retraining_required") {
    return "মডেল পুনঃপ্রশিক্ষণ প্রয়োজন";
  }

  return label;
}

export function usageLabelBn(
  label: string
): string {
  const labels: Record<string, string> = {
    screening_acceptable:
      "প্রাথমিক স্ক্রিনিং গ্রহণযোগ্য",
    caution: "সতর্কতা প্রয়োজন",
    unsafe: "অনিরাপদ",
  };

  return labels[label] || label;
}

export function usageAdviceBn(
  label: string
): string {
  if (label === "screening_acceptable") {
    return "জীবাণু ও অন্যান্য দূষকের পরীক্ষাগার যাচাই সাপেক্ষে ব্যবহার বিবেচনা করুন।";
  }

  if (label === "caution") {
    return "সরাসরি পান না করে পরীক্ষা ও শোধন করুন।";
  }

  return "সরাসরি পান বা রান্নায় ব্যবহার করবেন না।";
}