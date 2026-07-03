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

export default function LocationSourceCard() {
  const [location, setLocation] = useState<LocationData>({
    label: "",
    lat: "",
    lng: "",
    method: "manual",
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
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
    setSaved(finalData);
    setLocation(finalData);
    setMessage("লোকেশন সংরক্ষণ করা হয়েছে।");
  }

  function saveManualLocation() {
    save({ ...location, method: "manual" });
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
    });
    setMessage("লোকেশন মুছে ফেলা হয়েছে।");
  }

  const mapUrl = saved
    ? `https://www.google.com/maps?q=${saved.lat},${saved.lng}`
    : "";

  return (
    <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur-sm shadow-sm">
      <h3 className="text-base md:text-lg font-bold text-white mb-3">
        📍 পানি সংগ্রহের স্থান
      </h3>

      {saved ? (
        <div className="space-y-3">
          <div>
            <p className="text-white font-semibold">উৎস: {saved.label}</p>
            <p className="text-blue-50 text-sm md:text-base">
              Latitude: {saved.lat} | Longitude: {saved.lng}
            </p>
            <p className="text-blue-100 text-xs md:text-sm font-medium">
              পদ্ধতি:{" "}
              {saved.method === "browser" ? "ব্রাউজার লোকেশন" : "ম্যানুয়াল ইনপুট"}
            </p>
          </div>

          <LocationMap
            lat={Number(saved.lat)}
            lng={Number(saved.lng)}
            label={saved.label}
          />

          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white text-blue-700 px-4 py-2 text-sm font-bold shadow hover:bg-blue-50"
            >
              🗺️ Google Maps
            </a>

            <button
              onClick={clearLocation}
              className="rounded-xl bg-rose-500 text-white px-4 py-2 text-sm font-bold shadow hover:bg-rose-600"
            >
              মুছে ফেলুন
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid md:grid-cols-3 gap-2">
            <input
              value={location.label}
              onChange={(e) => setLocation({ ...location, label: e.target.value })}
              placeholder="উৎসের নাম, যেমন Brahmaputra River"
              className="rounded-xl px-3 py-3 text-slate-900 outline-none text-base"
            />

            <input
              value={location.lat}
              onChange={(e) => setLocation({ ...location, lat: e.target.value })}
              placeholder="Latitude"
              className="rounded-xl px-3 py-3 text-slate-900 outline-none text-base"
            />

            <input
              value={location.lng}
              onChange={(e) => setLocation({ ...location, lng: e.target.value })}
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