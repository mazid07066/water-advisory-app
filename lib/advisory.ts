import type {
  AdvisoryResult,
  ParameterAssessment,
  WaterSample,
  WaterStatus,
} from "@/lib/types";

import type { Language } from "@/lib/i18n";

function assessPH(
  value: number | null,
  language: Language
): ParameterAssessment {
  if (value === null) {
    return {
      status: "unavailable",
      labelBn:
        language === "bn"
          ? "তথ্য নেই"
          : "Unavailable",
      messageBn:
        language === "bn"
          ? "pH পরিমাপ পাওয়া যায়নি।"
          : "No pH measurement is available.",
    };
  }

  if (value >= 6.5 && value <= 8.5) {
    return {
      status: "good",
      labelBn:
        language === "bn"
          ? "গ্রহণযোগ্য সীমা"
          : "Acceptable range",
      messageBn:
        language === "bn"
          ? "pH সাধারণ গ্রহণযোগ্য সীমার মধ্যে রয়েছে।"
          : "The pH is within the generally acceptable range.",
    };
  }

  if (value >= 6.0 && value <= 9.0) {
    return {
      status: "caution",
      labelBn:
        language === "bn"
          ? "সতর্কতা"
          : "Caution",
      messageBn:
        language === "bn"
          ? "pH আদর্শ সীমার বাইরে; ব্যবহার-পূর্ব যাচাই প্রয়োজন।"
          : "The pH is outside the preferred range and should be verified before use.",
    };
  }

  return {
    status: "unsafe",
    labelBn:
      language === "bn"
        ? "ঝুঁকিপূর্ণ"
        : "High risk",
    messageBn:
      language === "bn"
        ? "pH নিরাপদ ব্যবহার নির্দেশনার সীমার বাইরে।"
        : "The pH is outside the preliminary safe-use range.",
  };
}

function assessTDS(
  value: number | null,
  language: Language
): ParameterAssessment {
  if (value === null) {
    return {
      status: "unavailable",
      labelBn:
        language === "bn"
          ? "তথ্য নেই"
          : "Unavailable",
      messageBn:
        language === "bn"
          ? "TDS পরিমাপ পাওয়া যায়নি।"
          : "No TDS measurement is available.",
    };
  }

  if (value <= 500) {
    return {
      status: "good",
      labelBn:
        language === "bn"
          ? "নিম্ন বা মাঝারি"
          : "Low or moderate",
      messageBn:
        language === "bn"
          ? "আনুমানিক TDS 500 ppm বা তার নিচে।"
          : "The estimated TDS is 500 ppm or below.",
    };
  }

  if (value <= 1000) {
    return {
      status: "caution",
      labelBn:
        language === "bn"
          ? "উচ্চ"
          : "Elevated",
      messageBn:
        language === "bn"
          ? "আনুমানিক TDS 500–1000 ppm; পান করার আগে পরীক্ষাগার যাচাই প্রয়োজন।"
          : "The estimated TDS is between 500 and 1000 ppm; laboratory verification is recommended before drinking.",
    };
  }

  return {
    status: "unsafe",
    labelBn:
      language === "bn"
        ? "অত্যধিক উচ্চ"
        : "Very high",
    messageBn:
      language === "bn"
        ? "আনুমানিক TDS 1000 ppm-এর বেশি; সরাসরি পান না করার পরামর্শ।"
        : "The estimated TDS exceeds 1000 ppm; direct drinking is not advised.",
  };
}

function assessTemperature(
  value: number | null,
  language: Language
): ParameterAssessment {
  if (value === null) {
    return {
      status: "unavailable",
      labelBn:
        language === "bn"
          ? "তথ্য নেই"
          : "Unavailable",
      messageBn:
        language === "bn"
          ? "তাপমাত্রার তথ্য পাওয়া যায়নি।"
          : "No temperature measurement is available.",
    };
  }

  if (value >= 5 && value <= 40) {
    return {
      status: "good",
      labelBn:
        language === "bn"
          ? "স্বাভাবিক পরিসর"
          : "Normal measurement range",
      messageBn:
        language === "bn"
          ? "সেন্সর তাপমাত্রা কার্যকর পরিমাপ পরিসরে রয়েছে।"
          : "The measured temperature is within the sensor's normal operating range.",
    };
  }

  return {
    status: "caution",
    labelBn:
      language === "bn"
        ? "অস্বাভাবিক"
        : "Abnormal",
    messageBn:
      language === "bn"
        ? "তাপমাত্রা যাচাই করা প্রয়োজন।"
        : "The temperature reading should be verified.",
  };
}

function priority(
  status: ParameterAssessment["status"]
): number {
  if (status === "unsafe") return 3;
  if (status === "caution") return 2;
  if (status === "unavailable") return 1;
  return 0;
}

