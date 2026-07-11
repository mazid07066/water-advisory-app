"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const LocationMap = dynamic(
  () => import("@/components/LocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[340px] w-full items-center justify-center rounded-2xl border border-white/20 bg-white/10">
        <p className="text-base font-semibold text-white">
          মানচিত্র লোড হচ্ছে...
        </p>
      </div>
    ),
  }
);

type LocationData = {
  label: string;
  lat: string;
  lng: string;
  method: "browser" | "manual";
  accuracy?: number | null;
  capturedAt?: string;
};

const STORAGE_KEY = "water_advisor_location";

const EMPTY_LOCATION: LocationData = {
  label: "",
  lat: "",
  lng: "",
  method: "manual",
  accuracy: null,
  capturedAt: "",
};

function readStoredLocation(): LocationData | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as LocationData;

    if (!isValidLatLng(parsed.lat, parsed.lng)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function isValidLatLng(lat: string, lng: string): boolean {
  const latitude = Number(lat);
  const longitude = Number(lng);

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function formatCapturedTime(iso?: string): string {
  if (!iso) {
    return "অজানা";
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "অজানা";
  }

  return new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

export default function LocationSourceCard() {
  const [initialStoredLocation] =
    useState<LocationData | null>(() => readStoredLocation());

  const [location, setLocation] =
    useState<LocationData>(
      initialStoredLocation ?? EMPTY_LOCATION
    );

  const [saved, setSaved] =
    useState<LocationData | null>(initialStoredLocation);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function save(data: LocationData): void {
    if (!isValidLatLng(data.lat, data.lng)) {
      setMessage("সঠিক Latitude ও Longitude দিন।");
      return;
    }

    const finalData: LocationData = {
      label:
        data.label.trim() || "নির্বাচিত পানি উৎস",
      lat: Number(data.lat).toFixed(6),
      lng: Number(data.lng).toFixed(6),
      method: data.method,
      accuracy: data.accuracy ?? null,
      capturedAt:
        data.capturedAt || new Date().toISOString(),
    };

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(finalData)
    );

    setSaved(finalData);
    setLocation(finalData);
    setMessage("লোকেশন সংরক্ষণ করা হয়েছে।");
  }

  function saveManualLocation(): void {
    save({
      ...location,
      method: "manual",
      accuracy: null,
      capturedAt: new Date().toISOString(),
    });
  }

  function useCurrentLocation(): void {
    setMessage("");

    if (!navigator.geolocation) {
      setMessage(
        "এই ব্রাউজারে লোকেশন সুবিধা নেই। ম্যানুয়ালি Latitude ও Longitude দিন।"
      );
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        save({
          label:
            location.label.trim() ||
            "বর্তমান পানি সংগ্রহের স্থান",
          lat: String(position.coords.latitude),
          lng: String(position.coords.longitude),
          method: "browser",
          accuracy: position.coords.accuracy,
          capturedAt: new Date().toISOString(),
        });

        setLoading(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setMessage(
            "লোকেশন অনুমতি দেওয়া হয়নি। ব্রাউজার সেটিংস থেকে Location permission চালু করুন অথবা ম্যানুয়ালি Latitude ও Longitude দিন।"
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setMessage(
            "বর্তমান লোকেশন নির্ধারণ করা যাচ্ছে না। ম্যানুয়ালি Latitude ও Longitude দিন।"
          );
        } else {
          setMessage(
            "লোকেশন নিতে সময় শেষ হয়েছে। পুনরায় চেষ্টা করুন অথবা ম্যানুয়ালি তথ্য দিন।"
          );
        }

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  function clearLocation(): void {
    window.localStorage.removeItem(STORAGE_KEY);

    setSaved(null);
    setLocation(EMPTY_LOCATION);
    setMessage("লোকেশন মুছে ফেলা হয়েছে।");
  }

  const latitude = saved ? Number(saved.lat) : null;
  const longitude = saved ? Number(saved.lng) : null;

  const googleMapUrl =
    saved && latitude !== null && longitude !== null
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : "";

  const osmUrl =
    saved && latitude !== null && longitude !== null
      ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`
      : "";

  const satelliteUrl =
    saved && latitude !== null && longitude !== null
      ? `https://www.google.com/maps/@${latitude},${longitude},17z/data=!3m1!1e3`
      : "";

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-5 text-white shadow-xl md:p-7">
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-100">
          Sample Location
        </p>

        <h2 className="mt-1 text-2xl font-black md:text-3xl">
          📍 পানি সংগ্রহের স্থান
        </h2>

        <p className="mt-2 max-w-3xl text-base font-medium leading-7 text-blue-50">
          নমুনাটি কোথা থেকে সংগ্রহ করা হয়েছে তা সংরক্ষণ
          করুন এবং মানচিত্রে দেখুন।
        </p>
      </div>

      {saved &&
      latitude !== null &&
      longitude !== null ? (
        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-blue-100">
                উৎসের নাম
              </p>
              <p className="mt-1 text-lg font-bold">
                {saved.label}
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-blue-100">
                লোকেশন পদ্ধতি
              </p>
              <p className="mt-1 text-lg font-bold">
                {saved.method === "browser"
                  ? "ব্রাউজার GPS"
                  : "ম্যানুয়াল ইনপুট"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-blue-100">
                GPS Accuracy
              </p>
              <p className="mt-1 text-lg font-bold">
                {saved.accuracy
                  ? `±${saved.accuracy.toFixed(1)} m`
                  : "ম্যানুয়াল / অজানা"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-blue-100">
                Latitude
              </p>
              <p className="mt-1 text-lg font-bold">
                {saved.lat}
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-blue-100">
                Longitude
              </p>
              <p className="mt-1 text-lg font-bold">
                {saved.lng}
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-blue-100">
                সংরক্ষণের সময়
              </p>
              <p className="mt-1 text-base font-bold">
                {formatCapturedTime(saved.capturedAt)}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-2 shadow-lg">
            <LocationMap
              lat={latitude}
              lng={longitude}
              label={saved.label}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={useCurrentLocation}
              disabled={loading}
              className="rounded-xl bg-emerald-500 px-4 py-3 text-base font-bold text-white shadow transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "লোকেশন আপডেট হচ্ছে..."
                : "📡 বর্তমান লোকেশন আপডেট"}
            </button>

            <a
              href={googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white px-4 py-3 text-base font-bold text-blue-700 shadow transition hover:bg-blue-50"
            >
              🗺️ Google Maps
            </a>

            <a
              href={osmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white px-4 py-3 text-base font-bold text-blue-700 shadow transition hover:bg-blue-50"
            >
              🌍 OpenStreetMap
            </a>

            <a
              href={satelliteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white px-4 py-3 text-base font-bold text-blue-700 shadow transition hover:bg-blue-50"
            >
              🛰️ Satellite
            </a>

            <button
              type="button"
              onClick={clearLocation}
              className="rounded-xl bg-rose-500 px-4 py-3 text-base font-bold text-white shadow transition hover:bg-rose-600"
            >
              লোকেশন মুছুন
            </button>
          </div>

          {message ? (
            <p
              aria-live="polite"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base font-semibold text-amber-100"
            >
              {message}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-3">
            <label className="space-y-2">
              <span className="text-base font-bold">
                উৎসের নাম
              </span>

              <input
                value={location.label}
                onChange={(event) =>
                  setLocation({
                    ...location,
                    label: event.target.value,
                  })
                }
                placeholder="যেমন: Brahmaputra River"
                className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none focus:ring-4 focus:ring-blue-300/40"
              />
            </label>

            <label className="space-y-2">
              <span className="text-base font-bold">
                Latitude
              </span>

              <input
                value={location.lat}
                onChange={(event) =>
                  setLocation({
                    ...location,
                    lat: event.target.value,
                  })
                }
                inputMode="decimal"
                placeholder="যেমন: 24.7471"
                className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none focus:ring-4 focus:ring-blue-300/40"
              />
            </label>

            <label className="space-y-2">
              <span className="text-base font-bold">
                Longitude
              </span>

              <input
                value={location.lng}
                onChange={(event) =>
                  setLocation({
                    ...location,
                    lng: event.target.value,
                  })
                }
                inputMode="decimal"
                placeholder="যেমন: 90.4203"
                className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none focus:ring-4 focus:ring-blue-300/40"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={useCurrentLocation}
              disabled={loading}
              className="rounded-xl bg-emerald-500 px-5 py-3 text-base font-bold text-white shadow transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "লোকেশন নেওয়া হচ্ছে..."
                : "📡 বর্তমান লোকেশন নিন"}
            </button>

            <button
              type="button"
              onClick={saveManualLocation}
              className="rounded-xl bg-white px-5 py-3 text-base font-bold text-blue-700 shadow transition hover:bg-blue-50"
            >
              ✍️ ম্যানুয়ালি সংরক্ষণ
            </button>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
            <p className="text-base font-medium leading-7 text-blue-50">
              Browser GPS ব্যবহার করলে সাইটটি HTTPS-এ চালু থাকতে
              হবে। Vercel deployment-এ এটি স্বয়ংক্রিয়ভাবে HTTPS
              ব্যবহার করবে। ডেস্কটপে GPS নির্ভুলতা মোবাইলের তুলনায়
              কম হতে পারে।
            </p>
          </div>

          {message ? (
            <p
              aria-live="polite"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base font-semibold text-amber-100"
            >
              {message}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}