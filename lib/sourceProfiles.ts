import type {
  CompareProfile,
} from "@/lib/types";

export const sourceProfiles: CompareProfile[] = [
  {
    id: "brahmaputra",
    nameBn: "ব্রহ্মপুত্র নদীর পানি",
    nameEn: "Brahmaputra River Water",
    ph: 7.4,
    temperature: 25.8,
    tds: 154.1,
    score: 58,
    status: "Caution",
    bestUseBn: "পরীক্ষা সাপেক্ষে সেচ",
    noteBn:
      "ঋতু ও নমুনা স্থানের কারণে নদীর পানির মান পরিবর্তিত হতে পারে।",
  },
  {
    id: "pond",
    nameBn: "পুকুরের পানি",
    nameEn: "Pond Water",
    ph: 7.0,
    temperature: 26.1,
    tds: 415.8,
    score: 40,
    status: "Unsafe",
    bestUseBn: "শোধন ছাড়া পান বা রান্নায় নয়",
    noteBn:
      "জীবাণু ও জৈব দূষণের ঝুঁকি বর্তমান সেন্সর দ্বারা শনাক্ত হয় না।",
  },
  {
    id: "rain",
    nameBn: "সংরক্ষিত বৃষ্টির পানি",
    nameEn: "Stored Rain Water",
    ph: 6.3,
    temperature: 25.3,
    tds: 91.3,
    score: 75,
    status: "Caution",
    bestUseBn: "শোধনের পর গৃহস্থালি ব্যবহার",
    noteBn:
      "সংরক্ষণের পাত্র ও জীবাণুজনিত দূষণ যাচাই করা প্রয়োজন।",
  },
  {
    id: "drinking",
    nameBn: "পরিশোধিত পানীয় জল",
    nameEn: "Treated Drinking Water",
    ph: 7.2,
    temperature: 25.6,
    tds: 394.3,
    score: 90,
    status: "Safe",
    bestUseBn: "যাচাই সাপেক্ষে পান ও রান্না",
    noteBn:
      "জীবাণু ও রাসায়নিক দূষণ পরীক্ষাগারে যাচাই করা প্রয়োজন।",
  },
];