function deriveStatus(
  sample: WaterSample,
  assessments: ParameterAssessment[]
): WaterStatus {
  if (sample.statusCode === 4) return "Sensor Error";
  if (sample.statusCode === 3) return "Unsafe";
  if (sample.statusCode === 2) return "Caution";

  const maximum = Math.max(
    ...assessments.map((item) =>
      priority(item.status)
    )
  );

  if (maximum >= 3) return "Unsafe";
  if (maximum >= 1) return "Caution";

  return "Safe";
}

function calculateScore(
  status: WaterStatus,
  assessments: ParameterAssessment[]
): number {
  if (status === "Sensor Error") {
    return 0;
  }

  let score = 100;

  for (const assessment of assessments) {
    if (assessment.status === "unsafe") {
      score -= 35;
    } else if (assessment.status === "caution") {
      score -= 18;
    } else if (
      assessment.status === "unavailable"
    ) {
      score -= 25;
    }
  }

  return Math.max(0, Math.min(100, score));
}

export function evaluateWater(
  sample: WaterSample,
  language: Language = "bn"
): AdvisoryResult {
  const phAssessment =
    assessPH(sample.ph, language);

  const tdsAssessment =
    assessTDS(sample.tds, language);

  const temperatureAssessment =
    assessTemperature(
      sample.temperature,
      language
    );

  const assessments = [
    phAssessment,
    tdsAssessment,
    temperatureAssessment,
  ];

  const overallStatus =
    deriveStatus(sample, assessments);

  const score =
    calculateScore(overallStatus, assessments);

  const reasons = assessments
    .filter((item) => item.status !== "good")
    .map((item) => item.messageBn);

  reasons.push(
    language === "bn"
      ? "TDS মানটি DFRobot সমীকরণ ও অস্থায়ী সংশোধন ফ্যাক্টরভিত্তিক আনুমানিক মান।"
      : "The TDS value is an estimate based on the DFRobot equation and a provisional correction factor."
  );

  if (overallStatus === "Safe") {
    return {
      overallStatus,
      score,

      drinking:
        language === "bn"
          ? "প্রাথমিক ভৌত-রাসায়নিক স্ক্রিনিং গ্রহণযোগ্য; পান করার আগে জীবাণু, আর্সেনিক ও অন্যান্য দূষকের পরীক্ষাগার পরীক্ষা প্রয়োজন।"
          : "The preliminary physicochemical screening is acceptable; laboratory testing for microorganisms, arsenic, and other contaminants is still required before drinking.",

      cooking:
        language === "bn"
          ? "রান্নায় ব্যবহারের আগে পানি ফুটিয়ে এবং স্থানীয় স্বাস্থ্য নির্দেশনা অনুসরণ করুন।"
          : "Boil the water and follow local public-health guidance before using it for cooking.",

      bathing:
        language === "bn"
          ? "গোসল ও সাধারণ গৃহস্থালি ব্যবহারে তুলনামূলকভাবে উপযোগী।"
          : "It is comparatively suitable for bathing and general household use.",

      irrigation:
        language === "bn"
          ? "সেচের জন্য প্রাথমিকভাবে উপযোগী; ফসল ও মাটির লবণাক্ততা বিবেচনা করুন।"
          : "It is provisionally suitable for irrigation; consider crop tolerance and soil salinity.",

      livestock:
        language === "bn"
          ? "গবাদিপশুর জন্য ব্যবহারের আগে স্থানীয় প্রাণিসম্পদ বিশেষজ্ঞের পরামর্শ নিন।"
          : "Consult a local livestock specialist before providing it to animals.",

      summaryBn:
        language === "bn"
          ? "পরিমাপকৃত pH, আনুমানিক TDS এবং তাপমাত্রা অনুযায়ী তাৎক্ষণিক বড় ঝুঁকি শনাক্ত হয়নি।"
          : "No major immediate risk was identified from the measured pH, estimated TDS, and temperature.",

      reasons,
      phAssessment,
      tdsAssessment,
      temperatureAssessment,

      measurementNoticeBn:
        language === "bn"
          ? "এই প্রোটোটাইপ ব্যাকটেরিয়া, ভাইরাস, আর্সেনিক, ভারী ধাতু বা কীটনাশক শনাক্ত করে না।"
          : "This prototype does not detect bacteria, viruses, arsenic, heavy metals, or pesticides.",
    };
  }

  if (overallStatus === "Caution") {
    return {
      overallStatus,
      score,

      drinking:
        language === "bn"
          ? "সরাসরি পান না করে পরীক্ষাগারে পানি পরীক্ষা করুন।"
          : "Do not drink it directly; arrange laboratory testing.",

      cooking:
        language === "bn"
          ? "পরীক্ষা ও প্রয়োজনীয় শোধন ছাড়া রান্নায় ব্যবহার না করাই ভালো।"
          : "Avoid using it for cooking without testing and appropriate treatment.",

      bathing:
        language === "bn"
          ? "সীমিত বাহ্যিক ব্যবহার বিবেচনা করা যেতে পারে; ত্বকের সমস্যা থাকলে এড়িয়ে চলুন।"
          : "Limited external use may be considered; avoid it if users have sensitive skin or skin conditions.",

      irrigation:
        language === "bn"
          ? "সেচে ব্যবহারের আগে TDS, ফসলের সহনশীলতা ও মাটির অবস্থা যাচাই করুন।"
          : "Check TDS, crop tolerance, and soil conditions before irrigation.",

      livestock:
        language === "bn"
          ? "গবাদিপশুকে দেওয়ার আগে বিকল্প নিরাপদ উৎস বিবেচনা করুন।"
          : "Consider an alternative verified source before providing it to livestock.",

      summaryBn:
        language === "bn"
          ? "এক বা একাধিক পরিমাপকৃত মান সতর্কতার সীমায় রয়েছে।"
          : "One or more measured parameters are within the caution range.",

      reasons,
      phAssessment,
      tdsAssessment,
      temperatureAssessment,

      measurementNoticeBn:
        language === "bn"
          ? "সিদ্ধান্তটি সীমিত সেন্সরভিত্তিক স্ক্রিনিং; পরীক্ষাগার সনদ নয়।"
          : "This is a limited sensor-based screening result, not a laboratory certification.",
    };
  }

  if (overallStatus === "Sensor Error") {
    return {
      overallStatus,
      score: 0,

      drinking:
        language === "bn"
          ? "সেন্সর তথ্য নির্ভরযোগ্য নয়; পানির ব্যবহার সিদ্ধান্ত দেবেন না।"
          : "The sensor data is unreliable; do not make a water-use decision.",

      cooking:
        language === "bn"
          ? "সেন্সর পুনঃসংযোগ ও পুনরায় পরিমাপ করুন।"
          : "Reconnect the sensors and repeat the measurement.",

      bathing:
        language === "bn"
          ? "পরিমাপ নিশ্চিত না হওয়া পর্যন্ত পরামর্শ স্থগিত।"
          : "No recommendation is available until the measurement is verified.",

      irrigation:
        language === "bn"
          ? "পরিমাপ পুনরায় গ্রহণ করুন।"
          : "Repeat the measurement.",

      livestock:
        language === "bn"
          ? "বিকল্প পরীক্ষিত পানির উৎস ব্যবহার করুন।"
          : "Use an alternative verified water source.",

      summaryBn:
        language === "bn"
          ? "সেন্সর ত্রুটি বা অসম্পূর্ণ তথ্যের কারণে সিদ্ধান্ত তৈরি করা যায়নি।"
          : "A decision could not be generated because of a sensor error or incomplete data.",

      reasons:
        reasons.length
          ? reasons
          : [
              language === "bn"
                ? "সেন্সর ডেটা অসম্পূর্ণ বা ত্রুটিপূর্ণ।"
                : "The sensor data is incomplete or invalid.",
            ],

      phAssessment,
      tdsAssessment,
      temperatureAssessment,

      measurementNoticeBn:
        language === "bn"
          ? "সঠিক সেন্সর সংযোগ ও স্থিতিশীল পরিমাপ নিশ্চিত করুন।"
          : "Confirm correct sensor connections and stable measurements.",
    };
  }

  return {
    overallStatus: "Unsafe",
    score,

    drinking:
      language === "bn"
        ? "সরাসরি পান করা অনিরাপদ। পরীক্ষাগার পরীক্ষা ও উপযুক্ত শোধন প্রয়োজন।"
        : "Direct drinking is unsafe. Laboratory testing and appropriate treatment are required.",

    cooking:
      language === "bn"
        ? "শুধু ফুটানো যথেষ্ট নাও হতে পারে; দূষকের ধরন শনাক্ত করুন।"
        : "Boiling alone may not be sufficient; identify the type of contamination.",

    bathing:
      language === "bn"
        ? "সতর্কতা ছাড়া ব্যবহার করবেন না, বিশেষ করে শিশু ও সংবেদনশীল ব্যক্তিদের ক্ষেত্রে।"
        : "Do not use it without caution, particularly for children and sensitive users.",

    irrigation:
      language === "bn"
        ? "কেবল ফসল, মাটি ও লবণাক্ততা যাচাই করে সীমিত সেচ বিবেচনা করুন।"
        : "Consider limited irrigation only after checking crop tolerance, soil condition, and salinity.",

    livestock:
      language === "bn"
        ? "গবাদিপশুকে না দেওয়াই নিরাপদ, যতক্ষণ না পরীক্ষা সম্পন্ন হয়।"
        : "Do not provide it to livestock until testing is completed.",

    summaryBn:
      language === "bn"
        ? "পরিমাপকৃত এক বা একাধিক মান ঝুঁকিপূর্ণ সীমায় রয়েছে।"
        : "One or more measured values are within a high-risk range.",

    reasons,
    phAssessment,
    tdsAssessment,
    temperatureAssessment,

    measurementNoticeBn:
      language === "bn"
        ? "এই সিদ্ধান্ত শুধুমাত্র pH, আনুমানিক TDS ও তাপমাত্রার ওপর ভিত্তি করে তৈরি।"
        : "This decision is based only on pH, estimated TDS, and temperature.",
  };
}