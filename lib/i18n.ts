export type Language = "bn" | "en";

export const LANGUAGE_COOKIE = "water_advisor_language";

export function normalizeLanguage(
  value: string | null | undefined
): Language {
  return value === "en" ? "en" : "bn";
}

export const translations = {
  bn: {
    navigation: {
      brand: "Water Advisor",
      home: "হোম",
      trends: "প্রবণতা",
      compare: "তুলনা",
      switchTo: "English",
      switchAria: "Switch website language to English",
    },

    home: {
      eyebrow: "পানিবন্ধু · ওয়াটার অ্যাডভাইজর",
      title: "পানিবন্ধু",
      subtitle:
        "pH, আনুমানিক TDS ও তাপমাত্রার ভিত্তিতে সহজ ভাষায় পানি ব্যবহারের প্রাথমিক পরামর্শ",

      source: "উৎস",
      sensor: "সেন্সর",
      lastUpdated: "সর্বশেষ আপডেট",
      unknownTime: "সময় পাওয়া যায়নি",

      currentScore: "বর্তমান নিরাপত্তা স্কোর",
      drinkingButton: "পান করা যাবে?",
      irrigationButton: "সেচে ব্যবহার?",
      downloadButton: "ডেটা ডাউনলোড",

      loadErrorTitle: "সর্বশেষ ডেটা আনা যায়নি",

      overallStatus: "সামগ্রিক অবস্থা",
      decisionTitle: "পানির মানের সিদ্ধান্ত",
      safetyScore: "নিরাপত্তা স্কোর",

      ph: "pH",
      tds: "আনুমানিক TDS",
      temperature: "তাপমাত্রা",
      tdsNote:
        "DFRobot সমীকরণ ও অস্থায়ী সংশোধন ফ্যাক্টরভিত্তিক মান",

      drinking: "পান করা",
      cooking: "রান্না",
      household: "গোসল ও গৃহস্থালি",
      irrigation: "কৃষি ও সেচ",

      limitations: "পরিমাপের সীমাবদ্ধতা",
      turbidityRemoved:
        "টার্বিডিটি সেন্সর বর্তমান হার্ডওয়্যার সংস্করণ থেকে সরানো হয়েছে। ফলে কোনো NTU বা turbidity ফলাফল প্রদর্শন করা হচ্ছে না।",
    },

    status: {
      safe: "তুলনামূলকভাবে গ্রহণযোগ্য",
      caution: "সতর্কতা প্রয়োজন",
      unsafe: "অনিরাপদ",
      sensorError: "সেন্সর ত্রুটি",
      online: "চালু",
      offline: "বন্ধ",
      unknown: "অনিশ্চিত",
    },

    location: {
      eyebrow: "নমুনার অবস্থান",
      title: "পানি সংগ্রহের স্থান",
      description:
        "নমুনাটি কোথা থেকে সংগ্রহ করা হয়েছে তা সংরক্ষণ করুন এবং মানচিত্রে দেখুন।",

      sourceName: "উৎসের নাম",
      method: "লোকেশন পদ্ধতি",
      browserGps: "ব্রাউজার GPS",
      manualInput: "ম্যানুয়াল ইনপুট",
      accuracy: "GPS Accuracy",
      latitude: "Latitude",
      longitude: "Longitude",
      capturedTime: "সংরক্ষণের সময়",
      manualUnknown: "ম্যানুয়াল / অজানা",

      updateLocation: "বর্তমান লোকেশন আপডেট",
      updating: "লোকেশন আপডেট হচ্ছে...",
      currentLocation: "বর্তমান লোকেশন নিন",
      locating: "লোকেশন নেওয়া হচ্ছে...",
      saveManual: "ম্যানুয়ালি সংরক্ষণ",
      clear: "লোকেশন মুছুন",
      googleMaps: "Google Maps",
      openStreetMap: "OpenStreetMap",
      satellite: "Satellite",

      sourcePlaceholder: "যেমন: Brahmaputra River",
      latitudePlaceholder: "যেমন: 24.7471",
      longitudePlaceholder: "যেমন: 90.4203",

      saved: "লোকেশন সংরক্ষণ করা হয়েছে।",
      removed: "লোকেশন মুছে ফেলা হয়েছে।",
      invalidCoordinates: "সঠিক Latitude ও Longitude দিন।",
      unavailable:
        "এই ব্রাউজারে লোকেশন সুবিধা নেই। ম্যানুয়ালি Latitude ও Longitude দিন।",
      denied:
        "লোকেশন অনুমতি দেওয়া হয়নি। ব্রাউজার সেটিংস থেকে Location permission চালু করুন অথবা ম্যানুয়ালি তথ্য দিন।",
      positionUnavailable:
        "বর্তমান লোকেশন নির্ধারণ করা যাচ্ছে না। ম্যানুয়ালি Latitude ও Longitude দিন।",
      timeout:
        "লোকেশন নিতে সময় শেষ হয়েছে। পুনরায় চেষ্টা করুন অথবা ম্যানুয়ালি তথ্য দিন।",
      selectedSource: "নির্বাচিত পানি উৎস",
      currentSampleLocation: "বর্তমান পানি সংগ্রহের স্থান",
      mapLoading: "মানচিত্র লোড হচ্ছে...",
      invalidMapCoordinates:
        "সঠিক Latitude এবং Longitude পাওয়া যায়নি।",
      browserNote:
        "Browser GPS ব্যবহার করলে সাইটটি HTTPS-এ চালু থাকতে হবে। Vercel deployment-এ এটি স্বয়ংক্রিয়ভাবে HTTPS ব্যবহার করবে। ডেস্কটপে GPS নির্ভুলতা মোবাইলের তুলনায় কম হতে পারে।",
    },

    trends: {
      title: "পানির পরিমাপের প্রবণতা",
      description:
        "pH, আনুমানিক TDS এবং তাপমাত্রার সাম্প্রতিক পরিবর্তন।",
      noData: "কোনো ঐতিহাসিক ডেটা পাওয়া যায়নি।",
      ph: "pH প্রবণতা",
      tds: "আনুমানিক TDS প্রবণতা",
      temperature: "তাপমাত্রার প্রবণতা",
    },

    compare: {
      title: "পানি উৎস তুলনা",
      description:
        "pH, আনুমানিক TDS, তাপমাত্রা এবং প্রাথমিক নিরাপত্তা স্কোরের ভিত্তিতে উৎসভিত্তিক তুলনা।",
      best: "তুলনামূলকভাবে ভালো উৎস",
      worst: "তুলনামূলকভাবে ঝুঁকিপূর্ণ উৎস",
      tableTitle: "উৎসভিত্তিক তুলনামূলক টেবিল",
      source: "উৎস",
      temperature: "তাপমাত্রা",
      score: "স্কোর",
      status: "অবস্থা",
      suggestedUse: "প্রস্তাবিত ব্যবহার",
      summary: "সিদ্ধান্তের সারাংশ",
    },
  },

  en: {
    navigation: {
      brand: "Water Advisor",
      home: "Home",
      trends: "Trends",
      compare: "Compare",
      switchTo: "বাংলা",
      switchAria: "ওয়েবসাইটের ভাষা বাংলায় পরিবর্তন করুন",
    },

    home: {
      eyebrow: "Pani Bondhu · Water Advisor",
      title: "Pani Bondhu",
      subtitle:
        "Simple preliminary water-use guidance based on pH, estimated TDS, and temperature",

      source: "Source",
      sensor: "Sensor",
      lastUpdated: "Last updated",
      unknownTime: "Time unavailable",

      currentScore: "Current safety score",
      drinkingButton: "Can I drink it?",
      irrigationButton: "Use for irrigation?",
      downloadButton: "Download data",

      loadErrorTitle: "Latest data could not be loaded",

      overallStatus: "Overall status",
      decisionTitle: "Water-quality decision",
      safetyScore: "Safety score",

      ph: "pH",
      tds: "Estimated TDS",
      temperature: "Temperature",
      tdsNote:
        "Estimated using the DFRobot equation and a provisional correction factor",

      drinking: "Drinking",
      cooking: "Cooking",
      household: "Bathing and household use",
      irrigation: "Agriculture and irrigation",

      limitations: "Measurement limitations",
      turbidityRemoved:
        "The turbidity sensor has been removed from the current hardware version. No NTU or turbidity result is displayed.",
    },

    status: {
      safe: "Provisionally acceptable",
      caution: "Caution required",
      unsafe: "Unsafe",
      sensorError: "Sensor error",
      online: "Online",
      offline: "Offline",
      unknown: "Uncertain",
    },

    location: {
      eyebrow: "Sample location",
      title: "Water collection location",
      description:
        "Save where the sample was collected and display it on the map.",

      sourceName: "Source name",
      method: "Location method",
      browserGps: "Browser GPS",
      manualInput: "Manual input",
      accuracy: "GPS accuracy",
      latitude: "Latitude",
      longitude: "Longitude",
      capturedTime: "Saved at",
      manualUnknown: "Manual / unknown",

      updateLocation: "Update current location",
      updating: "Updating location...",
      currentLocation: "Use current location",
      locating: "Getting location...",
      saveManual: "Save manually",
      clear: "Remove location",
      googleMaps: "Google Maps",
      openStreetMap: "OpenStreetMap",
      satellite: "Satellite",

      sourcePlaceholder: "For example: Brahmaputra River",
      latitudePlaceholder: "For example: 24.7471",
      longitudePlaceholder: "For example: 90.4203",

      saved: "Location has been saved.",
      removed: "Location has been removed.",
      invalidCoordinates:
        "Enter valid latitude and longitude values.",
      unavailable:
        "Location services are unavailable in this browser. Enter latitude and longitude manually.",
      denied:
        "Location permission was denied. Enable it in the browser settings or enter the coordinates manually.",
      positionUnavailable:
        "The current location could not be determined. Enter the coordinates manually.",
      timeout:
        "The location request timed out. Try again or enter the coordinates manually.",
      selectedSource: "Selected water source",
      currentSampleLocation: "Current sample collection location",
      mapLoading: "Loading map...",
      invalidMapCoordinates:
        "Valid latitude and longitude values were not found.",
      browserNote:
        "Browser GPS requires HTTPS. Vercel automatically serves the deployment through HTTPS. Desktop location accuracy may be lower than mobile GPS accuracy.",
    },

    trends: {
      title: "Water measurement trends",
      description:
        "Recent changes in pH, estimated TDS, and temperature.",
      noData: "No historical data is available.",
      ph: "pH trend",
      tds: "Estimated TDS trend",
      temperature: "Temperature trend",
    },

    compare: {
      title: "Water-source comparison",
      description:
        "Source comparison based on pH, estimated TDS, temperature, and preliminary safety score.",
      best: "Comparatively better source",
      worst: "Comparatively higher-risk source",
      tableTitle: "Source comparison table",
      source: "Source",
      temperature: "Temperature",
      score: "Score",
      status: "Status",
      suggestedUse: "Suggested use",
      summary: "Decision summary",
    },
  },
} as const;

export function getDictionary(language: Language) {
  return translations[language];
}