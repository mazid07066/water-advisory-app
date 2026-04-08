export type CompareProfile = {
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