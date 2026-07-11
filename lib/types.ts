export type WaterStatus =
  | "Safe"
  | "Caution"
  | "Unsafe"
  | "Sensor Error";

export type WaterStatusCode = 1 | 2 | 3 | 4;

export interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;

  field1: string | null; // calibrated pH
  field2: string | null; // corrected estimated TDS
  field3: string | null; // temperature
  field4: string | null; // Arduino status code
}

export interface ThingSpeakChannel {
  id: number;
  name: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  field1?: string;
  field2?: string;
  field3?: string;
  field4?: string;
  created_at?: string;
  updated_at?: string;
  last_entry_id?: number;
}

export interface ThingSpeakResponse {
  channel: ThingSpeakChannel;
  feeds: ThingSpeakFeed[];
}

export interface WaterSample {
  entryId: number;
  createdAt: string;
  ph: number | null;
  tds: number | null;
  temperature: number | null;
  statusCode: WaterStatusCode | null;
}

export interface ParameterAssessment {
  status: "good" | "caution" | "unsafe" | "unavailable";
  labelBn: string;
  messageBn: string;
}

export interface AdvisoryResult {
  overallStatus: WaterStatus;
  score: number;

  drinking: string;
  cooking: string;
  bathing: string;
  irrigation: string;
  livestock: string;

  summaryBn: string;
  reasons: string[];

  phAssessment: ParameterAssessment;
  tdsAssessment: ParameterAssessment;
  temperatureAssessment: ParameterAssessment;

  measurementNoticeBn: string;
}

export interface DeviceStatusInfo {
  isOnline: boolean;
  status: "online" | "offline" | "unknown";
  labelBn: string;
  descriptionBn: string;
  ageMinutes: number | null;
  lastUpdatedText: string;
}

export interface CompareProfile {
  id: string;
  nameBn: string;
  nameEn: string;

  ph: number;
  temperature: number;
  tds: number;

  score: number;
  status: "Safe" | "Caution" | "Unsafe";

  bestUseBn: string;
  noteBn: string;
}