"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LocationMap = dynamic(() => import("@/components/LocationMap"), {
  ssr: false,
});

type LocationData = {
  label: string;
  lat: string;
  lng: string;
  method: "browser" | "manual";
  accuracy?: number | null;
  capturedAt?: string;
};

const STORAGE_KEY = "water_advisor_location";

function isValidLatLng(lat: string, lng: string) {
  const la = Number(lat);
  const lo = Number(lng);

  return (
    Number.isFinite(la) &&
    Number.isFinite(lo) &&
    la >= -90 &&
    la <= 90 &&
    lo >= -180 &&
    lo <= 180
  );
}

function formatCapturedTime(iso?: string) {
  if (!iso) return "অজানা";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "অজানা";

  return date.toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default function LocationSourceCard() {
  const [location, setLocation] = useState<LocationData>({
    label: "",
    lat: "",
    lng: "",
    method: "manual",
    accuracy: null,
    capturedAt: "",
  });

  const [saved, setSaved] = useState<LocationData | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as LocationData;
      setSaved(parsed);
      setLocation(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function save(data: LocationData) {
    if (!isValidLatLng(data.lat, data.lng)) {
      setMessage("সঠিক Latitude ও Longitude দিন।");
      return;
    }

    const finalData: LocationData = {
      label: data.label.trim() || "নির্বাচিত পানি উৎস",
      lat: Number(data.lat).toFixed(6),
      lng: Number(data.lng).toFixed(6),
      method: data.method,
      accuracy: data.accuracy ?? null,
      capturedAt: data.capturedAt || new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
    setSaved(finalData);
    setLocation(finalData);
    setMessage("লোকেশন সংরক্ষণ করা হয়েছে।");
  }

  function saveManualLocation() {
    save({
      ...location,
      method: "manual",
      accuracy: null,
      capturedAt: new Date().toISOString(),
    });
  }

  function useCurrentLocation() {
    setMessage("");

    if (!navigator.geolocation) {
      setMessage("এই ব্রাউজারে লোকেশন সুবিধা নেই। ম্যানুয়ালি দিন।");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        save({
          label: location.label || "বর্তমান পানি সংগ্রহের স্থান",
          lat: String(position.coords.latitude),
          lng: String(position.coords.longitude),
          method: "browser",
          accuracy: position.coords.accuracy,
          capturedAt: new Date().toISOString(),
        });

        setLoading(false);
      },
      () => {
        setMessage("লোকেশন অনুমতি পাওয়া যায়নি। ম্যানুয়ালি Latitude/Longitude দিন।");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  function clearLocation() {
    localStorage.removeItem(STORAGE_KEY);
    setSaved(null);
    setLocation({
      label: "",
      lat: "",
      lng: "",
      method: "manual",
      accuracy: null,
      capturedAt: "",
    });
    setMessage("লোকেশন মুছে ফেলা হয়েছে।");
  }

  const googleMapUrl = saved
    ? `https://www.google.com/maps?q=${saved.lat},${saved.lng}`
    : "";

  const osmUrl = saved
    ? `https://www.openstreetmap.org/?mlat=${saved.lat}&mlon=${saved.lng}#map=16/${saved.lat}/${saved.lng}`
    : "";

  const satelliteUrl = saved
    ? `https://www.google.com/maps/@${saved.lat},${saved.lng},17z/data=!3m1!1e3`
    : "";

  return (
    <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur-sm shadow-sm">
      <h3 className="text-base md:text-lg font-bold text-white mb-3">
        📍 পানি সংগ্রহের স্থান
      </h3>

      {saved ? (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/15 border border-white/20 p-3">
              <p className="text-xs font-semibold text-blue-100">উৎসের নাম</p>
              <p className="text-white font-bold text-base md:text-lg">
                {saved.label}
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 border border-white/20 p-3">
              <p className="text-xs font-semibold text-blue-100">লোকেশন পদ্ধতি</p>
              <p className="text-white font-bold text-base md:text-lg">
                {saved.method === "browser" ? "ব্রাউজার GPS" : "ম্যানুয়াল ইনপুট"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 border border-white/20 p-3">
              <p className="text-xs font-semibold text-blue-100">Latitude</p>
              <p className="text-white font-bold text-base md:text-lg">
                {saved.lat}
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 border border-white/20 p-3">
              <p className="text-xs font-semibold text-blue-100">Longitude</p>
              <p className="text-white font-bold text-base md:text-lg">
                {saved.lng}
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 border border-white/20 p-3">
              <p className="text-xs font-semibold text-blue-100">GPS Accuracy</p>
              <p className="text-white font-bold text-base md:text-lg">
                {saved.accuracy ? `±${saved.accuracy.toFixed(1)} m` : "ম্যানুয়াল / অজানা"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 border border-white/20 p-3">
              <p className="text-xs font-semibold text-blue-100">লোকেশন নেওয়ার সময়</p>
              <p className="text-white font-bold text-base md:text-lg">
                {formatCapturedTime(saved.capturedAt)}
              </p>
            </div>
          </div>

          <LocationMap
            lat={Number(saved.lat)}
            lng={Number(saved.lng)}
            label={saved.label}
          />

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={useCurrentLocation}
              disabled={loading}
              className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-bold shadow hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "আপডেট হচ্ছে..." : "📡 লোকেশন আপডেট"}
            </button>

            <a
              href={googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white text-blue-700 px-4 py-2 text-sm font-bold shadow hover:bg-blue-50"
            >
              🗺️ Google Maps
            </a>

            <a
              href={osmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white text-blue-700 px-4 py-2 text-sm font-bold shadow hover:bg-blue-50"
            >
              🌍 OpenStreetMap
            </a>

            <a
              href={satelliteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white text-blue-700 px-4 py-2 text-sm font-bold shadow hover:bg-blue-50"
            >
              🛰️ Satellite
            </a>

            <button
              onClick={clearLocation}
              className="rounded-xl bg-rose-500 text-white px-4 py-2 text-sm font-bold shadow hover:bg-rose-600"
            >
              মুছে ফেলুন
            </button>
          </div>

          {message && (
            <p className="text-sm md:text-base font-semibold text-amber-100">
              {message}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid md:grid-cols-3 gap-2">
            <input
              value={location.label}
              onChange={(e) =>
                setLocation({ ...location, label: e.target.value })
              }
              placeholder="উৎসের নাম, যেমন Brahmaputra River"
              className="rounded-xl px-3 py-3 text-slate-900 outline-none text-base"
            />

            <input
              value={location.lat}
              onChange={(e) =>
                setLocation({ ...location, lat: e.target.value })
              }
              placeholder="Latitude"
              className="rounded-xl px-3 py-3 text-slate-900 outline-none text-base"
            />

            <input
              value={location.lng}
              onChange={(e) =>
                setLocation({ ...location, lng: e.target.value })
              }
              placeholder="Longitude"
              className="rounded-xl px-3 py-3 text-slate-900 outline-none text-base"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={useCurrentLocation}
              disabled={loading}
              className="rounded-xl bg-emerald-600 text-white px-4 py-3 font-bold shadow hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "লোকেশন নেওয়া হচ্ছে..." : "📡 বর্তমান লোকেশন নিন"}
            </button>

            <button
              onClick={saveManualLocation}
              className="rounded-xl bg-white text-blue-700 px-4 py-3 font-bold shadow hover:bg-blue-50"
            >
              ✍️ ম্যানুয়ালি সংরক্ষণ
            </button>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
            <p className="text-sm md:text-base text-blue-50 leading-7">
              লোকেশন দিলে পানির নমুনা কোথা থেকে সংগ্রহ করা হয়েছে তা মানচিত্রে
              দেখা যাবে। কোনো GPS হার্ডওয়্যার ছাড়াই ব্রাউজার লোকেশন বা ম্যানুয়াল
              Latitude/Longitude ব্যবহার করা যায়।
            </p>
          </div>

          {message && (
            <p className="text-sm md:text-base font-semibold text-amber-100">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}