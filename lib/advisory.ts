import type {
  AdvisoryResult,
  ParameterAssessment,
  WaterSample,
  WaterStatus,
} from "@/lib/types";

function assessPH(value: number | null): ParameterAssessment {
  if (value === null) {
    return {
      status: "unavailable",
      labelBn: "তথ্য নেই",
      messageBn: "pH পরিমাপ পাওয়া যায়নি।",
    };
  }

  if (value >= 6.5 && value <= 8.5) {
    return {
      status: "good",
      labelBn: "গ্রহণযোগ্য সীমা",
      messageBn: "pH সাধারণ গ্রহণযোগ্য সীমার মধ্যে রয়েছে।",
    };
  }

  if (value >= 6.0 && value <= 9.0) {
    return {
      status: "caution",
      labelBn: "সতর্কতা",
      messageBn: "pH আদর্শ সীমার বাইরে; ব্যবহার-পূর্ব যাচাই প্রয়োজন।",
    };
  }

  return {
    status: "unsafe",
    labelBn: "ঝুঁকিপূর্ণ",
    messageBn: "pH নিরাপদ ব্যবহার নির্দেশনার সীমার বাইরে।",
  };
}

function assessTDS(value: number | null): ParameterAssessment {
  if (value === null) {
    return {
      status: "unavailable",
      labelBn: "তথ্য নেই",
      messageBn: "TDS পরিমাপ পাওয়া যায়নি।",
    };
  }

  if (value <= 500) {
    return {
      status: "good",
      labelBn: "নিম্ন বা মাঝারি",
      messageBn: "আনুমানিক TDS 500 ppm বা তার নিচে।",
    };
  }

  if (value <= 1000) {
    return {
      status: "caution",
      labelBn: "উচ্চ",
      messageBn:
        "আনুমানিক TDS 500–1000 ppm; পান করার আগে পরীক্ষাগার যাচাই প্রয়োজন।",
    };
  }

  return {
    status: "unsafe",
    labelBn: "অত্যধিক উচ্চ",
    messageBn:
      "আনুমানিক TDS 1000 ppm-এর বেশি; সরাসরি পান না করার পরামর্শ।",
  };
}

function assessTemperature(value: number | null): ParameterAssessment {
  if (value === null) {
    return {
      status: "unavailable",
      labelBn: "তথ্য নেই",
      messageBn: "তাপমাত্রার তথ্য পাওয়া যায়নি।",
    };
  }

  if (value >= 5 && value <= 40) {
    return {
      status: "good",
      labelBn: "স্বাভাবিক পরিসর",
      messageBn: "সেন্সর তাপমাত্রা কার্যকর পরিমাপ পরিসরে রয়েছে।",
    };
  }

  return {
    status: "caution",
    labelBn: "অস্বাভাবিক",
    messageBn: "তাপমাত্রা যাচাই করা প্রয়োজন।",
  };
}

function statusPriority(
  status: ParameterAssessment["status"]
): number {
  switch (status) {
    case "unsafe":
      return 3;
    case "caution":
      return 2;
    case "unavailable":
      return 1;
    default:
      return 0;
  }
}

function deriveOverallStatus(
  sample: WaterSample,
  assessments: ParameterAssessment[]
): WaterStatus {
  /*
    The Arduino status code remains authoritative when valid.
  */
  if (sample.statusCode === 4) {
    return "Sensor Error";
  }

  if (sample.statusCode === 3) {
    return "Unsafe";
  }

  if (sample.statusCode === 2) {
    return "Caution";
  }

  const maximumPriority = Math.max(
    ...assessments.map((item) => statusPriority(item.status))
  );

  if (maximumPriority >= 3) {
    return "Unsafe";
  }

  if (maximumPriority >= 1) {
    return "Caution";
  }

  return "Safe";
}

function calculateScore(
  overallStatus: WaterStatus,
  assessments: ParameterAssessment[]
): number {
  if (overallStatus === "Sensor Error") {
    return 0;
  }

  let score = 100;

  for (const assessment of assessments) {
    if (assessment.status === "unsafe") {
      score -= 35;
    } else if (assessment.status === "caution") {
      score -= 18;
    } else if (assessment.status === "unavailable") {
      score -= 25;
    }
  }

  return Math.max(0, Math.min(100, score));
}

