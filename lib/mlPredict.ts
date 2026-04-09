import sourceArtifact from "@/data/source_model_artifact.json";
import usageArtifact from "@/data/usage_model_artifact.json";
import type { SensorSample } from "@/lib/preprocess";

type Artifact = {
  features: string[];
  mins: Record<string, number>;
  maxs: Record<string, number>;
  centroids: Record<string, Record<string, number>>;
};

type PredictionResult = {
  label: string;
  confidence: number;
  distances: Record<string, number>;
};

function normalizeValue(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

function buildFeatureVector(sample: SensorSample) {
  return {
    pH_smooth: sample.pH,
    temp_smooth: sample.temp,
    tds_smooth: sample.tds,
    turbidity_smooth: sample.turbidity,
  };
}

function predictFromArtifact(sample: SensorSample, artifact: Artifact): PredictionResult {
  const vector = buildFeatureVector(sample);
  const distances: Record<string, number> = {};

  for (const [label, centroid] of Object.entries(artifact.centroids)) {
    let dist = 0;

    for (const feature of artifact.features) {
      const sampleVal = normalizeValue(
        vector[feature as keyof typeof vector] ?? 0,
        artifact.mins[feature],
        artifact.maxs[feature]
      );

      const centroidVal = normalizeValue(
        centroid[feature] ?? 0,
        artifact.mins[feature],
        artifact.maxs[feature]
      );

      dist += Math.pow(sampleVal - centroidVal, 2);
    }

    distances[label] = Math.sqrt(dist);
  }

  const sorted = Object.entries(distances).sort((a, b) => a[1] - b[1]);
  const bestLabel = sorted[0][0];
  const bestDist = sorted[0][1];
  const secondDist = sorted.length > 1 ? sorted[1][1] : bestDist + 0.001;

  let confidence = 0.5;

  if (secondDist > 0) {
    confidence = secondDist === bestDist
      ? 0.5
      : Math.min(0.99, Math.max(0.35, secondDist / (bestDist + secondDist)));
  }

  return {
    label: bestLabel,
    confidence: Number((confidence * 100).toFixed(1)),
    distances,
  };
}

export function predictSource(sample: SensorSample) {
  return predictFromArtifact(sample, sourceArtifact as Artifact);
}

export function predictUsage(sample: SensorSample) {
  return predictFromArtifact(sample, usageArtifact as Artifact);
}

export function sourceLabelBn(label: string): string {
  const map: Record<string, string> = {
    brahmaputra: "ব্রহ্মপুত্র নদীর পানি",
    pond: "পুকুরের পানি",
    rain: "সংরক্ষিত বৃষ্টির পানি",
    drinking: "পানযোগ্য পানি",
  };

  return map[label] || label;
}

export function usageLabelBn(label: string): string {
  const map: Record<string, string> = {
    drinkable: "পানযোগ্য",
    household_nonpotable: "গৃহস্থালী ব্যবহারযোগ্য",
    irrigation_only: "মূলত সেচের জন্য",
    unsafe: "ঝুঁকিপূর্ণ",
  };

  return map[label] || label;
}

export function usageAdviceBn(label: string): string {
  const map: Record<string, string> = {
    drinkable: "এই পানি পান ও রান্নার কাজে ব্যবহারযোগ্য হিসেবে ধরা হচ্ছে।",
    household_nonpotable: "এই পানি ধোয়া-মোছা বা সাধারণ গৃহস্থালী কাজে ব্যবহার করা যেতে পারে, তবে সরাসরি পান নয়।",
    irrigation_only: "এই পানি কৃষি সেচের জন্য তুলনামূলকভাবে বেশি উপযোগী।",
    unsafe: "এই পানি সরাসরি ব্যবহার ঝুঁকিপূর্ণ। আগে পরিশোধন বা বিকল্প উৎস প্রয়োজন।",
  };

  return map[label] || "সিদ্ধান্তের জন্য আরও বিশ্লেষণ প্রয়োজন।";
}