export type SourceProfile = {
  id: string;
  nameBn: string;
  nameEn: string;
  pH: number;
  temp: number;
  tds: number;
  turbidity: number;
  score: number;
  status: "Safe" | "Caution" | "Unsafe";
  bestUseBn: string;
  noteBn: string;
};

export const sourceProfiles: SourceProfile[] = [
  {
    id: "brahmaputra",
    nameBn: "ব্রহ্মপুত্র নদীর পানি",
    nameEn: "Brahmaputra River Water",
    pH: 6.9,
    temp: 27.4,
    tds: 320,
    turbidity: 18,
    score: 62,
    status: "Caution",
    bestUseBn: "সীমিত সেচ ও সাধারণ ব্যবহারে উপযোগী",
    noteBn:
      "নদীর পানিতে ঘোলাভাব বেশি হতে পারে। সরাসরি পান করার জন্য উপযুক্ত নয়।",
  },
  {
    id: "pond",
    nameBn: "পুকুরের পানি",
    nameEn: "Pond Water",
    pH: 6.4,
    temp: 28.3,
    tds: 410,
    turbidity: 24,
    score: 48,
    status: "Unsafe",
    bestUseBn: "পরিশোধন ছাড়া পান করা অনিরাপদ",
    noteBn:
      "জৈব দূষণ ও ঘোলাভাবের ঝুঁকি বেশি। পান ও রান্নার আগে অবশ্যই পরিশোধন প্রয়োজন।",
  },
  {
    id: "rain",
    nameBn: "সংরক্ষিত বৃষ্টির পানি",
    nameEn: "Stored Rain Water",
    pH: 6.8,
    temp: 26.5,
    tds: 110,
    turbidity: 4,
    score: 81,
    status: "Safe",
    bestUseBn: "পরিশোধনের পরে গৃহস্থালী ব্যবহারে উপযোগী",
    noteBn:
      "ভালোভাবে সংরক্ষণ করা হলে এটি তুলনামূলক নিরাপদ উৎস হতে পারে।",
  },
  {
    id: "drinking",
    nameBn: "পানযোগ্য পানি",
    nameEn: "Drinking Water",
    pH: 7.1,
    temp: 25.8,
    tds: 85,
    turbidity: 2,
    score: 91,
    status: "Safe",
    bestUseBn: "পান ও রান্নার জন্য সবচেয়ে উপযোগী",
    noteBn:
      "এই উৎসটি গৃহস্থালী ব্যবহারের জন্য সবচেয়ে নিরাপদ হিসেবে ধরা হচ্ছে।",
  },
];