export function evaluateWater(sample: WaterSample): AdvisoryResult {
  const phAssessment = assessPH(sample.ph);
  const tdsAssessment = assessTDS(sample.tds);
  const temperatureAssessment = assessTemperature(sample.temperature);

  const assessments = [
    phAssessment,
    tdsAssessment,
    temperatureAssessment,
  ];

  const overallStatus = deriveOverallStatus(sample, assessments);
  const score = calculateScore(overallStatus, assessments);

  const reasons = assessments
    .filter((item) => item.status !== "good")
    .map((item) => item.messageBn);

  if (sample.tds !== null) {
    reasons.push(
      "TDS মানটি DFRobot সমীকরণ ও অস্থায়ী সংশোধন ফ্যাক্টরভিত্তিক আনুমানিক মান।"
    );
  }

  if (overallStatus === "Safe") {
    return {
      overallStatus,
      score,

      drinking:
        "প্রাথমিক ভৌত-রাসায়নিক স্ক্রিনিং গ্রহণযোগ্য; পান করার আগে জীবাণু, আর্সেনিক ও অন্যান্য দূষকের পরীক্ষাগার পরীক্ষা প্রয়োজন।",
      cooking:
        "রান্নায় ব্যবহারের আগে পানি ফুটিয়ে এবং স্থানীয় স্বাস্থ্য নির্দেশনা অনুসরণ করুন।",
      bathing:
        "গোসল ও সাধারণ গৃহস্থালি ব্যবহারে তুলনামূলকভাবে উপযোগী।",
      irrigation:
        "সেচের জন্য প্রাথমিকভাবে উপযোগী; ফসল ও মাটির লবণাক্ততা বিবেচনা করুন।",
      livestock:
        "গবাদিপশুর জন্য ব্যবহারের আগে স্থানীয় প্রাণিসম্পদ বিশেষজ্ঞের পরামর্শ নিন।",

      summaryBn:
        "পরিমাপকৃত pH, আনুমানিক TDS এবং তাপমাত্রা অনুযায়ী তাৎক্ষণিক বড় ঝুঁকি শনাক্ত হয়নি।",

      reasons,
      phAssessment,
      tdsAssessment,
      temperatureAssessment,

      measurementNoticeBn:
        "এই প্রোটোটাইপ ব্যাকটেরিয়া, ভাইরাস, আর্সেনিক, ভারী ধাতু বা কীটনাশক শনাক্ত করে না।",
    };
  }

  if (overallStatus === "Caution") {
    return {
      overallStatus,
      score,

      drinking:
        "সরাসরি পান না করে পরীক্ষাগারে পানি পরীক্ষা করুন।",
      cooking:
        "পরীক্ষা ও প্রয়োজনীয় শোধন ছাড়া রান্নায় ব্যবহার না করাই ভালো।",
      bathing:
        "সীমিত বাহ্যিক ব্যবহার বিবেচনা করা যেতে পারে; ত্বকের সমস্যা থাকলে এড়িয়ে চলুন।",
      irrigation:
        "সেচে ব্যবহারের আগে TDS, ফসলের সহনশীলতা ও মাটির অবস্থা যাচাই করুন।",
      livestock:
        "গবাদিপশুকে দেওয়ার আগে বিকল্প নিরাপদ উৎস বিবেচনা করুন।",

      summaryBn:
        "এক বা একাধিক পরিমাপকৃত মান সতর্কতার সীমায় রয়েছে।",

      reasons,
      phAssessment,
      tdsAssessment,
      temperatureAssessment,

      measurementNoticeBn:
        "সিদ্ধান্তটি সীমিত সেন্সরভিত্তিক স্ক্রিনিং; পরীক্ষাগার সনদ নয়।",
    };
  }

  if (overallStatus === "Sensor Error") {
    return {
      overallStatus,
      score: 0,

      drinking: "সেন্সর তথ্য নির্ভরযোগ্য নয়; পানির ব্যবহার সিদ্ধান্ত দেবেন না।",
      cooking: "সেন্সর পুনঃসংযোগ ও পুনরায় পরিমাপ করুন।",
      bathing: "পরিমাপ নিশ্চিত না হওয়া পর্যন্ত পরামর্শ স্থগিত।",
      irrigation: "পরিমাপ পুনরায় গ্রহণ করুন।",
      livestock: "বিকল্প পরীক্ষিত পানির উৎস ব্যবহার করুন।",

      summaryBn:
        "সেন্সর ত্রুটি বা অসম্পূর্ণ তথ্যের কারণে সিদ্ধান্ত তৈরি করা যায়নি।",

      reasons:
        reasons.length > 0
          ? reasons
          : ["সেন্সর ডেটা অসম্পূর্ণ বা ত্রুটিপূর্ণ।"],

      phAssessment,
      tdsAssessment,
      temperatureAssessment,

      measurementNoticeBn:
        "সঠিক সেন্সর সংযোগ ও স্থিতিশীল পরিমাপ নিশ্চিত করুন।",
    };
  }

  return {
    overallStatus: "Unsafe",
    score,

    drinking:
      "সরাসরি পান করা অনিরাপদ। পরীক্ষাগার পরীক্ষা ও উপযুক্ত শোধন প্রয়োজন।",
    cooking:
      "শুধু ফুটানো যথেষ্ট নাও হতে পারে; দূষকের ধরন শনাক্ত করুন।",
    bathing:
      "সতর্কতা ছাড়া ব্যবহার করবেন না, বিশেষ করে শিশু ও সংবেদনশীল ব্যক্তিদের ক্ষেত্রে।",
    irrigation:
      "কেবল ফসল, মাটি ও লবণাক্ততা যাচাই করে সীমিত সেচ বিবেচনা করুন।",
    livestock:
      "গবাদিপশুকে না দেওয়াই নিরাপদ, যতক্ষণ না পরীক্ষা সম্পন্ন হয়।",

    summaryBn:
      "পরিমাপকৃত এক বা একাধিক মান ঝুঁকিপূর্ণ সীমায় রয়েছে।",

    reasons,
    phAssessment,
    tdsAssessment,
    temperatureAssessment,

    measurementNoticeBn:
      "এই সিদ্ধান্ত শুধুমাত্র pH, আনুমানিক TDS ও তাপমাত্রার ওপর ভিত্তি করে তৈরি।",
  };
}